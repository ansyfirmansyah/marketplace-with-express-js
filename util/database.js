const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient
      .connect(`mongodb+srv://ansy:eONuRrahSywyYOnB@cluster0.2fteu.mongodb.net/?retryWrites=true&w=majority`)
      .then((client) => {
        console.log('Mongodb Connected!');
        _db = client.db('shop');
        callback();
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw new Error('No database found!');
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
