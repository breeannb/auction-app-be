const { Router } = require('express'); 
const Bid = require('../models/Bid');

module.exports = Router()

  .post('/', async(req, res, next) => {
    Bid 
      .findOneAndUpdate({ auction: req.body.auction, user: req.body.user }, req.body, { new: true, upsert: true })
      .then(bid => res.send(bid))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Bid
      .findById(req.params.id)
      .then(bid => res.send(bid))
      .catch(next);
  });
