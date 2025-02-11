const request = require('supertest');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app = require('../app/app');
const Restaurant = require('../app/models/restaurant');

jest.mock('../app/models/restaurant');

describe('GET /api/v1/restaurants/:id', () => {
  let restSpy;

  beforeAll(() => {
    restSpy = jest.spyOn(Restaurant, 'findById').mockImplementation((id) => { 
      if (id === 'valid_id') {
        return {
          _id: "valid_id",
          user: "example_user_id",
          email: "owner@example.com",
          name: "Name",
          address: "123 Food Street, New York, NY",
          category: ["Italian", "Pizza"],
          rating: 2.5,
          opening_hours: [[0, 24]],
          opening_days: [0, 0, 0, 0, 0, 0, 1],
          dishes: ["Margherita Pizza", "Pasta Carbonara", "Tiramisu"],
          profile_url: "https://example.com/images/tasty-spoon.jpg"
        }
      } else {
        return null
      }
    });
  })

  afterAll(async () => {
    restSpy.mockRestore();
  });

  test('should find restaurant with valid id and return 200 with resturant data', async () => {
    const response = await request(app).get('/api/v1/restaurants/valid_id');
    expect(response.statusCode).toBe(200);
  });

  test('should return 404 if resturant not found', async () => {
    const response = await request(app).get('/api/v1/restaurants/invalid_id');
    expect(response.statusCode).toBe(404);
  });

  test('GET /api/v1/users/:id handles database error', async () => {
    restSpy.mockRejectedValue(new Error('Database error'));
    const response = await request(app).get('/api/v1/restaurants/valid_user_id');
    expect(response.statusCode).toBe(500);
  });

});

describe('GET /api/v1/restaurants/by-user/:user_id', () => {

  // Moking User.findOne method
  let restSpy;

  beforeAll(() => {
    restSpy = jest.spyOn(Restaurant, 'findOne').mockImplementation(({ user_id }) => { // to
      if (user_id === 'valid_user_id') {
        return {
          _id: "example_id",
          user: "valid_user_id",
          email: "owner@example.com",
          name: "Name",
          address: "123 Food Street, New York, NY",
          category: ["Italian", "Pizza"],
          rating: 2.5,
          opening_hours: [[0, 24]],
          opening_days: [0, 0, 0, 0, 0, 0, 1],
          dishes: ["Margherita Pizza", "Pasta Carbonara", "Tiramisu"],
          profile_url: "https://example.com/images/tasty-spoon.jpg"
        }
      } else {
        return null
      }
    });
  })

  afterAll(async () => {
    restSpy.mockRestore();
  });

  test('should find restaurant with valid user id and return 200 with resturant data', async () => {
    const response = await request(app).get('/api/v1/restaurants/by-user/valid_user_id');
    expect(response.statusCode).toBe(200);
  });

  test('should return 404 if resturant associated to user_id not found', async () => {
    const response = await request(app).get('/api/v1/restaurants/by-user/invalid_user_id');
    expect(response.statusCode).toBe(404);
  });

  test('GET /api/v1/users/:id handles database error', async () => {
    restSpy.mockRejectedValue(new Error('Database error'));
    const response = await request(app).get('/api/v1/restaurants/by-user/valid_user_id');
    expect(response.statusCode).toBe(500);
  });
});

describe('POST /api/v1/restaurants', () => {
  const validRestaurantData = {
    user_id: 'user_id_1',
    email: 'test@example.com',
    name: 'Test Restaurant',
    address: '123 Test St',
    category: 'Italian',
    price: 3,
    opening_hours: [9, 22],
    opening_days: [true, true, true, true, true, true, true],
    profile_url: 'http://example.com/image.jpg'
  };

  const mockCreatedRestaurant = {
    _id: '507f191e810c19729de860ea',
    ...validRestaurantData,
    rating: 0,
    dishes: [],
    certificate: false
  };

  var payload = {
    id: "67a362ecb0ca5655003bf523",
    email: "johndoe@example.com"
    // other data encrypted in the token	
  }
  var options = {
    expiresIn: 86400 // expires in 24 hours
  }
  var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

  beforeEach(() => {
    Restaurant.prototype.save = jest.fn().mockResolvedValue(mockCreatedRestaurant);
  });

  test('creates new restaurant and returns 201', async () => {
    const response = await request(app)
      .post(`/api/v1/restaurants?token=${token}`)
      .send(validRestaurantData);

    expect(response.statusCode).toBe(201);
    expect(response.body.id).toBe(mockCreatedRestaurant._id);
  });

  describe('should return 400 Bad Request for invalid data', () => {
    const requiredFields = ['user_id', 'email', 'name', 'address', 'category', 'price', 'opening_hours', 'opening_days', 'profile_url'];

    requiredFields.forEach(field => {
      test(`when missing ${field}`, async () => {
        const invalidData = { ...validRestaurantData };
        delete invalidData[field];

        const response = await request(app)
          .post(`/api/v1/restaurants?token=${token}`)
          .send(invalidData);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          error: `Missing required field: ${field}`
        });
      });
    });

    test('invalid email returns 400', async () => {
      const response = await request(app)
        .post(`/api/v1/restaurants?token=${token}`)
        .send({ ...validRestaurantData, email: 'invalid-email' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Invalid email format'
      });
    });
  });


  test('should return 500 when restaurant already exists', async () => {
    const duplicateError = new Error('Duplicate key');
    duplicateError.code = 11000;
    Restaurant.prototype.save.mockRejectedValueOnce(duplicateError);
    const response = await request(app)
      .post(`/api/v1/restaurants?token=${token}`)
      .send(validRestaurantData);
    expect(response.statusCode).toBe(500);
    expect(response.body.details).toBe('Duplicate key');
  });

  test('database error returns 500', async () => {
    const mockError = new Error(new Error('Database error'));
    Restaurant.prototype.save.mockRejectedValueOnce(mockError);
    const response = await request(app)
      .post(`/api/v1/restaurants?token=${token}`)
      .send(validRestaurantData);
    expect(response.statusCode).toBe(500);
  });
});

describe('GET /api/v1/restaurants with filters', () => {
  let mockRestaurants;
  
  beforeEach(() => {
    // Base mock data
    mockRestaurants = [
      {
        _id: '1',
        name: 'Pasta Paradise',
        category: 'Italian',
        address: '123 Main St',
        rating: 4.5,
        price: 3,
        opening_hours: [10, 22],
        opening_days: [false, true, true, true, true, true, false], // Closed Sun/Mon
        dishes: [{ name: 'Spaghetti' }, { name: 'Lasagna' }],
        certificate: true
      },
      {
        _id: '2',
        name: 'Taco Heaven',
        category: 'Mexican',
        address: '456 Oak Ave',
        rating: 3.8,
        price: 2,
        opening_hours: [11, 23],
        opening_days: [true, false, true, true, true, true, true], // Closed Mon
        dishes: [{ name: 'Tacos' }, { name: 'Burritos' }],
        certificate: false
      }
    ];

    Restaurant.find.mockImplementation((query) => {
      // Implement simple in-memory filtering for demonstration
      let results = [...mockRestaurants];
      
      if (query.category) {
        results = results.filter(r => query.category.$in.includes(r.category));
      }

      if (query['dishes.name']) {
        results = results.filter(r => 
          r.dishes.some(d => query['dishes.name'].$in.includes(d.name))
        );
      }

      if (query.$or) {
        const searchRegex = query.$or[0].name
        results = results.filter(r =>
            searchRegex.test(r.name) ||
            searchRegex.test(r.address) ||
            searchRegex.test(r.category) ||
            r.dishes.some(d => searchRegex.test(d.name))
        );
    }

      if (query.rating) {
        results = results.filter(r => r.rating >= query.rating.$gte);
      }

      if (query.price) {
        results = results.filter(r => r.price === query.price);
      }

      if (query.opening_hours) {
        const target = query.opening_hours.$elemMatch.$lte;
        results = results.filter(r => 
          r.opening_hours[0] <= target && r.opening_hours[1] >= target
        );
      }

      if (query['opening_days.0']) { 
        results = results.filter(r => r.opening_days[0]);
      }

      if (query.certificate) {
        results = results.filter(r => r.certificate === true);
      }

      return Promise.resolve(results);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return all restaurants without filters', async () => {
    const response = await request(app).get('/api/v1/restaurants');
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test('should filter by category', async () => {
    const response = await request(app)
      .get('/api/v1/restaurants')
      .query({ categoria: 'Italian' });
    
    expect(response.body.length).toBe(1);
    expect(response.body[0].category).toBe('Italian');
  });

  test('should filter by multiple categories', async () => {
    const response = await request(app)
      .get('/api/v1/restaurants')
      .query({ categoria: ['Italian', 'Mexican'] });
    
    expect(response.body.length).toBe(2);
  });

  test('should filter by dish names', async () => {
    const response = await request(app)
      .get('/api/v1/restaurants')
      .query({ pietanze: ['Tacos', 'Lasagna'] });
    
    expect(response.body.length).toBe(2);
    expect(response.body.some(r => r.name === 'Pasta Paradise')).toBe(true);
    expect(response.body.some(r => r.name === 'Taco Heaven')).toBe(true);
  });

  test('should search from searchbar', async () => {
    const response = await request(app)
      .get('/api/v1/restaurants')
      .query({ search: ['Paradise'] });
    
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Pasta Paradise');
  });

  test('should filter by minimum rating', async () => {
    const response = await request(app)
      .get('/api/v1/restaurants')
      .query({ valutazioni: 4 });
    
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Pasta Paradise');
  });

  test('should filter by exact price', async () => {
    const response = await request(app)
      .get('/api/v1/restaurants')
      .query({ costo: 2 });
    
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Taco Heaven');
  });

  test('should filter by current time', async () => {
    const response = await request(app)
      .get('/api/v1/restaurants')
      .query({ orario: 15 }); // 3 PM (15:00)
    
    expect(response.body.length).toBe(2);
  });

  test('should filter by opening day (Monday)', async () => {
    const response = await request(app)
      .get('/api/v1/restaurants')
      .query({ open_today: 0 }); // Monday is index 0
    
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Taco Heaven');
  });

  test('should filter by certificate', async () => {
    const response = await request(app)
      .get('/api/v1/restaurants')
      .query({ tolleranzaContaminazioni: 'true' });
    
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Pasta Paradise');
  });

  test('should combine multiple filters', async () => {
    const response = await request(app)
      .get('/api/v1/restaurants')
      .query({
        categoria: 'Mexican',
        valutazioni: 3.5,
        costo: 2,
        tolleranzaContaminazioni: 'false'
      });
    
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Taco Heaven');
  });

  test('should handle no results', async () => {
    const response = await request(app)
      .get('/api/v1/restaurants')
      .query({ categoria: 'Japanese' });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test('should handle database errors', async () => {
    Restaurant.find.mockRejectedValueOnce(new Error('Database error'));
    
    const response = await request(app).get('/api/v1/restaurants');
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Internal Server Error');
  });
});

describe('PUT /api/v1/restaurants/:id', () => {
  let restSpy;

  const validUpdateData = {
    user_id: 'user_id_1',
    email: 'updated@example.com',
    name: 'Updated Restaurant',
    address: '456 Updated St',
    category: 'Mexican',
    price: 2,
    opening_hours: [10, 23],
    opening_days: [false, true, true, true, true, true, false],
    profile_url: 'http://example.com/new.jpg',
    certificate: true
  };

  beforeEach(() => {
      restSpy = jest.spyOn(Restaurant, 'findById').mockImplementation((id) => {
        if (id === 'valid_id') {
          return {
            ...validUpdateData,
            _id: 'valid_id',
            rating: 4.5,
            dishes: [],
            save: jest.fn().mockResolvedValue({
              ...validUpdateData,
              _id: 'valid_id',
              rating: 4.5,
              dishes: []
            })
          };
        }
        return null;
      });
    });
  
    afterEach(() => {
      jest.restoreAllMocks();
    });

  var payload = {
    id: 'valid_id',
    email: 'oldemail@example.com'
  }
  var options = {
    expiresIn: 86400
  }
  var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

  test('should update restaurant successfully and return 201 with updated user data', async () => {
    const response = await request(app)
      .put(`/api/v1/restaurants/valid_id?token=${token}`)
      .send(validUpdateData);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('Updated Restaurant');});

  test('should return 404 if user not found', async () => {
    const response = await request(app)
      .put(`/api/v1/restaurants/non_existent?token=${token}`)
      .send(validUpdateData);
    expect(response.statusCode).toBe(404);
  });

  describe('should return 400 Bad Request for invalid data', () => {
    const requiredFields = ['user_id', 'email', 'name', 'address', 'category', 'price', 'opening_hours', 'opening_days', 'profile_url'];

    requiredFields.forEach(field => {
      test(`when missing ${field}`, async () => {
        const invalidData = { ... validUpdateData  };
        delete invalidData[field];

        const response = await request(app)
          .put(`/api/v1/restaurants/valid_id?token=${token}`)
          .send(invalidData);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          error: `Missing required field: ${field}`
        });
      });
    });

    test('invalid email returns 400', async () => {
      const response = await request(app)
        .put(`/api/v1/restaurants/valid_id?token=${token}`)
        .send({ ... validUpdateData , email: 'invalid-email' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Invalid email format'
      });
    });
  });


 test('database error returns 500', async () => {
     restSpy.mockRejectedValue(new Error('Database error'));
     const response = await request(app)
       .put(`/api/v1/restaurants/valid_id?token=${token}`)
       .send(validUpdateData);
     expect(response.statusCode).toBe(500);
   });
});

describe('DELETE /api/v1/restaurants/:id', () => {
  let restaurantSpy;

  beforeAll(() => {
    restaurantSpy = jest.spyOn(Restaurant, 'findById').mockImplementation((id) => {
      if (id === 'valid_id') {
        return {
          _id: 'valid_id'
        };
      }
      return null;
    });
    deleteSpy = jest.spyOn(Restaurant, 'deleteOne').mockResolvedValue({ deletedCount: 1 });
  });

  afterAll(() => {
    restaurantSpy.mockRestore();
    deleteSpy.mockRestore();
  });

  var payload = {
    id: 'valid_id',
    email: 'oldemail@example.com'
  }
  var options = {
    expiresIn: 86400
  }
  var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

  test('deletes restaurant and returns 204', async () => {
    const response = await request(app).delete(`/api/v1/restaurants/valid_id?token=${token}`);
    expect(response.statusCode).toBe(204);
  });

  test('invalid ID returns 404', async () => {
    const response = await request(app).delete(`/api/v1/restaurants/invalid_id?token=${token}`);
    expect(response.statusCode).toBe(404);
  });
});

