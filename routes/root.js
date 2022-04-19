import { Router } from 'express';

const router = Router();

/**
 * Show splash screen.
 * @param {*} req Request object.
 * @param {*} res Response object.
 */
const showSplashScreen = (req, res) => {
  res.render('splash');
};

router
  .route('/')
  .get((req, res) => showSplashScreen(req, res));

export default router;
