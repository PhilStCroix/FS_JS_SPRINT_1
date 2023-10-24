const express = require('express');
const bodyParser = require('body-parser');

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
  // Code to generate a token based on username
  const token = generateToken(username);
  res.send(`Your generated token is: ${token}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function generateToken(username) {
  // Code to generate a token based on username
  // Implement your token generation logic here
  // For example, you can use crypto or CRC libraries for generating tokens
}
