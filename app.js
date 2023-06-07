const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3500;
const app = express();
app.use(cors());
app.use(express.static('build'));
app.listen(port, () => console.log(`Drop-React-2 listening on port ${port}!`));
