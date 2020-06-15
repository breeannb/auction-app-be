const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const User = require('../lib/models/User.js');
const Auction = require('../lib/models/Auction.js');

const request = require('supertest');
const app = require('../lib/app');

describe('auction routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });
  
  let user;
  beforeEach(async() => {
    user = await User.create({
      email: 'breeanntest@breeanntest.com',
      passwordHash: 'password1234'
    });
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
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

  it('gets an auction by id via GET', () => {
    return Auction.create({
      user: user._id,
      title: 'Camera Lens Auction', 
      description: 'Description for Camera Lens Auction', 
      quantity: 3, 
      endDate: Date()
    })
      .then(auction=> request(app).get(`/api/v1/auctions/${auction._id}`))
      .then(res => {
        expect(res.body).toEqual({
          user: user._id,
          title: 'Camera Lens Auction', 
          description: 'Description for Camera Lens Auction', 
          quantity: 3, 
          endDate: Date()
        });
      });
  });
});
