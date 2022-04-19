import { Router } from 'express';
import axios from 'axios';
import yahooFinance from 'yahoo-finance2';
import pool from '../models/dbConnect.js';

const router = Router();

/**
 * Get company icon.
 * @param {string} homepageURL Company home page URL.
 * @returns Company icon image.
 */
const getCompanyIcon = async (homepageURL) => {
  const url = `${process.env.LOGO_API_URL}/${homepageURL}?size=80`;

  const options = {
    method: 'GET',
    url,
    responseType: 'arraybuffer',
  };

  try {
    const response = await axios(options);
    const responseOK = response && response.status === 200 && response.statusText === 'OK';

    if (responseOK) {
      const responseData = await response.data;
      return `data:image/png;base64,${responseData.toString('base64')}`;
    }
  } catch (err) {
    console.log('Error executing query', err.stack);
  }

  return null;
};

/**
 * Get company profile.
 * @param {string} stock Stock symbol.
 * @returns Company profile.
 */
const getCompanyProfile = async (stock) => {
  let companyProfile;

  try {
    companyProfile = await yahooFinance.quoteSummary(stock, { modules: ['summaryProfile'] });
  } catch (error) {
    console.log('Error extracting company profile', error.stack);
  }

  return companyProfile;
};

/**
 * Shorten description of company long summary.
 * @param {string} longSummary Long summary of what a company does.
 * @returns Shortened description of a company.
 */
const shortenCompanySummary = (longSummary) => `${longSummary.split('.').slice(0, 2).join('.')}.`;

/**
 * Recommend a stock from a list of stocks.
 * @param {*} stocks Stock list.
 * @returns Recommended stock.
 */
const recommendStock = (stocks) => {
  const stockList = stocks;

  return stockList[Math.floor(Math.random() * stockList.length)];
};

/**
 * Get company match based on zodiac.
 * @param {*} req Request object.
 * @param {*} res Response object.
 */
const getMatch = (req, res) => {
  const { zodiac } = req.query;

  const query = `with matched_stock as (
                    select ms.id, m.id as match_id, m.rating, ys.name as your_sign, ms.name as match_sign 
                    from match m
                    inner join sign ys on m.your_sign_id=ys.id
                    inner join sign ms on m.match_sign_id=ms.id
                    where ys.name=$1
                    order by m.rating desc limit 1
                 )
                 select c.id, c.name, c.symbol, i.name as industry, mas.match_id, mas.rating, mas.your_sign, mas.match_sign 
                 from company c 
                 inner join industry i on c.industry_id=i.id
                 inner join matched_stock mas on c.sign_id=mas.id;`;
  const inputData = [zodiac];

  try {
    pool.query(query, inputData, async (err, result) => {
      const stock = recommendStock(result.rows);

      const companyProfile = await getCompanyProfile(stock.symbol);

      if (companyProfile) {
        // eslint-disable-next-line max-len
        stock.description = shortenCompanySummary(companyProfile.summaryProfile.longBusinessSummary);
        stock.logo = await getCompanyIcon(companyProfile.summaryProfile.website.split('//')[1]);
      }

      // save add to wishlist url for redirection later, in case user not logged in
      req.app.locals.prevUrl = `/wish?stock=${stock.symbol}&matchid=${stock.match_id}`;

      res.render('match', { stock });
    });
  } catch (error) {
    console.log('Error getting match', error.stack);
  }
};

router
  .route('/')
  .get((req, res) => getMatch(req, res));

export default router;
