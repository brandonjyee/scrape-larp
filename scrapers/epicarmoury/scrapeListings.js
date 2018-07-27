// const latexWeapons = require('./inputs/latex-weapons.json');
const scrapeListing = require('./scrapeListing');
const { setupBrowserAndPage } = require('../../helper');
const path = require('path');
const fs = require('fs');

const loadFiles = () => {
  console.log('LOADING FILES');
  const allInputFiles = [];
  let totalPages = 0;
  fs.readdirSync(path.join(__dirname, 'inputs')).forEach(file => {
    const name = file.replace('.json', '');
    const data = require('./inputs/' + file);
    console.log(file, data.length);
    totalPages += data.length;
    allInputFiles.push({ name, data });
  });
  console.log('TOTAL PAGES:', totalPages);
  return allInputFiles;
};

const scrapeListings = async () => {
  try {
    const [browser, page] = await setupBrowserAndPage();

    const allFiles = loadFiles();

    let totalRecords = 0
    for (let i = 0; i < allFiles.length; i++) {
      const fileData = allFiles[i].data
      console.log('file:', allFiles[i])
      for (let j = 0; j < fileData.length; j++) {
        const listing = fileData[j]
        const listingUrl = listing.url;
        const outputFile = path.join(__dirname, 'outputs', listing.fileName);
        const outputImageFile = path.join(
          __dirname,
          'outputs',
          'img',
          listing.fileName.replace('json', 'png')
        );
        console.log(listingUrl)
        console.log(outputFile)
        console.log(outputImageFile)
        const numItems = await scrapeListing(page, listingUrl, outputFile, outputImageFile);
        totalRecords += numItems
      }
    }
    console.log('TOTAL RECORDS SCRAPED:', totalRecords)

    console.log(`Finished scraping all listings for: ${__dirname}`);
    await browser.close();
  } catch (err) {
    console.error(err);
  }
};

// const scrapeAllListings = async () => {};

module.exports = scrapeListings;
