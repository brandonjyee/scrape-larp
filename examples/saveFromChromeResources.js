const fs = require('fs');
const puppeteer = require('puppeteer');
const {getImageContent} = require('../helper')

const saveFromChromeResources = async () => {
  try {
    // Set up browser and page.
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({ width: 1280, height: 926 });

    // Navigate to this blog post and wait a bit.
    await page.goto('https://intoli.com/blog/saving-images/');

    const imgUrl = await page.evaluate(() => document.querySelector('#svg').src)
    const content = await getImageContent(page, imgUrl);
    const contentBuffer = Buffer.from(content, 'base64');
    fs.writeFileSync('logo-extracted.svg', contentBuffer, 'base64');

    console.log('saveFromChromeResources is done')
    await browser.close();
  } catch (error) {
    console.log(error);
  }
}

module.exports = saveFromChromeResources
