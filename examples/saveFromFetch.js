const fs = require('fs');
const puppeteer = require('puppeteer');
const assert = require('assert');
const { getDataUrlThroughFetch, parseDataUrl } = require('../helper');

const saveFromFetch = async () => {
  try {
    // Set up browser and page.
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({ width: 1280, height: 926 });

    // Navigate to this blog post and wait a bit.
    await page.goto('https://intoli.com/blog/saving-images/');

    const options = { cache: 'no-cache' };
    const dataUrl = await page.evaluate(
      getDataUrlThroughFetch,
      '#svg',
      options
    );
    const { mime, buffer } = parseDataUrl(dataUrl);
    assert.equal(mime, 'image/svg+xml');
    fs.writeFileSync('logo-fetch.svg', buffer, 'base64');

    console.log('saveFromFetch is done')
    await browser.close();
  } catch (error) {
    console.log(error);
  }
}

module.exports = saveFromFetch
