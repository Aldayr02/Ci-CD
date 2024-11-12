const express = require('express');
const path = require('path');
const { config } = require('dotenv');
const routes = require('./src/routes');
const cors = require('cors');

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Permite solicitudes de cualquier origen
app.use(express.json());
app.use(routes);
app.use('', express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`App runnning in ${port}`);
});
