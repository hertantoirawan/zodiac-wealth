import { Router } from 'express';
import pool from '../models/dbConnect.js';
import { getHashValue } from '../models/helper.util.js';

const router = Router();

/**
 * Get user login form.
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 */
const getUserLogin = (req, res) => {
  res.render('login', { source: 'login', error: '' });
};

/**
 * Log a user in.
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 * @returns Redirection to home page.
 */
const logUserIn = (req, res) => {
  const query = ` select au.id, a.username, a.password, au.name 
                  from auth a 
                  inner join app_user au on a.user_id=au.id
                  where a.username=$1;`;
  const inputData = [req.body.username];

  pool.query(query, inputData, (err, result) => {
    if (err) {
      console.log('Error executing query', err.stack);
      res.status(503).send(result.rows);
      return;
    }

    if (result.rows.length === 0) {
      // we didnt find a user with that username.
      res.status(401).render('login', { source: 'login', error: 'The login information is incorrect.' });
      return;
    }

    const user = result.rows[0];

    if (user.password === getHashValue(req.body.password)) {
      res.cookie('user', { id: user.id, username: user.username, name: user.name });
      res.redirect(req.app.locals.prevUrl);
    } else {
      // password didn't match
      res.status(401).render('login', { source: 'login', error: 'The login information is incorrect.' });
    }
  });
};

router
  .route('/')
  .get((req, res) => getUserLogin(req, res))
  .post((req, res) => logUserIn(req, res));

export default router;
