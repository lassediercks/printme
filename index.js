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

async function createPdf(req, res) {
  let file;

  if (validUrl.isUri(req.url)) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(req.url, { waitUntil: 'networkidle2' });

    switch (req.type) {
      case 'png':
        file = await page.screenshot({});
        res.contentType('image/png');
        console.log('created screenshot of ', req.url);

        break;
      default:
        file = await page.pdf({
          format: 'A4',
        });
        console.log('created pdf of ', req.url);
    }

    await browser.close();

    res.status(200);
    res.send(file);
    res.end();
  } else {
    res.status(400);
    res.send('url missing');
    res.end();
  }
}

app.post('/endpoint', cors(), (req, res) => {
  createPdf(req.body, res);
});

app.get('/:url', async (req, res) => {
  createPdf(req.params.url, res);
});

app.listen(port, function() {
  console.log('server running');
});
