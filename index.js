const puppeteer = require("puppeteer");
const express = require("express");
const app = express();
const validUrl = require("valid-url");
const port = process.env.PORT || 3000;

var http = require("http");

app.set("port", process.env.PORT || 5000);

setInterval(function() {
  http.get("https://printmenow.herokuapp.com");
}, 300000);

app.get("/", async (req, res) => {
  if (!req.params.url) {
    res.send("url is missing lol!");
    res.end();
  }
});

app.get("/:url", async (req, res) => {
  if (validUrl.isUri(req.params.url)) {
    res.contentType("application/pdf");

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();

    await page.goto(req.params.url, { waitUntil: "networkidle" });
    const data = await page.pdf({
      format: "A4",
      filename: req.params.url + ".pdf"
    });
    browser.close();
    res.send(data);
    res.end();
  } else {
    res.send(req.params.url + "is not a valid url");
  }
});

app.get("/:url/:filename", async (req, res) => {
  if (validUrl.isUri(req.params.url)) {
    res.contentType("application/pdf");

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();

    await page.goto(req.params.url, { waitUntil: "networkidle" });
    const data = await page.pdf({
      format: "A4",
      filename: req.params.filename + ".pdf"
    });
    browser.close();
    res.send(data);
    res.end();
  } else {
    res.send(req.params.url + "is not a valid url");
  }
});

app.listen(port, function() {
  console.log("server running");
});
