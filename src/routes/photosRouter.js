import express from 'express';
import fileUpload from 'express-fileupload';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

import { protectRoute } from '../middlewares/protectRoute';
import Photo from '../models/Photo';

const router = express.Router();

router.use(protectRoute);
router.use('/upload', fileUpload());

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

router.get('/:photoId', async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const { photoId } = req.params;

    const photo = await Photo.getPhoto(photoId);

    if (photo.ownerId === user_id) {
      const populatedPhoto = await Photo.getPopulatedPhoto(photoId);
      return res.json({ data: populatedPhoto });
    } else if (photo.sharedWith.includes(user_id)) {
      delete photo.sharedWith;
      return res.json({ data: photo });
    } else {
      return res
        .status(401)
        .json({ message: 'User not allowed to access photo' });
    }
  } catch (error) {
    next(error);
  }
});

router.post('/:photoId/share', async (req, res, next) => {
  try {
    const { photoId } = req.params;
    const { user_id } = req.user;
    const { email } = req.body;

    const photo = await Photo.getPhoto(photoId);

    if (photo.ownerId === user_id) {
      await Photo.sharePhotoWithUser(photoId, email);
      const updatedPhoto = await Photo.getPopulatedPhoto(photoId);
      return res.json({ data: updatedPhoto });
    } else {
      return res
        .status(401)
        .json({ message: 'User not allowed to share photo' });
    }
  } catch (error) {
    next(error);
  }
});

router.post('/upload', async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const { title } = req.body;
    const { file } = req.files;
    const fileExtension = extname(file.name);
    const newFileName = uuid() + fileExtension;

    await Photo.addPhoto(`/${newFileName}`, title, user_id);

    await file.mv(`dist/uploads/${newFileName}`);

    res.json({ message: 'Upload successful' });
  } catch (error) {
    next(error);
  }
});

export default router;
