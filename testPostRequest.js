function createPdf(body) {
  const blob = new Blob([body], { type: 'application/pdf' });
  const data = window.URL.createObjectURL(blob);

  const link = document.createElement('a');

  console.log(typeof body);
  // The actual download
  // var filename = "blah.pdf";
  link.href = data;
  console.log(link);
  document.body.appendChild(link);
  link.click();
}

url = 'http://localhost:3000/endpoint';

options = {
  method: 'POST',
  body: JSON.stringify({ url: 'http://google.com' }),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

fetch(url, options)
  .then((response) => response.arrayBuffer())
  .then(createPdf);
