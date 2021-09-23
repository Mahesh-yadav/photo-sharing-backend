import { db } from '../db/connection';

export default class User {
  static collectionName = 'users';

  static async getUser(userId) {
    const user = await db.getDb().collection(User.collectionName).findOne({
      id: userId,
    });

    return user;
  }

  static async getUserByEmail(email) {
    const user = await db.getDb().collection(User.collectionName).findOne({
      email,
    });

    return user;
  }
}
