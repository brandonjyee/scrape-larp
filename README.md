# scrape-larp

This repo demonstrates how to write a simple web scraper using Puppeteer and Javascript to extract text and images from a web page. The main example site we'll be scraping from is epicarmouryunlimited.com.

- /examples : contains basic web scraping examples using Puppeteer

To install, first clone this repo then navigate into the repo folder and run:

```
npm install
```
*Note: you must have npm installed on your system.

Then specify the scraper you want to use in scrapeRunner.js. Ex:

```
// This sets our scrapeFn to be the epicarmoury/scrapListings scraper
const scrapeFn = require('./scrapers/epicarmoury/scrapeListings') 
```
Once you've set the scraper, you can run it with:
```
npm start
```

To create your own scraper within this repo, simply create a file in the /scrapers folder that exports a function that will perform the scraping. For example, let's create a file called myScraper.js in /scrapers which will contain:
```
```
Now, let's set the scrapeRunner to use our new scraper:
```
const scrapeFn = require('./scrapers/myScraper')
```
Now we run the scraper:
```
npm start
```
And that's it!
