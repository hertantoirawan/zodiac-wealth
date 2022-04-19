import { Router } from 'express';

const router = Router();

const showSplashScreen = (req, res) => {
  res.render('splash');
};

router
  .route('/')
  .get((req, res) => showSplashScreen(req, res));

export default router;
