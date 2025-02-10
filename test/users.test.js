const request = require('supertest');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app = require('../app/app');
const User = require('../app/models/user');
const bcrypt = require('bcrypt');

describe('GET /api/v1/users/me', () => {

  // Moking User.findOne method
  let userSpy;

  beforeAll(() => {
    userSpy = jest.spyOn(User, 'findById').mockImplementation((criterias) => {
      return {
        _id: "67a362ecb0ca5655003bf523",
        email: "johndoe@example.com",
        password: "$2b$10$4sg/MiB9v2diO0nQ3X2g7OLXkuMsqZUWRIdmAYsKwCFUWXSbMXlUG",
        user_name: "johndoe",
        name: "John",
        family_name: "Doe",
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
    const response = await request(app).get(`/api/v1/users/me?token=${token}`);
    expect(response.statusCode).toBe(200);
  });

  test('GET /api/v1/users/me?token=<valid> should return user information', async () => {
    expect.assertions(2);
    const response = await request(app).get(`/api/v1/users/me?token=${token}`);
    const user = response.body;
    expect(user).toBeDefined();
    expect(user.email).toBe("johndoe@example.com");
  });
});


describe('GET /api/v1/users/:id', () => {
  let userSpy;

  beforeAll(() => {
    userSpy = jest.spyOn(User, 'findById').mockImplementation((id) => {
      if (id === "1111") {
        return {
          _id: "1111",
          email: "johndoe@example.com",
          password: "$2b$10$4sg/MiB9v2diO0nQ3X2g7OLXkuMsqZUWRIdmAYsKwCFUWXSbMXlUG",
          user_name: "johndoe",
          name: "John",
          family_name: "Doe",
          favourite_list: {},
          user_type: false
        };
      }
      else {
        return;
      }
    });
  });

  afterAll(async () => {
    userSpy.mockRestore();
  });

  test('GET /api/v1/users/:id with valid ID returns 200', async () => {
    const response = await request(app).get('/api/v1/users/1111');
    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe("johndoe@example.com");
  });

  test('GET /api/v1/users/:id with invalid ID returns 404', async () => {
    const response = await request(app).get('/api/v1/users/invalid_id');
    expect(response.statusCode).toBe(404);
  });

  test('GET /api/v1/users/:id handles database error', async () => {
    userSpy.mockRejectedValue(new Error('Database error'));
    const response = await request(app).get('/api/v1/users/valid_id');
    expect(response.statusCode).toBe(500);
  });
});
jest.mock('bcrypt');
jest.mock('../app/models/user');

describe('POST /api/v1/users', () => {
  const validUserData = {
    email: 'test@example.com',
    password: 'password',
    user_name: 'testuser',
    name: 'Test',
    family_name: 'User'
  };

  const mockCreatedUser = {
    _id: '507f191e810c19729de860ea',
    ...validUserData,
    password: 'hashedPassword',
    favourite_list: {},
    user_type: false
  };

  beforeEach(() => {
    User.prototype.save = jest.fn();
    bcrypt.hash.mockReset();
  });

  test('should create a new user and return 201 Created', async () => {
    // Mock successful save
    User.prototype.save.mockResolvedValueOnce(mockCreatedUser);
    // Mock bcrypt hash
    bcrypt.hash.mockResolvedValueOnce('hashedPassword');

    const response = await request(app)
      .post('/api/v1/users')
      .send(validUserData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      id: mockCreatedUser._id,
      self: `/api/v1/users/${mockCreatedUser._id}`,
      email: validUserData.email,
      user_name: validUserData.user_name,
      name: validUserData.name,
      family_name: validUserData.family_name,
      favourite_list: {},
      user_type: false
    });
    expect(response.headers.location).toBe(`/api/v1/users/${mockCreatedUser._id}`);
    expect(bcrypt.hash).toHaveBeenCalledWith(validUserData.password, 10);
  });

  describe('should return 400 Bad Request for invalid data', () => {
    const requiredFields = ['email', 'password', 'user_name', 'name', 'family_name'];
    
    requiredFields.forEach(field => {
      test(`when missing ${field}`, async () => {
        const invalidData = { ...validUserData };
        delete invalidData[field];

        const response = await request(app)
          .post('/api/v1/users')
          .send(invalidData);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          error: `Missing required field: ${field}`
        });
      });
    });

    test('with invalid email format', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({ ...validUserData, email: 'invalid-email' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Invalid email format'
      });
    });
  });

  test('should return 500 when user already exists', async () => {
    // Mock duplicate key error (MongoDB error code 11000)
    const duplicateError = new Error('Duplicate key error');
    duplicateError.code = 11000;
    
    User.prototype.save.mockRejectedValueOnce(duplicateError);
    bcrypt.hash.mockResolvedValueOnce('hashedPassword');

    const response = await request(app)
      .post('/api/v1/users')
      .send(validUserData);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Internal Server Error',
      details: 'Duplicate key error'
    });
  });

  test('should handle general errors with 500', async () => {
    const mockError = new Error('Some database error');
    User.prototype.save.mockRejectedValueOnce(mockError);
    bcrypt.hash.mockResolvedValueOnce('hashedPassword');

    const response = await request(app)
      .post('/api/v1/users')
      .send(validUserData);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Internal Server Error',
      details: 'Some database error'
    });
  });
});

const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app/app');
const User = require('../app/models/user');

//////////////////////////////
// PUT /api/v1/users/:id Tests
//////////////////////////////
describe('PUT /api/v1/users/:id', () => {
  let userSpy;
  let saveMock;

  // CHANGED: Define valid update data (similar structure as for POST but with update fields)
  const validUpdateData = {
    email: 'newemail@example.com',
    user_name: 'newusername',
    name: 'NewName',
    family_name: 'NewFamily',
    password: 'newpassword', // new password that must differ from the old one
    favourite_list: { items: [] },
    user_type: true
  };

  beforeEach(() => {
    // CHANGED: Create a mock user with a save function to simulate updating the user
    saveMock = jest.fn();
    userSpy = jest.spyOn(User, 'findById').mockImplementation((id) => {
      if (id === 'valid_id') {
        return {
          _id: 'valid_id',
          email: 'oldemail@example.com',
          password: 'oldHashedPassword', // hashed password stored in DB
          user_name: 'oldusername',
          name: 'OldName',
          family_name: 'OldFamily',
          favourite_list: {},
          user_type: false,
          save: saveMock
        };
      } else {
        return null;
      }
    });
  });

  afterEach(() => {
    userSpy.mockRestore();
    jest.resetAllMocks();
  });

  test('should update user successfully and return 201 with updated user data', async () => {
    // CHANGED: Mock bcrypt.compare to return false (new password is different)
    bcrypt.compare.mockResolvedValueOnce(false);
    // CHANGED: Mock bcrypt.hash to return the new hashed password
    bcrypt.hash.mockResolvedValueOnce('newHashedPassword');

    // CHANGED: Define the updated user object that should be returned from user.save()
    const updatedUser = {
      _id: 'valid_id',
      email: validUpdateData.email,
      user_name: validUpdateData.user_name,
      name: validUpdateData.name,
      family_name: validUpdateData.family_name,
      favourite_list: validUpdateData.favourite_list,
      user_type: validUpdateData.user_type,
      password: 'newHashedPassword'
    };

    saveMock.mockResolvedValueOnce(updatedUser);

    const response = await request(app)
      .put(`/api/v1/users/valid_id`)
      .send(validUpdateData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      id: updatedUser._id,
      self: `/api/v1/users/${updatedUser._id}`,
      email: updatedUser.email,
      user_name: updatedUser.user_name,
      name: updatedUser.name,
      family_name: updatedUser.family_name,
      favourite_list: updatedUser.favourite_list,
      user_type: updatedUser.user_type
    });
    expect(response.headers.location).toBe(`/api/v1/users/${updatedUser._id}`);
  });

  test('should return 404 if user not found', async () => {
    const response = await request(app)
      .put('/api/v1/users/nonexistent')
      .send(validUpdateData);
    expect(response.statusCode).toBe(404);
  });

  test('should return 400 if required field is missing', async () => {
    // CHANGED: Remove a required field (e.g., email) from the update data
    const invalidData = { ...validUpdateData };
    delete invalidData.email;

    const response = await request(app)
      .put('/api/v1/users/valid_id')
      .send(invalidData);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: 'Missing required field: email'
    });
  });

  test('should return 400 if invalid email format', async () => {
    // CHANGED: Provide an invalid email format
    const invalidData = { ...validUpdateData, email: 'invalid-email' };

    const response = await request(app)
      .put('/api/v1/users/valid_id')
      .send(invalidData);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid email format'
    });
  });

  test('should return 400 if new password is same as old one', async () => {
    // CHANGED: Simulate bcrypt.compare returning true (new password matches the old one)
    bcrypt.compare.mockResolvedValueOnce(true);

    const response = await request(app)
      .put('/api/v1/users/valid_id')
      .send(validUpdateData);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: 'Password MUST be different from the previus one'
    });
  });

  test('should return 500 if error occurs during update', async () => {
    bcrypt.compare.mockResolvedValueOnce(false);
    bcrypt.hash.mockResolvedValueOnce('newHashedPassword');
    // CHANGED: Simulate a database error during save
    saveMock.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .put('/api/v1/users/valid_id')
      .send(validUpdateData);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      error: 'Internal Server Error',
      details: 'Database error'
    });
  });
});

//////////////////////////////
// DELETE /api/v1/users/:id Tests
//////////////////////////////
describe('DELETE /api/v1/users/:id', () => {
  let deleteSpy;

  beforeEach(() => {
    // CHANGED: Spy on User.deleteOne and mock a successful deletion response
    deleteSpy = jest.spyOn(User, 'deleteOne').mockResolvedValue({ deletedCount: 1 });
  });

  afterEach(() => {
    deleteSpy.mockRestore();
    jest.resetAllMocks();
  });

  test('should delete user and return 204', async () => {
    const response = await request(app)
      .delete('/api/v1/users/valid_id');
    expect(response.statusCode).toBe(204);
  });

  test('should return 500 if error occurs during deletion', async () => {
    // CHANGED: Simulate an error during deletion
    deleteSpy.mockRejectedValueOnce(new Error('Deletion error'));

    const response = await request(app)
      .delete('/api/v1/users/valid_id');

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      error: 'Internal Server Error',
      details: 'Deletion error'
    });
  });
});
