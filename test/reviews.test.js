const request = require('supertest');
const jwt = require('jsonwebtoken'); 
const app = require('../app/app');
const Review = require('../app/models/review');

jest.mock('../app/models/review');

describe('GET /api/v1/reviews/:restaurant_id without user_id', () => {

    let reviewSpy;

    const mockReview = {
        user_id: 'valid_user_id',
        restaurant_id: 'valid_id',
        text: "very good"
    };

    beforeAll(() => {
        reviewSpy = jest.spyOn(Review, 'find').mockImplementation(({ restaurant_id }) => { // to
            if (restaurant_id === 'valid_id') {
                return [{ mockReview }]
            } else {
                return []
            }
        });
    });

    afterAll(async () => {
        reviewSpy.mockRestore();
    });

    test('should find reviews with valid id and return 200 with resturant data', async () => {
        const response = await request(app).get('/api/v1/reviews/valid_id');
        expect(response.statusCode).toBe(200);
    });

    test('should return 404 if reviews not found', async () => {
        const response = await request(app).get('/api/v1/reviews/invalid_id');
        expect(response.statusCode).toBe(404);
    });

    test('handles database error', async () => {
        reviewSpy.mockRejectedValue(new Error('Database error'));
        const response = await request(app).get('/api/v1/reviews/valid_id');
        expect(response.statusCode).toBe(500);
    });

});

describe('GET /api/v1/r/:restaurant_id with user_id' , () => {

    let reviewSpy;
    
    beforeAll(() => {
        reviewSpy = jest.spyOn(Review, 'find').mockImplementation(({restaurant_id, user_id}) => { 
        if (restaurant_id === 'valid_id' && user_id === "user_id") {
          return [{
              restaurant_id : "valid_id",
              user_id : "user_id",
              text: "very good"}]
        } else {
          return []
        }
      });
    });
    
      afterAll(async () => {
        reviewSpy.mockRestore();
      });
    
      test('should find review with valid id and return 200 with resturant data', async () => {
        const response = await request(app).get('/api/v1/reviews/valid_id?user_id=user_id');
        expect(response.statusCode).toBe(200);
      });
    
      test('should return 404 if review not found invaild rest_id', async () => {
        const response = await request(app).get('/api/v1/reviews/invalid_id?user_id=user_id');
        expect(response.statusCode).toBe(404);
      });
  
      test('should return 404 if review not found invalid user_id', async () => {
        const response = await request(app).get('/api/v1/reviews/valid_id?user_id=invalid_user_id');
        expect(response.statusCode).toBe(404);
      });
    
    
      test('handles database error', async () => {
        reviewSpy.mockRejectedValue(new Error('Database error'));
        const response = await request(app).get('/api/v1/reviews/valid_id?user_id=user_id');
        expect(response.statusCode).toBe(500);
      });
    
    });
  



describe('POST /api/v1/restaurants', () => {

    let reviewSpy;

    beforeAll(() => {
        reviewSpy = jest.spyOn(Review, 'findOne').mockImplementation(({ restaurant_id, user_id }) => {
            if (restaurant_id === 'valid_id' && user_id === "user_id") {
                return {
                    restaurant_id: "valid_id",
                    user_id: "user_id",
                    text: "mmm"
                }
            } else {
                return null
            }
        });
    });

    const mockCreatedReview = {
        user_id: 'valid_user_id',
        restaurant_id: 'valid_id',
        text: "very good"
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
        Review.prototype.save = jest.fn().mockResolvedValue(mockCreatedReview);
    });

    test('creates new reviews and returns 201', async () => {
        const response = await request(app)
            .post(`/api/v1/reviews?token=${token}`)
            .send(mockCreatedReview);

        expect(response.statusCode).toBe(201);

    });

    describe('should return 400 Bad Request for invalid data', () => {
        const requiredFields = ['user_id', 'restaurant_id', 'text'];

        requiredFields.forEach(field => {
            test(`when missing ${field}`, async () => {
                const invalidData = { ...mockCreatedReview };
                delete invalidData[field];

                const response = await request(app)
                    .post(`/api/v1/reviews?token=${token}`)
                    .send(invalidData);

                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    error: `Missing required field: ${field}`
                });
            });
        });
    });

    test('should return 400 when review already exists', async () => {
        const response = await request(app)
            .post(`/api/v1/reviews?token=${token}`)
            .send({ ...mockCreatedReview, user_id: 'user_id' });
        expect(response.statusCode).toBe(400);
    });

    test('database error returns 500', async () => {
        const mockError = new Error(new Error('Database error'));
        Review.prototype.save.mockRejectedValueOnce(mockError);
        const response = await request(app)
            .post(`/api/v1/reviews?token=${token}`)
            .send(mockCreatedReview);
        expect(response.statusCode).toBe(500);

    });
});



describe('PUT /api/v1/restaurants', () => {

    let reviewSpy;

    const mockReview = {
        user_id: 'valid_user_id',
        restaurant_id: 'valid_id',
        text: "very good"
    };


    const mockUpdatedReview = {
        user_id: 'valid_user_id',
        restaurant_id: 'valid_id',
        text: "excelent"
    };


    beforeAll(() => {
        reviewSpy
            = jest.spyOn(Review, 'findOne').mockImplementation(({ restaurant_id, user_id }) => {
                if (restaurant_id === 'valid_id' && user_id === "valid_user_id") {

                    return {
                        ...mockUpdatedReview,
                        save: jest.fn().mockResolvedValue({
                            ...mockUpdatedReview
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


    test('update review and returns 200', async () => {
        const response = await request(app)
            .put(`/api/v1/reviews/valid_id?user_id=valid_user_id&token=${token}`)
            .send(mockReview);

        expect(response.statusCode).toBe(200);

    });

    test('should return 404 when no restaurnt match', async () => {
        const response = await request(app)
            .put(`/api/v1/reviews/invalid_id?user_id=valid_user_id&token=${token}`)
            .send({ ...mockReview, restaurant_id: 'invalid_id' });
        expect(response.statusCode).toBe(404);
    });

    test('should return 400 when restaurnt_id dont match', async () => {
        const response = await request(app)
            .put(`/api/v1/reviews/valid_id?user_id=valid_user_id&token=${token}`)
            .send({ ...mockReview, restaurant_id: 'invalid_id' });
        expect(response.statusCode).toBe(400);
    });

    test('should return 404 when no user match', async () => {
        const response = await request(app)
            .put(`/api/v1/reviews/valid_id?user_id=invalid_user_id&token=${token}`)
            .send({ ...mockReview, user_id: 'invalid_user_id' });
        expect(response.statusCode).toBe(404);
    });
    test('should return 400 when user_id dont match', async () => {
        const response = await request(app)
            .put(`/api/v1/reviews/valid_id?user_id=valid_user_id&token=${token}`)
            .send({ ...mockReview, user_id: 'invalid_user_id' });
        expect(response.statusCode).toBe(400);
    });


    test('database error returns 500', async () => {
        reviewSpy
            .mockRejectedValue(new Error('Database error'));
        const response = await request(app)
            .put(`/api/v1/reviews/valid_id?user_id=valid_user_id&token=${token}`)
            .send(mockReview);
        expect(response.statusCode).toBe(500);
    });
});


describe('DELETE /api/v1/ratings/:restaurant_id', () => {
    let reviewSpy;
    let deleteSpy;

    const mockReview = {
        user_id: 'valid_user_id',
        restaurant_id: 'valid_id',
        text: "very good"
    };

    beforeAll(() => {
        reviewSpy = jest.spyOn(Review, 'findOne').mockImplementation(({ restaurant_id, user_id }) => {
            if (restaurant_id === 'valid_id' && user_id === "valid_user_id") {
                return {
                    mockReview
                }
            } else {
                return null
            }
        });
        deleteSpy = jest
            .spyOn(Review, 'deleteOne')
            .mockResolvedValue({ deletedCount: 1 });
    });

    afterAll(() => {
        reviewSpy
            .mockRestore();
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

    test('deletes review and returns 204', async () => {
        const response = await request(app).delete(
            `/api/v1/reviews/valid_id?user_id=valid_user_id&token=${token}`
        );
        expect(response.statusCode).toBe(204);
    });

    test('invalid restaurant returns 404', async () => {
        const response = await request(app).delete(
            `/api/v1/reviews/invalid_id?user_id=valid_user_id&token=${token}`
        );
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            error: 'Review not found'
        });
    });
    test('invalid user returns 404', async () => {
        const response = await request(app).delete(
            `/api/v1/reviews/valid_id?user_id=invalid_user_id&token=${token}`
        );
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            error: 'Review not found'
        });
    });

    test('missing user_id returns 400', async () => {
        const response = await request(app).delete(
            `/api/v1/reviews/valid_id?token=${token}`
        );
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            error: 'Missing required user_id query parameter'
        });
    });
});
