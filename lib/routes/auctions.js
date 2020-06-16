const { Router } = require('express'); 
const Auction = require('../models/Auction');

module.exports = Router();

module.exports = Router()
  .post('/', (req, res, next) => {
    Auction
      .create(req.body)
      .then(auction => res.send(auction))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Auction
      .findById(req.params.id)
    //   auctions details (title, description, quantity, end date/time, populated user, a list of all bids)
      .populate('user')
      .populate('bids', { price: true })
      .then(auction => res.send(auction))
      .catch(next);
  })

//the get route will be used to get a list of all auctions
  .get('/', (req, res, next) => {
    Auction
      .find(req.query)
      .populate('user', {
        _id: true
      })
      .then(auctions => res.send(auctions))
      .catch(next);
  });
