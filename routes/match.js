import { Router } from 'express';
import axios from 'axios';
import yahooFinance from 'yahoo-finance2';
import pool from '../models/dbConnect.js';

const router = Router();

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

const getCompanyProfile = async (stock) => {
  let companyProfile;

  try {
    companyProfile = await yahooFinance.quoteSummary(stock, { modules: ['summaryProfile'] });
  } catch (error) {
    console.log('Error extracting company profile', error.stack);
  }

  return companyProfile;
};

const shortenCompanySummary = (longSummary) => `${longSummary.split('.').slice(0, 2).join('.')}.`;

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

  pool.query(query, inputData, async (err, result) => {
    const stock = result.rows[Math.floor(Math.random() * result.rows.length)];

    const companyProfile = await getCompanyProfile(stock.symbol);

    if (companyProfile) {
      stock.description = shortenCompanySummary(companyProfile.summaryProfile.longBusinessSummary);
      stock.logo = await getCompanyIcon(companyProfile.summaryProfile.website.split('//')[1]);
    }

    req.app.locals.prevUrl = `/wish?stock=${stock.symbol}&matchid=${stock.match_id}`;

    res.render('match', { stock });
  });
};

router
  .route('/')
  .get((req, res) => getMatch(req, res));

export default router;
