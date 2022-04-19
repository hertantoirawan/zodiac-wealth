import { Router } from 'express';
import yahooFinance from 'yahoo-finance2';
import moment from 'moment';
import pool from '../models/dbConnect.js';
import { isLoggedIn } from '../models/helper.util.js';

const router = Router();

const getStockDetails = async (ticker) => {
  try {
    const result = await yahooFinance.quoteSummary(ticker);
    return result;
  } catch (error) {
    console.log('Error getting stock details', error.stack);
  }

  return null;
};

const getChartData = async (ticker) => {
  try {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    const queryOptions = { period1: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`, interval: '1mo' };

    const result = await yahooFinance.historical(ticker, queryOptions);
    return result;
  } catch (error) {
    console.log('Error getting stock details', error.stack);
  }

  return null;
};

const getNews = async (ticker) => {
  try {
    const queryOptions = { newsCount: 4 };

    const result = await yahooFinance.search(ticker, queryOptions);
    return result;
  } catch (error) {
    console.log('Error getting stock details', error.stack);
  }

  return null;
};

const formatStockDetails = (stockDetails) => {
  const stockSummary = {};
  stockSummary.symbol = stockDetails.price.symbol;
  stockSummary.name = stockDetails.price.shortName;
  stockSummary.price = stockDetails.summaryDetail.previousClose;
  stockSummary.percentChange = stockDetails.price.regularMarketChangePercent;
  stockSummary.priceHigh = stockDetails.summaryDetail.fiftyTwoWeekHigh;
  stockSummary.priceLow = stockDetails.summaryDetail.fiftyTwoWeekLow;

  const formatter = Intl.NumberFormat('en', {
    minimumFractionDigits: 1,
    maximumFractionDigits:
          2,
  });

  stockSummary.PE = formatter.format(stockDetails.summaryDetail.forwardPE);

  const largeNumFormatter = Intl.NumberFormat('en', {
    notation: 'compact',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });

  stockSummary.volume = largeNumFormatter.format(stockDetails.summaryDetail.volume);
  stockSummary.marketCap = largeNumFormatter.format(stockDetails.summaryDetail.marketCap);
  stockSummary.averageVolume = largeNumFormatter.format(stockDetails.summaryDetail.averageVolume);

  return stockSummary;
};

const getComment = async (stock) => {
  const query = ` select c.id, 
                    case when au.name is null 
                      then a.username 
                      else au.name 
                    end, 
                    s.name as zodiac, c.comment, c.created_at 
                  from comment c
                  inner join app_user au on c.user_id=au.id
                  inner join auth a on a.user_id=au.id
                  inner join sign s on au.sign_id=s.id
                  inner join company co on c.company_id=co.id
                  where co.symbol=$1;`;
  const inputData = [stock];

  try {
    const result = await pool.query(query, inputData);
    return result.rows;
  } catch (err) {
    console.log('Error executing query', err.stack);
  }

  return null;
};

const getStock = async (req, res) => {
  const { stock } = req.params;

  if (!isLoggedIn(req)) {
    res.locals.prevUrl = `/stock/${stock}`;
    res.redirect('/login');
    return;
  }

  const stockDetails = await getStockDetails(stock);

  let stockSummary = {};
  let chartData = {};
  let chartLabels = [];
  let chartPrices = [];
  if (stockDetails) {
    stockSummary = formatStockDetails(stockDetails);
    chartData = await getChartData(stock);
    chartLabels = chartData.map((data) => {
      let month = (new Date(data.date)).getMonth() + 1;
      if (month === 0) month = 12;
      return month;
    });
    chartPrices = chartData.map((data) => data.close);
  }

  let stockNews = {};
  const news = await getNews(stock);
  if (news) {
    news.news.forEach((story) => {
      story.providerPublishTime = moment(story.providerPublishTime).fromNow();
    });

    stockNews = news.news;
  }

  const comments = await getComment(stock);
  comments.forEach((comment) => {
    comment.created_at = moment(comment.created_at).fromNow();
  });

  res.render('stock', {
    stockSummary, chartData, chartLabels, chartPrices, stockNews, comments,
  });
};

const addComment = async (req, res) => {
  const { comment } = req.body;
  const { stock } = req.params;

  const query = ` insert into comment (user_id, company_id, comment)
                  select $1, c.id, $3
                  from company c
                  where symbol=$2`;
  const inputData = [req.cookies.user.id, stock, comment];

  try {
    await pool.query(query, inputData);
  } catch (err) {
    console.log('Error executing query', err.stack);
  }

  res.redirect(`/stock/${stock}#comments`);
};

router
  .route('/:stock')
  .get((req, res) => getStock(req, res));

router
  .route('/:stock/comment')
  .post((req, res) => addComment(req, res));

export default router;
