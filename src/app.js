import express from 'express';
import morgan from 'morgan';
import * as firebase from 'firebase-admin';
import firebaseCredentials from '../firebase-credentials.json';
import photosRouter from './routes/photosRouter';

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseCredentials),
});

const app = express();

// Logging middleware
app.use(morgan('dev'));

// Server static files
app.use(express.static(__dirname + '/uploads/'));

// JSON req body parser middleware
app.use(express.json());

// Mount routers
app.use('/photos', photosRouter);

export default app;
