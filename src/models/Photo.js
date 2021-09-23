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
}
