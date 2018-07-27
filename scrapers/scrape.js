const puppeteer = require('puppeteer');

const MAIN_SEARCH_URL = 'http://www.cookcountyclerkofcourt.org/CourtCaseSearch/'
const COURT_SEARCH_URL = 'http://cookcountyclerkofcourt.org/courtcasesearch/DocketSearch.aspx'


async function setupPage(page) {
  await page.setViewport({width: 1000, height: 700})
  page.on('console', msg => console.log('PAGE LOG:', msg.text()))
}

async function savePic(page, name = 'court.png') {
  await page.screenshot({path: name, fullPage: true });
}

let scrape = async () => {
  const browser = await puppeteer.launch({
    headless: true, // false for debugging
    slowMo: 0   // 250 for debugging
  });
  const page = await browser.newPage();
  await setupPage(page);

  await page.goto(COURT_SEARCH_URL);

  // Click to search by party name
  await page.click(
    '#ctl00_MainContent_rbSearchType_ctl02'
  );
  await page.waitFor(100);

  // Click dropdown selector for division
  // await page.click('.rcbActionButton')
  await page.click('#ctl00_MainContent_ddlDatabase_Input')
  await page.waitFor(100);
  // Select the Civil division
  await page.click('li.rcbItem:nth-child(3)')
  await page.waitFor(100);
  // Click on name input box
  // await page.click('#ctl00_MainContent_txtName');
  // await page.waitFor(100);
  // Enter name to search for
  await page.type('#ctl00_MainContent_txtName', 'horton krystal')
  await page.waitFor(100)

  await savePic(page, 'form-filled.png')

  // Submit
  await page.click('#ctl00_MainContent_btnSearch')
  await page.waitFor(5000)    // Wait considerable time for results page

  // Select list of results
  // #MainContent_gvResults   // table
  // #MainContent_gvResults > tbody:nth-child(1) > tr:nth-child(1)  // header
  // #MainContent_gvResults > tbody:nth-child(1) > tr  // all tr's
  const trs = await page.$('#MainContent_gvResults > tbody:nth-child(1) > tr')
  console.log(trs)
  // trs.forEach((tr) => {
  //   console.log(tr)
  // })

  await savePic(page)


  // Scrape from the specific book page
  // const result = await page.evaluate(() => {
  //   let title = document.querySelector('h1').innerText;
  //   let price = document.querySelector('.price_color').innerText;

  //   return {
  //     title,
  //     price,
  //   };
  // });

  await browser.close();
  return {};
};

scrape().then(value => {
  console.log(value); // Success!
});
