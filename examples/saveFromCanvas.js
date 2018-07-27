const fs = require('fs');
const puppeteer = require('puppeteer');
const {getDataUrlThroughCanvas, parseDataUrl} = require('../helper')

const saveFromCanvas = async () => {
  try {
    // Set up browser and page.
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({ width: 1280, height: 926 });

    // Navigate to this blog post and wait a bit.
    await page.goto('https://intoli.com/blog/saving-images/');

    const dataUrl = await page.evaluate(getDataUrlThroughCanvas, '#jpg');
    // const dataUrl = await page.evaluate(getDataUrlThroughCanvas, imageSelector);
    const { buffer } = parseDataUrl(dataUrl);
    fs.writeFileSync('logo-canvas.png', buffer, 'base64');

    console.log('saveFromCanvas is done')
    await browser.close();
  } catch (error) {
    console.log(error);
  }
}

module.exports = saveFromCanvas
