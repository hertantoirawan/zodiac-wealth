import { Router } from 'express';
import yahooFinance from 'yahoo-finance2';
import pool from '../models/dbConnect.js';
import { isLoggedIn } from '../models/helper.util.js';
import { compare } from '../models/compare.js';

const router = Router();

/**
 * Add buy/sell/hold recommendation to stock in wish list.
 * @param {Array} wishList Wish list.
 */
const addDetailsToWishlist = async (wishList) => {
  const list = wishList;

  try {
    const promises = list.map(async (stock) => {
      const result = await yahooFinance.insights(stock.symbol);
      return result.recommendation.rating;
    });

    const recommendations = await Promise.all(promises);
    for (let index = 0; index < list.length; index += 1) {
      list[index].rating = recommendations[index];
    }
  } catch (error) {
    console.log('Error adding company details', error.stack);
  }
};

/**
 * Add stock to wish list.
 * @param {string} stock Stock symbol.
 * @param {Number} matchid Match ID.
 * @param {Number} userID User ID of wish list.
 */
const addToWishList = async (stock, matchid, userID) => {
  const query = ` insert into wishlist (user_id, company_id, match_id) 
                  select $1, id, $3 from company where symbol=$2
                  and id not in (select company_id from wishlist where user_id=$1);`;
  const inputData = [userID, stock, matchid];

  try {
    await pool.query(query, inputData);
  } catch (err) {
    console.log('Error executing query', err.stack);
  }
};

/**
 * Get wish list data.
 * @param {Number} userID User ID.
 * @returns User's wish list.
 */
const getUserWishList = async (userID) => {
  const query = ` select c.id, c.name, c.symbol, i.name as industry, s.name as company_zodiac, m.rating as match_rating
                  from wishlist w 
                  inner join company c on w.company_id=c.id
                  inner join industry i on c.industry_id=i.id
                  inner join sign s on c.sign_id=s.id
                  inner join match m on w.match_id=m.id
                  where w.user_id=$1;`;
  const inputData = [userID];

  try {
    const result = await pool.query(query, inputData);
    return result.rows;
  } catch (err) {
    console.log('Error executing query', err.stack);
    return null;
  }
};

/**
 * Get wish list.
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 * @returns Wish list.
 */
const getWishList = async (req, res) => {
  const { stock, matchid } = req.query;

  let { sortBy, sortOrder } = req.query;
  if (!sortBy) sortBy = 'symbol';
  if (!sortOrder) sortOrder = 'asc';

  if (!isLoggedIn(req)) {
    res.locals.prevUrl = `/wish?stock=${stock}`;
    res.redirect('/login');
    return;
  }

  const userID = req.cookies.user.id;
  await addToWishList(stock, matchid, userID);

  const wishList = await getUserWishList(userID);
  await addDetailsToWishlist(wishList);

  wishList.sort((first, second) => compare(first, second, sortBy, sortOrder));

  res.render('wish', {
    wishList, zodiac: req.cookies.sign.name, sortBy, sortOrder,
  });
};

/**
 * Delete stock from wish list.
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 */
const deleteFromWishList = async (req, res) => {
  const { companyID } = req.params;
  const userID = req.cookies.user.id;

  const query = 'delete from wishlist where user_id=$1 and company_id=$2';

  try {
    await pool.query(query, [userID, companyID]);
  } catch (err) {
    console.log('Error executing query', err.stack);
  }

  res.redirect('/wish');
};

router
  .route('/')
  .get((req, res) => getWishList(req, res));

router
  .route('/:companyID')
  .delete((req, res) => deleteFromWishList(req, res));

export default router;
