/* eslint-disable require-jsdoc */
const getDb = require('../util/database').getDb;
const ObjectId = require('mongodb').ObjectId;
class User {
  constructor(username, email, id) {
    this.name = username;
    this.email = email;
    this._id = id ? new ObjectId(id) : null;
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
