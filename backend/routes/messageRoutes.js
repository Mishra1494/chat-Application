import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';;
import { sendMessage, getMessages } from '../controllers/messageController.js';


const router = express.Router();

router.post('/send/:recieverId', isAuthenticated , sendMessage);

router.get('/get/:Id', isAuthenticated , getMessages);


export default router;