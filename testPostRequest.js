options = {
  method: 'POST',
  body: JSON.stringify({ url: 'https://www.google.com' }),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

fetch('http://localhost:3000/endpoint', options);
