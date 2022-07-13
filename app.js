require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const db = require('./util/database');
const User = require('./models/user');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  User.fetchAll()
      .then((users) => {
        if (users.length <= 0) {
          const user = new User('ansy', 'ansy@test.com');
          user.save()
              .then((user) => {
                req.user = user;
                next();
              });
        } else {
          req.user = users[0];
          next();
        }
      });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.notfound);

db.mongoConnect(() => {
  const port = 3130;
  app.listen(port, () => console.log(`Listening on port ${port}`));
});


