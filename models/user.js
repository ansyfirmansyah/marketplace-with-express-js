/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const getDb = require('../util/database').getDb;
const ObjectId = require('mongodb').ObjectId;
class User {
  constructor(username, email, id, cart) {
    this.name = username;
    this.email = email;
    this._id = id ? new ObjectId(id) : null;
    this.cart = cart;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db.collection('users').updateOne({_id: this._id}, {$set: this});
    } else {
      dbOp = db.collection('users').insertOne(this);
    }
    return dbOp
        .then((result) => {
          return result;
        })
        .catch((err) => {
          console.error(err);
        });
  }

  addToCart(product) {
    let updatedCartItem = [];
    let cartProductIndex = null;
    if (this.cart) {
      updatedCartItem = [...this.cart.items];
      cartProductIndex = this.cart.items.findIndex((cp) => {
        return cp.productId.toString() === product._id.toString();
      });
    }
    if (cartProductIndex != null && cartProductIndex >= 0) {
      updatedCartItem[cartProductIndex].quantity = updatedCartItem[cartProductIndex].quantity + 1;
    } else {
      updatedCartItem.push({productId: product._id, quantity: 1});
    }
    const db = getDb();
    db.collection('users')
        .updateOne(
            {_id: this._id},
            {$set: {
              cart: {items: updatedCartItem},
            }});
  }

  static fetchAll() {
    const db = getDb();
    return db.collection('users')
        .find()
        .toArray()
        .then((users) => {
          return users;
        })
        .catch((err) => {
          console.error(err);
        });
  }

  static fetchById(userId) {
    const db = getDb();
    return db.collection('users')
        .findOne({
          _id: new ObjectId(userId),
        })
        .then((user) => {
          return user;
        })
        .catch((err) => {
          console.error(err);
        });
  }
}

module.exports = User;
