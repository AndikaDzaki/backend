import express from 'express';
import { saveSubscription, sendNotification } from '../controller/pushnotification.js';

const router = express.Router();

router.post('/subscribe', saveSubscription);
router.post('/notify', sendNotification);

export default router;
