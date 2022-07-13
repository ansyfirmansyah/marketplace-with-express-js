/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const getDb = require('../util/database').getDb;
const ObjectId = require('mongodb').ObjectId;
class Product {
  constructor(title, price, imageUrl, description, id, userId) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = id ? new ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db.collection('products').updateOne({_id: this._id}, {$set: this});
    } else {
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp
        .then((result) => {
        })
        .catch((err) => {
          console.error(err);
        });
  }

  static fetchAll() {
    const db = getDb();
    return db.collection('products')
        .find()
        .toArray()
        .then((products) => {
          return products;
        })
        .catch((err) => {
          console.error(err);
        });
  }

  static fetchById(id) {
    const db = getDb();
    return db.collection('products')
        .find({
          _id: new ObjectId(id),
        })
        .next()
        .then((products) => {
          return products;
        })
        .catch((err) => {
          console.error(err);
        });
  }

  static deleteById(id) {
    const db = getDb();
    return db.collection('products')
        .deleteOne({
          _id: new ObjectId(id),
        })
        .then((result) => {
          return result;
        })
        .catch((err) => {
          console.error(err);
        });
  }
}
module.exports = Product;
