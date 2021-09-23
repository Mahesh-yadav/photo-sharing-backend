import express from 'express';
import { protectRoute } from '../middlewares/protectRoute';
import Photo from '../models/Photo';

const router = express.Router();

router.use(protectRoute);

router.get('/my', async (req, res, next) => {
  try {
    const photos = await Photo.getPhotosForUser(req.user.user_id);

    res.json({ data: photos });
  } catch (error) {
    next(error);
  }
});

router.get('/shared', async (req, res, next) => {
  try {
    const sharedPhotos = await Photo.getSharedPhotosForUser(req.user.user_id);

    res.json({ data: sharedPhotos });
  } catch (error) {
    next(error);
  }
});

export default router;
