import { Router } from 'express';

const router = Router();

/**
 * Get basic profile information.
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 */
const getProfileInfo = (req, res) => {
  res.render('start');
};

router
  .route('/')
  .get((req, res) => getProfileInfo(req, res));

export default router;
