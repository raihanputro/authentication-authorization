const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();

const user = require('./server/api/user');
const item = require('./server/api/item');
const cart = require('./server/api/cart');

dotenv.config();


app.use(cors());    
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Connected');
});

app.use('/user', user);
app.use('/item', item);
app.use('/cart', cart);


app.listen(process.env.PORT, () => {
    console.log(`Server is running in ${process.env.PORT}`)
});