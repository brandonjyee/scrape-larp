const fs = require('fs');
const puppeteer = require('puppeteer');
const {getImageContent, savePic, setupConsoleDebug} = require('../helper')

const scrape = async () => {
  try {
    // Set up browser and page.
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({ width: 1280, height: 926 });

    // Navigate to this blog post and wait a bit.
    await page.goto('http://www.epicarmouryunlimited.com/en/2038-larp-polearms');

    // await savePic(page, 'epicarmory.png')
    page.setupConsoleDebug(page)

    // Elem for product list => #product_list_list
    const PRODUCT_LIST_SELECTOR = '#product_list_list > ul'
    // each item in list => #product_list_list > ul > li
    // const ITEM_SELECTOR = '#product_list_list > ul > li'
    // const items = await page.$('#product_list_list > ul > li')

    // Within each item, there's:
    // imgUrl => item > a > div > img (.src)
    // title => item > div.center_block > h3 > a (title attr or innertext)
    // description => item > div.center_block > p > a  (title attr or innertext)
    // price => item > div.right_block > div:nth-child(4) > div.price   (innertext)
    // Detail page url => item > div.center_block > h3 > a  (href)

    const retItems = await page.$eval(PRODUCT_LIST_SELECTOR, (items) => {
      // We have the product list element as 'items'
      console.log('product list length:', items.children.length)
      // console.log('items.className:', items.className)

      const retArr = []
      const childArr = items.children

      // For each child <li>, get the info for the item
      for (let i = 0; i < childArr.length; i++) {
        const item = childArr[i]
        const imgUrl = item.querySelector('a > div > img').src
        const title = item.querySelector('div.center_block > h3 > a').getAttribute('title')
        const description = item.querySelector('div.center_block > p > a').getAttribute('title')
        const price = item.querySelector('div.right_block > div:nth-child(4) > div.price').textContent.trim()
        const detailsUrl = item.querySelector('div.center_block > h3 > a').getAttribute('href')
        // console.log(imgUrl, title, description, price, detailsUrl)
        const parsedItem = {
          imgUrl,
          title,
          description,
          price,
          detailsUrl
        }
        // console.log('parsedItem:', parsedItem)
        retArr.push(parsedItem)
      }
      return retArr
    })
    console.log('retItems:',retItems)
    // console.log(retItems.length, retItems[0])

    // console.log('items.len:', items.length, 'items[0]', items[0])
    // items.forEach((item) => {
    //   console.log(item)
    // })

    // const url = await page.evaluate(() => document.querySelector('#svg').src)
    // const content = await getImageContent(page, url);
    // const contentBuffer = Buffer.from(content, 'base64');
    // fs.writeFileSync('logo-extracted.svg', contentBuffer, 'base64');

    console.log('scrapeEpicArmory is done')
    await browser.close();
  } catch (error) {
    console.log(error);
  }
}

module.exports = scrape
