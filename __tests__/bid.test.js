const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const User = require('../lib/models/User.js');
const Auction = require('../lib/models/Auction.js');
const Bid = require('../lib/models/Bid.js');

const request = require('supertest');
const app = require('../lib/app');

describe('bid routes', () => {

  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });
    
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let user;
  beforeEach(async() => {
    user = await User.create({
      email: 'breeanntest@breeanntest.com',
      passwordHash: 'password1234'
    });
  });

  let auction;
  beforeEach(async() => {
    auction = await Auction.create({
      user: user._id, 
      title: 'Camera Lens Auction', 
      description: 'Description of Lens Auction',
      quantity: 3, 
      endDate: Date()
    });
  });

  let bid;
  beforeEach(async() => {
    bid = await Bid.create({
      auction: auction.id,
      user: user.id,
      price: 500,
      quantity: 1,
      accepted: true
    });
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('creates a new bid via POST', async() => {
    const auction = await Auction.create({
      user: user.id,
      title: 'Camera Lens Auction',
      description: 'Description for Camera Lens Auction',
      quantity: 4,
      endDate: Date()
    });
    
    return request(app)
      .post('/api/v1/bids')
      .send({
        auction: auction._id,
        user: user._id,
        price: 500,
        quantity: 4,
        accepted: true
      })
      .then(res => {
        expect(res.body).toEqual({
          auction: auction.id,
          user: user.id,
          price: 500,
          quantity: 4,
          accepted: true
        });
      });
  }); 

  it('gets a bid by id', async() => {

    return request(app)
      .get(`/api/v1/bids/${bid._id}`)
      .auth('breeanntest@breeanntest.com', 'password1234')
      .then(res => {
        expect(res.body).toEqual({
          auction: auction.id,
          user: user.id,
          price: 500,
          quantity: 1,
          accepted: true
        });
      }); 
  });

  it('deletes a bid via Delete', () => {
    request(app)
      .delete(`/api/v1/bids/${bid._id}`)
      .then(res => {
        expect(res.body).toEqual({
          auction: auction.id,
          user: user.id,
          price: 500,
          quantity: 1,
          accepted: true
        });
      });
  });

});
