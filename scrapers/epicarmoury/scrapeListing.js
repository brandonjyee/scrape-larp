// const fs = require('fs');
// const puppeteer = require('puppeteer');
const { noSpaceOrPunctuation, writeToFileAsJSON, writeImgToFile } = require('../../helper');

const scrapeListing = async (page, listingUrl, outputFile, outputImageFile) => {
  try {
    // Navigate to the page
    await page.goto(listingUrl);

    // await savePic(page, 'epicarmory.png')

    // Elem for product list => #product_list_list
    const PRODUCT_LIST_SELECTOR = '#product_list_list > ul';
    // each item in list => #product_list_list > ul > li
    // const ITEM_SELECTOR = '#product_list_list > ul > li'
    // const items = await page.$('#product_list_list > ul > li')

    // Within each item, there's:
    // imgUrl => item > a > div > img (.src)
    // title => item > div.center_block > h3 > a (title attr or innertext)
    // description => item > div.center_block > p > a  (title attr or innertext)
    // price => item > div.right_block > div:nth-child(4) > div.price   (innertext)
    // Detail page url => item > div.center_block > h3 > a  (href)

    const retItems = await page.$eval(PRODUCT_LIST_SELECTOR, items => {
      // We have the product list element as 'items'
      // console.log('product list length:', items.children.length);

      const retArr = [];
      const childArr = items.children;

      // For each child <li>, get the info for the item
      for (let i = 0; i < childArr.length; i++) {
        const item = childArr[i];

        const origImgUrl = item.querySelector('a > div > img').src;
        const name = item
          .querySelector('div.center_block > h3 > a')
          .getAttribute('title');
        const description = item
          .querySelector('div.center_block > p > a')
          .getAttribute('title');
        const price = item
          .querySelector('div.right_block > div:nth-child(4) > div.price')
          .textContent.trim()
          .replace('$', '');
        const detailsUrl = item
          .querySelector('div.center_block > h3 > a')
          .getAttribute('href');

        const parsedItem = {
          origImgUrl,
          name,
          description,
          price,
          detailsUrl,
        };
        retArr.push(parsedItem);
      }
      return retArr;
    });

    // Modify the items by resolving the imgUrl
    const promises = [];
    for (let i = 0; i < retItems.length; i++) {
      const item = retItems[i]
      // TODO: fix img extension. Need to support jpeg, jpg, gif as well
      item.localImgName = noSpaceOrPunctuation(item.name) + '.png'
      promises.push(writeImgToFile(page, item.origImgUrl, item.localImgName));
    };
    await Promise.all(promises);

    // Write the json file
    writeToFileAsJSON(retItems, outputFile);

    console.log('Finished scrapeListing:', listingUrl);
    // Return the number of items parsed
    return retItems.length;
  } catch (error) {
    console.log(error);
  }
};

module.exports = scrapeListing;
