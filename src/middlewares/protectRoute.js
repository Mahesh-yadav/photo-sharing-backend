import * as firebase from 'firebase-admin';

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.authtoken;

    if (!token) {
      return res.status(401).json({ message: 'Not Authorized' });
    }

    const user = await firebase.auth().verifyIdToken(token);

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not Authorized' });
  }
};
