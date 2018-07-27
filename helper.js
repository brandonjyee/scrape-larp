const assert = require('assert');
const fs = require('fs');
const puppeteer = require('puppeteer');

module.exports.setupConsoleDebug = (page) => {
  page.on('console', msg => {
    for (let i = 0; i < msg.args().length; ++i)
      console.log(`${i}: ${msg.args()[i]}`);
  });
}

module.exports.savePic = async (page, filePath = 'screenshot.png') => {
  await page.screenshot({path: filePath, fullPage: true });
}

module.exports.launchBrowserFromLinux = async (headless) => {
  const browser = await puppeteer.launch({
    headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: 'google-chrome-unstable',
  });
  return browser
}

module.exports.screenshotSVGAsPNG = async (page, selector, filePath = "mySVGScreenshot.png") => {
  // const svgImage = await page.$('#svg');
  const svgImage = await page.$(selector);
  await svgImage.screenshot({
    path: filePath,
    omitBackground: true,
  });
};

// Does not work with Cross Site Origin Resources (CORS)
module.exports.parseDataUrl = (dataUrl) => {
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (matches.length !== 3) {
    throw new Error('Could not parse data URL.');
  }
  return { mime: matches[1], buffer: Buffer.from(matches[2], 'base64') };
};

// Does not work with Cross Site Origin Resources (CORS)
module.exports.getDataUrlThroughCanvas = async (selector) => {
  // Create a new image element with unconstrained size.
  const originalImage = document.querySelector(selector);
  const image = document.createElement('img');
  image.src = originalImage.src;

  // Create a canvas and context to draw onto.
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = image.width;
  canvas.height = image.height;

  // Ensure the image is loaded.
  await new Promise((resolve) => {
    if (image.complete || (image.width) > 0) resolve();
    image.addEventListener('load', () => resolve());
  });

  context.drawImage(image, 0, 0);
  return canvas.toDataURL();
};

module.exports.getDataUrlThroughFetch = async (selector, options = {}) => {
  const image = document.querySelector(selector);
  const url = image.src;

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Could not fetch image, (status ${response.status}`);
  }
  const data = await response.blob();
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.addEventListener('loadend', () => resolve(reader.result));
    reader.readAsDataURL(data);
  });
};


module.exports.getImageContent = async (page, url) => {
  const { content, base64Encoded } = await page._client.send(
    'Page.getResourceContent',
    { frameId: String(page.mainFrame()._id), url }
  );
  assert.equal(base64Encoded, true);
  return content;
};

module.exports.enableSaveAllImages = page => {
  let counter = 0;
  page.on('response', async response => {
    // Returns null if no match; else returns array:
    // [0]: the full string of chars matched
    // [1], ... [n]: parantesized substring matches, if any.
    const matches = /.*\.(jpeg|jpg|png|svg|gif)$/.exec(response.url());
    if (matches && matches.length === 2) {
      const extension = matches[1];
      const buffer = await response.buffer();
      fs.writeFileSync(
        `images/image-${counter}.${extension}`,
        buffer,
        'base64'
      );
      counter += 1;
    }
  });
};
