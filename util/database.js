const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient
      .connect(process.env.MONGO_URL)
      .then((client) => {
        console.log('Mongodb Connected!');
        _db = client.db(process.env.MONGO_DB);
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
