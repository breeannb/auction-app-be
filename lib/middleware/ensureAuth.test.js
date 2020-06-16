const { usernamePasswordReader } = require('./ensureAuth');

describe('ensureAuth middleware', () => {

  it('can read a username/password from the header', () => {
    const authorization = 'Basic YnJlZWFubnRlc3RAYnJlZWFubnRlc3QuY29tOnBhc3N3b3JkMTIzNA==';
    expect(usernamePasswordReader(authorization)).toEqual({
      username: 'breeanntest@breeanntest.com',
      password: 'password1234'
    });
  });
});
