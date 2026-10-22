import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { config } from '../config/env';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime', 'video/x-matroska'];
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav', 'audio/aac', 'audio/m4a'];
const ALL_ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES, ...ALLOWED_AUDIO_TYPES];

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (ALL_ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed. Allowed types: images, videos, and audio files.`));
  }
};

const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const storage = multer.memoryStorage();
const maxSizeBytes = config.MAX_FILE_SIZE_MB * 1024 * 1024;

export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxSizeBytes },
}).single('file');

export const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxSizeBytes, files: 10 },
}).array('files', 10);

export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB for images
}).single('image');

export const uploadAvatar = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB for avatars
}).single('avatar');
