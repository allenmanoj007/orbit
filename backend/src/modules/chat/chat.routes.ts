import { Router } from 'express';
import { chatController } from './chat.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { sendMessageSchema, reactMessageSchema } from './chat.schema';

const router = Router();

router.use(authenticate);

router.get('/conversations', chatController.getConversations);
router.post('/conversations/direct/:targetUserId', chatController.getOrCreateDirectConversation);
router.get('/conversations/:conversationId/messages', chatController.getMessages);
router.post('/messages', validate(sendMessageSchema), chatController.sendMessage);
router.post('/messages/:messageId/react', validate(reactMessageSchema), chatController.reactMessage);
router.delete('/messages/:messageId', chatController.deleteMessage);

export default router;
