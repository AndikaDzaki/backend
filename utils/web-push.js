import webPush from 'web-push';
import 'dotenv/config';

webPush.setVapidDetails(
  'mailto:andikadzaki02@gmail.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default webPush;
