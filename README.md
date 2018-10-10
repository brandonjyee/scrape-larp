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
const puppeteer = require('puppeteer');

const scrape = async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    
    // This is the site we'll be scraping
    await page.goto('http://books.toscrape.com/');

    const result = await page.evaluate(() => {
        let data = []; // Create an empty array that will store our data
        let elements = document.querySelectorAll('.product_pod'); // Select all Products

        for (var element of elements){ // Loop through each proudct
            let title = element.childNodes[5].innerText; // Select the title
            let price = element.childNodes[7].children[0].innerText; // Select the price

            data.push({title, price}); // Push an object with the data onto our array
        }

        return data; // Return our data array
    });

    console.log('bookScrape is done')
    await browser.close();
    return result; // Return the data
};

module.exports = scrape
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
