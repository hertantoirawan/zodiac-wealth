# Zodiac Wealth
<img src="https://user-images.githubusercontent.com/17814490/189079782-d1adb19f-ee37-4ebb-8cb7-5fa4e0b1fb08.png" width=200 />

Zodiac Wealth is an app that gives out investment ideas based on zodiac.

**LIVE LINK** : [https://zodiac-wealth.herokuapp.com/](https://zodiac-wealth.herokuapp.com/)

**DEMO** : [https://youtu.be/hZDYOycLS6I](https://youtu.be/hZDYOycLS6I)

## Disclaimer
The information provided on this app does not constitute investment advice, financial advice, trading advice, or any other sort of advice and you should not treat any of the app's content as such. Zodiac Wealth does not recommend that any stocks should be bought, sold, or held by you. Do conduct your own due diligence and consult your financial advisor before making any investment decisions.

## Features
<img src="https://user-images.githubusercontent.com/17814490/189077489-ba1530b1-da28-4469-9d3f-f471d2e2a79f.png" width=230 /> <img src="https://user-images.githubusercontent.com/17814490/189077515-1f9054b9-b099-4943-ab41-1a241e7233a9.png" width=230 /> <img src="https://user-images.githubusercontent.com/17814490/189077536-275ad8ea-28b4-42bf-9d52-44cd4c773b35.png" width=230 /> <img src="https://user-images.githubusercontent.com/17814490/189077551-1a1ec459-e2c1-48aa-b3d3-92a8c14c5b8e.png" width=230 />

- Get daily horoscope for your zodiac
- Get stock recommendation based on your zodiac
- Save stocks you like on your own wishlist
- Get common stock details
- Add and read other's comments about a stock

## How to setup and run
- Install and start postgresql database locally
- Create database in postgresql named zodiac_wealth
- Run npm scripts to create/seed tables in this order
  - ```npm run db:create```
  - ```npm run db:seed```
- Run one of the npm scripts to start
  - ```npm start``` to use node
  - ```npm run startmon``` to use nodemon
- Go to ```localhost:3004/``` to start using the app

## Tech Used / Data Source
- UI is done using [Bootstrap](https://getbootstrap.com/)
- UI is designed for mobile, and tested with iPhone XR dimension in browser's developer tools
- Navigation icons from [Bootstrap Icons](https://icons.getbootstrap.com/)
- Database is using [PostgreSQL](https://www.postgresql.org/)
- Chart done using [Chart.js](https://www.chartjs.org/)
- Stock data [yahoo-finance2](https://www.npmjs.com/package/yahoo-finance2)
- Logo made using [Hatchful](https://hatchful.shopify.com/)
- Company logos from [Clearbit](https://logo.clearbit.com)
- Splash page background patter made using [Plain Pattern](http://www.kennethcachia.com/plain-pattern/)
- Fonts from [Google Fonts](https://fonts.google.com/share?selection.family=Assistant) 
- List of stocks from [Wikipedia](https://en.wikipedia.org/wiki/List_of_S%26P_500_companies) 
- Zodiac sign match percentage data from [random search in google](http://lifescienceglobal.com/social/29-dating-23/zodiac-signs-dates-love-compatibility.php)
- Daily horoscope from these APIs:
  - [https://any.ge/horoscope/api/](https://any.ge/horoscope/api/)
  - [https://horoscopes-and-astrology.com/json](https://horoscopes-and-astrology.com/json)

## Entity Relationship Diagram (ERD)
![Zodiac Wealth ERD](https://user-images.githubusercontent.com/17814490/164978387-833dab0d-d118-419b-b90f-6d1fab9ceb52.png)

## Documentation
More documentation about the development of the app in [Wiki](https://github.com/hertantoirawan/zodiac-wealth/wiki).

