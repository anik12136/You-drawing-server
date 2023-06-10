
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get('/',  (req, res) => {
    console.log(`Simple crud is running on port, ${port}`);
});

app.listen(port, () => {
    console.log(`assignment 12 is sitting on port  ${port}`);
  })

  