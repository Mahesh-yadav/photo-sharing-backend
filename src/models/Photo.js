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
}
