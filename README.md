# scrape-larp

This repo demonstrates how to write a simple web scraper that extracts text and images from a web page. The main example site we'll be scraping from is epicarmouryunlimited.com.

- /examples : contains basic web scraping examples

To install, first clone this repo and navigate into the folder. Then run:

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
