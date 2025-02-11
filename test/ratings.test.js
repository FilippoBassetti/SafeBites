const request = require('supertest');
const jwt = require('jsonwebtoken'); 
const app = require('../app/app');
const Rating = require('../app/models/rating');

jest.mock('../app/models/rating');

describe('GET /api/v1/ratings/:restaurant_id without user_id' , () => {

let ratingSpy;

  beforeAll(() => {
    ratingSpy = jest.spyOn(Rating, 'find').mockImplementation(({restaurant_id}) => {
      if (restaurant_id === 'valid_id') {
        return [{
            restaurant_id : "valid_id",
            user_id : "user_id",
            rating : 5}]
      } else {
        return []
      }
    });
  });

  afterAll(async () => {
    ratingSpy.mockRestore();
  });

  test('should find rating with valid id and return 200 with resturant data', async () => {
    const response = await request(app).get('/api/v1/ratings/valid_id');
    expect(response.statusCode).toBe(200);
  });

  test('should return 404 if rating not found', async () => {
    const response = await request(app).get('/api/v1/ratings/invalid_id');
    expect(response.statusCode).toBe(404);
  });

  test('handles database error', async () => {
    ratingSpy.mockRejectedValue(new Error('Database error'));
    const response = await request(app).get('/api/v1/ratings/valid_id');
    expect(response.statusCode).toBe(500);
  });

});

describe('GET /api/v1/ratings/:restaurant_id with user_id' , () => {

  let ratingSpy;
  
  beforeAll(() => {
    ratingSpy = jest.spyOn(Rating, 'find').mockImplementation(({restaurant_id, user_id}) => { 
      if (restaurant_id === 'valid_id' && user_id === "user_id") {
        return [{
            restaurant_id : "valid_id",
            user_id : "user_id",
            rating : 5}]
      } else {
        return []
      }
    });
  });
  
    afterAll(async () => {
      ratingSpy.mockRestore();
    });
  
    test('should find rating with valid id and return 200 with resturant data', async () => {
      const response = await request(app).get('/api/v1/ratings/valid_id?user_id=user_id');
      expect(response.statusCode).toBe(200);
    });
  
    test('should return 404 if rating not found invaild rest_id', async () => {
      const response = await request(app).get('/api/v1/ratings/invalid_id?user_id=user_id');
      expect(response.statusCode).toBe(404);
    });

    test('should return 404 if rating not found invalid user_id', async () => {
      const response = await request(app).get('/api/v1/ratings/valid_id?user_id=invalid_user_id');
      expect(response.statusCode).toBe(404);
    });
  
  
    test('handles database error', async () => {
      ratingSpy.mockRejectedValue(new Error('Database error'));
      const response = await request(app).get('/api/v1/ratings/valid_id?user_id=user_id');
      expect(response.statusCode).toBe(500);
    });
  
  });


describe('POST /api/v1/restaurants', () => {
    
    let ratingSpy;

    beforeAll(() => {
      ratingSpy = jest.spyOn(Rating, 'findOne').mockImplementation(({restaurant_id, user_id}) => { 
        
        if (restaurant_id === 'valid_id' && user_id === "user_id") {
          return [{
              restaurant_id : "valid_id",
              user_id : "user_id",
              rating : 5}]
        } else {
          return null
        }
      });
    });
    
    const mockCreatedRating = {
      user_id: 'valid_user_id',
      restaurant_id: 'valid_id',
      rating: 4
    };
  
  
    var payload = {
      id: "67a362ecb0ca5655003bf523",
      email: "johndoe@example.com"

    }
    var options = {
      expiresIn: 86400 // expires in 24 hours
    }
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
  
    beforeEach(() => {
      Rating.prototype.save = jest.fn().mockResolvedValue(mockCreatedRating);
    });

    
  
    test('creates new rating and returns 201', async () => {
      const response = await request(app)
        .post(`/api/v1/ratings?token=${token}`)
        .send(mockCreatedRating);
  
      expect(response.statusCode).toBe(201);
     
    });
   
    describe('should return 400 Bad Request for invalid data', () => {
      const requiredFields = ['user_id', 'restaurant_id', 'rating'];
  
      requiredFields.forEach(field => {
        test(`when missing ${field}`, async () => {
          const invalidData = { ...mockCreatedRating };
          delete invalidData[field];
  
          const response = await request(app)
            .post(`/api/v1/ratings?token=${token}`)
            .send(invalidData);
  
          expect(response.status).toBe(400);
          expect(response.body).toEqual({
            error: `Missing required field: ${field}`
          });
        });
      });
    });
  
    test('should return 400 when rating already exists', async () => {
      const response = await request(app)
        .post(`/api/v1/ratings?token=${token}`)
        .send({ ...mockCreatedRating, user_id: 'user_id'});
      expect(response.statusCode).toBe(400);
    });
  
    test('database error returns 500', async () => {
      const mockError = new Error(new Error('Database error'));
      Rating.prototype.save.mockRejectedValueOnce(mockError);
      const response = await request(app)
        .post(`/api/v1/ratings?token=${token}`)
        .send(mockCreatedRating);
      expect(response.statusCode).toBe(500);
     
    });
  });

  describe('PUT /api/v1/restaurants', () => {
    
    let ratingSpy;

    const mockRating = {
      user_id: 'valid_user_id',
      restaurant_id: 'valid_id',
      rating: 3
    };
  
    
    const mockUpdatedRating = {
      user_id: 'valid_user_id',
      restaurant_id: 'valid_id',
      rating: 4
    };
  

    beforeAll(() => {
      ratingSpy = jest.spyOn(Rating, 'findOne').mockImplementation(({restaurant_id, user_id}) => { 

        if (restaurant_id === 'valid_id' && user_id === "valid_user_id") {
          
          return {
            ...mockUpdatedRating,
            save: jest.fn().mockResolvedValue({
              ...mockUpdatedRating
            })
          }; 
        } else {
          return null
        }
      });
    });
    
  
    var payload = {
      id: "67a362ecb0ca5655003bf523",
      email: "johndoe@example.com"
      // other data encrypted in the token	
    }
    var options = {
      expiresIn: 86400 // expires in 24 hours
    }
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

  
    test('update rating and returns 200', async () => {
      const response = await request(app)
        .put(`/api/v1/ratings/valid_id?user_id=valid_user_id&token=${token}`)
        .send(mockRating);
  
      expect(response.statusCode).toBe(200);
     
    });

    test('should return 404 when no restaurnt match', async () => {
      const response = await request(app)
        .put(`/api/v1/ratings/invalid_id?user_id=valid_user_id&token=${token}`)
        .send({ ...mockRating, restaurant_id: 'invalid_id'});
      expect(response.statusCode).toBe(404);
    });

    test('should return 400 when restaurnt_id dont match', async () => {
      const response = await request(app)
        .put(`/api/v1/ratings/valid_id?user_id=valid_user_id&token=${token}`)
        .send({ ...mockRating, restaurant_id: 'invalid_id'});
      expect(response.statusCode).toBe(400);
    });

    test('should return 404 when no user match', async () => {
      const response = await request(app)
        .put(`/api/v1/ratings/valid_id?user_id=invalid_user_id&token=${token}`)
        .send({ ...mockRating, user_id: 'invalid_user_id'});
      expect(response.statusCode).toBe(404);
    });
    test('should return 400 when user_id dont match', async () => {
      const response = await request(app)
        .put(`/api/v1/ratings/valid_id?user_id=valid_user_id&token=${token}`)
        .send({ ...mockRating, user_id: 'invalid_user_id'});
      expect(response.statusCode).toBe(400);
    });
  
  
    test('database error returns 500', async () => {
      ratingSpy.mockRejectedValue(new Error('Database error'));
      const response = await request(app)
        .put(`/api/v1/ratings/valid_id?user_id=valid_user_id&token=${token}`)
        .send(mockRating);
      expect(response.statusCode).toBe(500);
    });
  });

  describe('DELETE /api/v1/ratings/:restaurant_id', () => {
    let ratingSpy;
    let deleteSpy;

    const mockRating = {
      user_id: 'valid_user_id',
      restaurant_id: 'valid_id',
      rating: 3
    };
  
    beforeAll(() => {
      ratingSpy = jest.spyOn(Rating, 'findOne').mockImplementation(({restaurant_id, user_id}) => { 
        if (restaurant_id === 'valid_id' && user_id === "valid_user_id") {
          return {
            mockRating
            }
          } else {
          return null
        }
      });
      deleteSpy = jest
        .spyOn(Rating, 'deleteOne')
        .mockResolvedValue({ deletedCount: 1 });
    });
    
    afterAll(() => {
      ratingSpy.mockRestore();
      deleteSpy.mockRestore();
    });

    var payload = {
      id: "67a362ecb0ca5655003bf523",
      email: "johndoe@example.com"
      // other data encrypted in the token	
    }
    var options = {
      expiresIn: 86400 // expires in 24 hours
    }
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
  
    test('deletes rating and returns 204', async () => {
      const response = await request(app).delete(
        `/api/v1/ratings/valid_id?user_id=valid_user_id&token=${token}`
      );
      expect(response.statusCode).toBe(204);
    });
  
    test('invalid restaurant returns 404', async () => {
      const response = await request(app).delete(
        `/api/v1/ratings/invalid_id?user_id=valid_user_id&token=${token}`
      );
      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({
        error: 'Rating not found'
      });
    });
    test('invalid user returns 404', async () => {
      const response = await request(app).delete(
        `/api/v1/ratings/valid_id?user_id=invalid_user_id&token=${token}`
      );
      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({
        error: 'Rating not found'
      });
    });
  
    test('missing user_id returns 400', async () => {

      const response = await request(app).delete(
        `/api/v1/ratings/valid_id?token=${token}`
      );
      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Missing required user_id query parameter'
      });
    });
  });
  