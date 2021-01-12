const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const crawler = module.exports;

crawler.getDom = async function getDom(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0', 'load']});
  await page.waitForSelector('#cdk-drop-list-0', {visible: true});
  const data = await page.content();
  browser.close();
  return cheerio.load(data, { ignoreWhitespace: true });
}