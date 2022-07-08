const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

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

// User to Product relation: One to Many
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
// User to Cart relation: One to One
User.hasOne(Cart);
Cart.belongsTo(User);
// Cart to Product relation: Many to Many, using CartItem as a middle table
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
// User to Order relation: One to Many
Order.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Order);
// Order to Product relation: Many to Many, using OrderItem as a middle table
Order.belongsToMany(Product, {through: OrderItem});
Product.belongsToMany(Order, {through: OrderItem});

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
      user.getCart().then((cart) => {
        if (!cart) {
          user.createCart();
        }
      });
    })
    .then(() => {
      const port = 3130;
      app.listen(port, () => console.log(`Listening on port ${port}`));
    })
    .catch((err) => {
      console.error(err);
    });


