const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// Set dummy user to request
app.use((req, res, next) => {
  User.findByPk(1)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        console.error(err);
      });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.notfound);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);

sequelize
    // .sync({force: true})
    .sync()
    .then(() => {
      return User.findByPk(1);
    })
    .then((user) => {
      if (!user) {
        return User.create({
          name: 'ansy',
          email: 'ansy@test.com',
        });
      }
      return user;
    })
    .then((user) => {
      const port = 3130;
      app.listen(port, () => console.log(`Listening on port ${port}`));
    })
    .catch((err) => {
      console.error(err);
    });


