const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  // Render your HTML form here
  res.sendFile(__dirname + '/public/form.html');
});

app.post('/generate-token', (req, res) => {
  const username = req.body.username;
  const token = generateToken(username);
  res.send(`Your generated token is: ${token}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function generateToken(username) {
  // Generate a random buffer of 16 bytes (128 bits)
  const randomBytes = crypto.randomBytes(16);
  // Convert the random buffer to a hexadecimal string
  const token = randomBytes.toString('hex');
  return token;
}
