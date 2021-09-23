import { ObjectId } from 'mongodb';
import User from './User';
import { db } from '../db/connection';

export default class Photo {
  static collectionName = 'photos';

  static async getPhotosForUser(userId) {
    const database = db.getDb();

    const photos = await database
      .collection(Photo.collectionName)
      .find({
        ownerId: userId,
      })
      .toArray();

    return photos;
  }

  static async getSharedPhotosForUser(userId) {
    const database = db.getDb();

    const photos = await database
      .collection(Photo.collectionName)
      .find({
        sharedWith: userId,
      })
      .toArray();

    return photos;
  }

  static async addPhoto(url, title, userId) {
    const database = db.getDb();

    await database.collection(Photo.collectionName).insertOne({
      title,
      url,
      ownerId: userId,
      sharedWith: [],
    });
  }

  static async getPopulatedPhoto(photoId) {
    const photo = await Photo.getPhoto(photoId);
    const sharedUsers = await Promise.all(
      photo.sharedWith.map((userId) => User.getUser(userId))
    );

    const sharedUsersEmails = sharedUsers.map((user) => user.email);

    return {
      ...photo,
      sharedWithEmails: sharedUsersEmails,
    };
  }

  static async getPhoto(photoId) {
    const photo = await db
      .getDb()
      .collection(Photo.collectionName)
      .findOne({
        _id: ObjectId(photoId),
      });

    return photo;
  }

  static async sharePhotoWithUser(photoId, email) {
    const user = await User.getUserByEmail(email);

    if (user) {
      await db
        .getDb()
        .collection(Photo.collectionName)
        .updateOne(
          {
            _id: ObjectId(photoId),
          },
          {
            $addToSet: {
              sharedWith: user.id,
            },
          }
        );
    }
  }
}
