/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

// class User {
//   constructor(username, email, id, cart) {
//     this.name = username;
//     this.email = email;
//     this._id = id ? new ObjectId(id) : null;
//     this.cart = cart;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       dbOp = db.collection('users').updateOne({_id: this._id}, {$set: this});
//     } else {
//       dbOp = db.collection('users').insertOne(this);
//     }
//     return dbOp
//         .then((result) => {
//           return result;
//         })
//         .catch((err) => {
//           console.error(err);
//         });
//   }

//   addToCart(product) {
//     let updatedCartItem = [];
//     let cartProductIndex = null;
//     if (this.cart) {
//       updatedCartItem = [...this.cart.items];
//       cartProductIndex = this.cart.items.findIndex((cp) => {
//         return cp.productId.toString() === product._id.toString();
//       });
//     }
//     if (cartProductIndex != null && cartProductIndex >= 0) {
//       updatedCartItem[cartProductIndex].quantity = updatedCartItem[cartProductIndex].quantity + 1;
//     } else {
//       updatedCartItem.push({productId: product._id, quantity: 1});
//     }
//     const db = getDb();
//     return db.collection('users')
//         .updateOne(
//             {_id: this._id},
//             {$set: {
//               cart: {items: updatedCartItem},
//             }})
//         .then((result) => {
//           return result;
//         });
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//         .then((products) => {
//           const order = {
//             items: products,
//             user: {
//               _id: this._id,
//               name: this.name,
//             },
//           };
//           return db.collection('orders').insertOne(order);
//         })
//         .then((result) => {
//           this.cart = {items: []};
//           return db.collection('users')
//               .updateOne(
//                   {_id: this._id},
//                   {$set: {
//                     cart: {items: []},
//                   }})
//               .then((result) => {
//                 return result;
//               });
//         });
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map((i) => i.productId);
//     return db.collection('products')
//         .find({_id: {$in: productIds}})
//         .toArray()
//         .then((products) => {
//           return products.map((p) => {
//             return {
//               ...p,
//               quantity: this.cart.items.find((i) => {
//                 return i.productId.toString() === p._id.toString();
//               }).quantity,
//             };
//           });
//         })
//         .catch((err) => {
//           console.error(err);
//         });
//   }

//   getOrders() {
//     const db = getDb();
//     return db.collection('orders')
//         .find({'user._id': this._id})
//         .toArray();
//   }

//   deleteItemFromCart(productId) {
//     const db = getDb();
//     const updatedCartItems = this.cart.items.filter((i) => {
//       i.productId.toString() !== productId.toString();
//     });
//     return db.collection('users')
//         .updateOne(
//             {_id: this._id},
//             {$set: {
//               cart: {items: updatedCartItems},
//             }});
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db.collection('users')
//         .find()
//         .toArray()
//         .then((users) => {
//           return users;
//         })
//         .catch((err) => {
//           console.error(err);
//         });
//   }

//   static fetchById(userId) {
//     const db = getDb();
//     return db.collection('users')
//         .findOne({
//           _id: new ObjectId(userId),
//         })
//         .then((user) => {
//           return user;
//         })
//         .catch((err) => {
//           console.error(err);
//         });
//   }
// }

module.exports = mongoose.model('User', userSchema);
