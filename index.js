const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Hello from Docker on EC2!'));
app.listen(5000, () => console.log('App running on port 5000'));

