const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const User = require('../lib/models/User.js');
const Auction = require('../lib/models/Auction.js');
const Bid = require('../lib/models/Bid.js');

const request = require('supertest');
const app = require('../lib/app');

describe('auction routes', () => {
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
  
  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });
  
  it('creates a new auction via POST', () => {
    return request(app)
      .post('/api/v1/auctions/')
      .send({
        user: user._id,
        title: 'Camera Lens Auction', 
        description: 'Description for Camera Lens Auction', 
        quantity: 3, 
        endDate: Date()
      })
      .then(res => {
        expect(res.body).toEqual({
          user: user.id,
          title: 'Camera Lens Auction', 
          description: 'Description for Camera Lens Auction', 
          quantity: 3, 
          endDate: expect.anything()
        });
      });
  });

  //   auctions details (title, description, quantity, end date/time, populated user, a list of all bids)
  it('gets the auction by id via GET', async() => {
    const auction = await Auction.create({
      user: user._id,
      title: 'auction title',
      description: 'auction description',
      quantity: 1,
      endDate: Date()
    });

    Bid.create({
      auction: auction.id,
      user: user.id,
      price: 10,
      quantity: 1,
      accepted: true
    });

    return request(app)
      .get(`/api/v1/auctions/${auction._id}`)
      .then(res => {
        expect(res.body).toEqual({
          bids: [{
            _id: expect.anything(),
            auction: auction.id,
            price: 10
          }],
          description: auction.description,
          endDate: expect.anything(),
          quantity: auction.quantity,
          title: auction.title,
          user: {
            _id: expect.anything(),
            email: user.email
          }
        });
      });
  });
});
