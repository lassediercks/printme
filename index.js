const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const express = require('express');
const validUrl = require('valid-url');
const cors = require('cors');
const http = require('http');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.set('port', process.env.PORT || 5000);

setInterval(() => {
  http.get('http://printmenow.herokuapp.com');
}, 300000);

async function createPdf(url, res) {
  if (validUrl.isUri(decodeURIComponent(url))) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });

    const file = await page.pdf({
      format: 'A4',
      filename: `${url}.pdf`,
    });

    console.log('created pdf of ', url);

    res.contentType('application/pdf');
    res.status(200);
    res.send(file);
    res.end();
  } else {
    res.send(`${url} is not a valid url`);
  }
}

app.post('/endpoint', cors(), (req, res) => {
  console.log(req.body.url);
  createPdf(req.body.url, res);
});

app.get('/:url', async (req, res) => {
  createPdf(req.params.url, res);
});

app.listen(port, function() {
  console.log('server running');
});
