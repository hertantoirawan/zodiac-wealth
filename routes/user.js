import { Router } from 'express';
import pool from '../models/dbConnect.js';
import { isLoggedIn } from '../models/helper.util.js';

const router = Router();

const getUserProfile = (req, res) => {
  if (!isLoggedIn(req)) {
    res.locals.prevUrl = '/user';
    res.redirect('/login');
    return;
  }

  const { name } = req.cookies.user;
  res.render('user', { name });
};

const saveProfile = async (req, res) => {
  if (!isLoggedIn(req)) {
    res.locals.prevUrl = '/user';
    res.redirect('/login');
    return;
  }

  const { name, username } = req.body;
  const userID = req.cookies.user.id;

  const appUserQuery = 'update app_user set name=$1, edited_at=now() where id=$2';
  await pool.query(appUserQuery, [name, userID]);

  res.cookie('user', { id: userID, username, name });

  const authQuery = 'update auth set username=$1, edited_at=now() where user_id=$2';
  await pool.query(authQuery, [username, userID]);

  res.render('user', { name });
};

router
  .route('/')
  .get((req, res) => getUserProfile(req, res))
  .post((req, res) => saveProfile(req, res));

export default router;
