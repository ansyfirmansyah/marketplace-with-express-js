require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
}));

app.use((req, res, next) => {
  if (!req.session.user) {
    next();
  } else {
    User.findById(req.session.user._id)
        .then((user) => {
          req.user = user;
          next();
        });
  }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.notfound);

mongoose.connect(process.env.MONGO_URL)
    .then((result) => {
      console.log('Database connected!');
      const port = 3130;
      app.listen(port, () => console.log(`Listening on port ${port}`));
    })
    .catch((err) => console.error(err));


