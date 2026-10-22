import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../../config/database';
import { config } from '../../config/env';

export class MediaService {
  async processAndSaveMedia(file: Express.Multer.File, userId: string) {
    const isImage = file.mimetype.startsWith('image/');
    const isVideo = file.mimetype.startsWith('video/');
    const isAudio = file.mimetype.startsWith('audio/');

    let mediaType: 'IMAGE' | 'VIDEO' | 'VOICE' | 'DOCUMENT' = 'DOCUMENT';
    if (isImage) mediaType = 'IMAGE';
    else if (isVideo) mediaType = 'VIDEO';
    else if (isAudio) mediaType = 'VOICE';

    let width: number | undefined;
    let height: number | undefined;
    let thumbnailKey: string | undefined;

    const fileId = uuidv4();
    const uploadsDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    let finalBuffer = file.buffer;
    let extension = path.extname(file.originalname) || '.bin';

    if (isImage && !file.mimetype.includes('gif')) {
      // Optimize image with sharp
      const imageInfo = sharp(file.buffer);
      const metadata = await imageInfo.metadata();
      width = metadata.width;
      height = metadata.height;

      finalBuffer = await imageInfo
        .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();

      extension = '.jpg';

      // Generate thumbnail
      const thumbBuffer = await sharp(file.buffer)
        .resize(300, 300, { fit: 'cover' })
        .jpeg({ quality: 75 })
        .toBuffer();

      thumbnailKey = `thumb_${fileId}.jpg`;
      await fs.writeFile(path.join(uploadsDir, thumbnailKey), thumbBuffer);
    }

    const s3Key = `${fileId}${extension}`;
    await fs.writeFile(path.join(uploadsDir, s3Key), finalBuffer);

    // Create DB record
    const attachment = await prisma.mediaAttachment.create({
      data: {
        s3Key,
        s3Bucket: config.S3_BUCKET_NAME || 'orbit-local',
        contentType: isImage ? 'image/jpeg' : file.mimetype,
        fileSize: finalBuffer.length,
        width,
        height,
        thumbnailS3Key: thumbnailKey,
      },
    });

    const publicUrl = `/uploads/${s3Key}`;
    const thumbUrl = thumbnailKey ? `/uploads/${thumbnailKey}` : publicUrl;

    return {
      ...attachment,
      url: publicUrl,
      thumbnailUrl: thumbUrl,
    };
  }
}

export const mediaService = new MediaService();
