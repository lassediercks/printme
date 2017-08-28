const puppeteer = require('puppeteer');
const express = require('express')
const app = express()
const validUrl = require('valid-url');


app.get('/', async (req, res) => {
  if (!req.params.url) {
    res.send('url fehlt lol!');
    res.end();
  }
});


app.get('/:url', async (req, res) => {
  if(validUrl.isUri(req.params.url)){
    res.contentType("application/pdf");

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(req.params.url, {waitUntil: 'networkidle'});
    const data = await page.pdf({path: 'Breefly.pdf', format: 'A4'});
    browser.close();
    res.send(data);
    res.end();
  } else {
    res.send(req.params.url + 'is not a valid url');
  }

});


app.listen(3000, function () {
})
