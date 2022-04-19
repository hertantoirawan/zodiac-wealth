import { Router } from 'express';
import pool from '../models/dbConnect.js';
import { getHashValue } from '../models/helper.util.js';

const router = Router();

const createUser = async (sign) => {
  const query = 'insert into app_user (birth_month, birth_day, sign_id) values ($1, $2, $3) returning id';
  const inputData = [sign.birthMonth, sign.birthDay, sign.id];

  try {
    const result = await pool.query(query, inputData);
    return result.rows[0].id;
  } catch (err) {
    console.log('Error executing query', err.stack);
    return null;
  }
};

/**
 * Create a new user.
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 * @returns Redirection to login page.
 */
const createUserAuth = async (req, res) => {
  const { sign } = req.cookies;
  const id = await createUser(sign);
  if (!id) {
    res.redirect('/login');
    return;
  }

  const query = 'insert into auth (user_id, username, password) values($1, $2, $3)';

  const hashedPassword = getHashValue(req.body.password);
  const inputData = [id, req.body.username, hashedPassword];

  pool.query(query, inputData, (err, result) => {
    if (err) {
      console.log('Error executing query', err.stack);
      res.status(503).send(result.rows);
      return;
    }

    res.redirect('/login');
  });
};

router
  .route('/')
  .post((req, res) => createUserAuth(req, res));

export default router;
