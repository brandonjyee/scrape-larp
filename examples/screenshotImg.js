const puppeteer = require('puppeteer');

const screenshotImg = async () => {
  console.log('Running screenshotImg')
  // Set up browser and page.
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });

  // Navigate to this blog post and wait a bit.
  await page.goto('https://intoli.com/blog/saving-images/');
  await page.waitForSelector('#svg');

  // Select the #svg img element and save the screenshot.
  const svgImage = await page.$('#svg');
  await svgImage.screenshot({
    path: 'logo-screenshot.png',
    omitBackground: true,
  });

  console.log('screenshotImg is done')
  await browser.close();
}

module.exports = screenshotImg
