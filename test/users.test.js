const request = require('supertest');
const jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app     = require('./app');

describe('GET /api/v1/users/me', () => {

  // Moking User.findOne method
  let userSpy;

  beforeAll( () => {
    const User = require('./models/user');
    userSpy = jest.spyOn(User, 'findById').mockImplementation((criterias) => {
      return {
            _id: "67a362ecb0ca5655003bf523",
            email: "johndoe@example.com",
            password: "$2b$10$4sg/MiB9v2diO0nQ3X2g7OLXkuMsqZUWRIdmAYsKwCFUWXSbMXlUG",
            user_name: "johndoe",
            name: "John",
            family_name : "Doe",
            user_type: false
      };
    });
  });

  afterAll(async () => {
    userSpy.mockRestore();
  });
  
  test('GET /api/v1/users/me with no token should return 401', async () => {
    const response = await request(app).get('/api/v1/users/me');
    expect(response.statusCode).toBe(401);
  });

  test('GET /api/v1/users/me?token=<invalid> should return 403', async () => {
    const response = await request(app).get('/api/v1/users/me?token=123456');
    expect(response.statusCode).toBe(403);
  });

  // create a valid token
  var payload = {
    id: "67a362ecb0ca5655003bf523", 
    email: "johndoe@example.com"
    // other data encrypted in the token	
}
  var options = {
    expiresIn: 86400 // expires in 24 hours
  }
  var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
      
  test('GET /api/v1/users/me?token=<valid> should return 200', async () => {
    expect.assertions(1);
    const response = await request(app).get('/api/v1/users/me?token='+token);
    console.log(response.body);
    expect(response.statusCode).toBe(200);
  });

  test('GET /api/v1/users/me?token=<valid> should return user information', async () => {
    expect.assertions(2);
    const response = await request(app).get('/api/v1/users/me?token='+token);
    const user = response.body;
    expect(user).toBeDefined();
    expect(user.email).toBe( "johndoe@example.com");
  });
});


describe('GET /api/v1/users/:id', () => {
    let userSpy;

    beforeAll( () => {
        const User = require('./models/user');
        userSpy = jest.spyOn(User, 'findById').mockImplementation((id) => {
            if (id=="1111"){
            return {
                _id: "1111",
                email: "johndoe@example.com",
                password: "$2b$10$4sg/MiB9v2diO0nQ3X2g7OLXkuMsqZUWRIdmAYsKwCFUWXSbMXlUG",
                user_name: "johndoe",
                name: "John",
                family_name : "Doe",
                favourite_list: {},
                user_type: false
          };}
          else{
            return ;
          }
        });
      });
    
      afterAll(async () => {
        userSpy.mockRestore();
      });
  
    test('GET /api/v1/users/:id with valid ID returns 200', async () => {
      const response = await request(app).get('/api/v1/users/1111');
      expect(response.status).toBe(200);
      expect(response.body.email).toBe("johndoe@example.com");
    });
  
    test('GET /api/v1/users/:id with invalid ID returns 404', async () => {
      const response = await request(app).get('/api/v1/users/invalid_id');
      expect(response.status).toBe(404);
    });
  
    test('GET /api/v1/users/:id handles database error', async () => {
     userSpy.mockRejectedValue(new Error('Database error'));
      const response = await request(app).get('/api/v1/users/valid_id');
      expect(response.status).toBe(500);
    });
  });