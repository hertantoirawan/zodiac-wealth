import { Router } from 'express';
import axios from 'axios';
import pool from '../models/dbConnect.js';

const router = Router();

/**
 * Clean html from daily horoscope
 * @param {*} horoscope Horoscope for a zodiac sign.
 * @returns Clean daily horoscope.
 */
const cleanDailyHoroscope = (horoscope) => horoscope.split('<a')[0];

/**
 * Get today's horoscope.
 * @param {string} zodiac Zodiac sign.
 * @returns Horoscope of the day.
 */
const getTodayHoroscopeBackup = async (zodiac) => {
  const url = 'https://horoscopes-and-astrology.com/json';

  const options = {
    method: 'GET',
    url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };

  try {
    const response = await axios(options);
    const responseOK = response && response.status === 200 && response.statusText === 'OK';

    if (responseOK) {
      const data = await response.data;
      return (data) ? cleanDailyHoroscope(data.dailyhoroscope[zodiac]) : '';
    }
  } catch (err) {
    console.log('Error getting today\'s horoscope', err.stack);
  }

  return '';
};

/**
 * Shorten daily horoscope.
 * @param {string} horoscope Horoscope for a zodiac sign.
 * @returns Shortened horoscope.
 */
const shortenDailyHoroscope = (horoscope) => `${horoscope.split('.').slice(0, 2).join('.')}.`;

/**
 * Get today's horoscope.
 * This free API is unreliable, which is why we add getTodayHoroscopeBackup
 * @param {string} zodiac Zodiac sign.
 * @returns Horoscope of the day.
 */
const getTodayHoroscope = async (zodiac) => {
  const url = `https://any.ge/horoscope/api/?sign=${zodiac}&type=daily&day=today&lang=en`;

  const options = {
    method: 'GET',
    url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };

  try {
    const response = await axios(options);
    const responseOK = response && response.status === 200 && response.statusText === 'OK';

    if (responseOK) {
      const data = await response.data;
      if (data) {
        return shortenDailyHoroscope(data[0].text);
      }
    }
    return getTodayHoroscopeBackup(zodiac);
  } catch (err) {
    console.log('Error getting today\'s horoscope', err.stack);
  }

  return '';
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Get date range of a zodiac.
 * @param {string} zodiac Zodiac sign.
 * @returns Date range of a zodiac.
 */
const getZodiacDetail = async (zodiac) => {
  const query = ` select start_day, start_month, end_day, end_month
                  from sign where name=$1`;
  const inputData = [zodiac];

  try {
    const result = await pool.query(query, inputData);
    const signDates = result.rows[0];

    return `${signDates.start_day} ${months[signDates.start_month - 1]} - ${signDates.end_day} ${months[signDates.end_month - 1]}`;
  } catch (err) {
    console.log('Error executing query', err.stack);
  }

  return '';
};

/**
 * Get zodiac and horoscope.
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 */
const getZodiac = async (req, res) => {
  const { zodiac } = req.params;

  const horoscope = await getTodayHoroscope(zodiac);
  const zodiacDates = await getZodiacDetail(zodiac);

  res.render('zodiac', { zodiac, zodiacDates, horoscope });
};

/**
 * Get zodiac sign based on birth date.
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 */
const saveProfileInfo = (req, res) => {
  const { birthDay, birthMonth } = req.body;

  const query = 'select id, name, start_day, start_month, end_day, end_month from sign where (start_month = $1 and start_day <= $2) or (end_month = $1 and end_day >= $2)';
  const inputData = [birthMonth, birthDay];

  try {
    pool.query(query, inputData, (err, result) => {
      const sign = result.rows[0];

      res.cookie('sign', {
        id: sign.id, name: sign.name, birthDay, birthMonth,
      });

      res.redirect(`/zodiac/${sign.name}`);
    });
  } catch (err) {
    console.log('Error executing query', err.stack);
  }
};

router
  .route('/:zodiac')
  .get((req, res) => getZodiac(req, res));

router
  .route('/')
  .post((req, res) => saveProfileInfo(req, res));

export default router;
