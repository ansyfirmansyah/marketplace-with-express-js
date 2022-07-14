require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  User.findOne()
      .then((user) => {
        if (!user) {
          const user = new User({
            name: 'ansy',
            email: 'ansy@test.com',
            cart: {
              items: [],
            },
          });
          user.save()
              .then((user) => {
                req.user = user;
                next();
              });
        } else {
          req.user = user;
          next();
        }
      });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.notfound);

mongoose.connect(process.env.MONGO_URL)
    .then((result) => {
      console.log('Database connected!');
      const port = 3130;
      app.listen(port, () => console.log(`Listening on port ${port}`));
    })
    .catch((err) => console.error(err));


