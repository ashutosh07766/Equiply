## User Routes

### 1. User Signup

```bash
curl -X POST http://localhost:3000/user/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": 1234567890
  }'
```

### 2. User Signin

```bash
curl -X POST http://localhost:3000/user/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Update User

```bash
curl -X PATCH http://localhost:3000/user/test@example.com \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "phone": 9876543210
  }'
```

### 4. Delete User

```bash
curl -X DELETE http://localhost:3000/user/test@example.com
```

## Product Routes

### 1. Get All Products

```bash
curl -X GET http://localhost:3000/product
```

### 2. Get Product by ID

```bash
curl -X GET http://localhost:3000/product/[PRODUCT_ID]
```

## Review Routes

### 1. Create a Review (requires authentication)

```bash
curl -X POST http://localhost:3000/review \
  -H "Content-Type: application/json" \
  -H "x-access-token: YOUR_JWT_TOKEN" \
  -d '{
    "productId": "PRODUCT_ID_HERE",
    "rating": 5,
    "comment": "This is an excellent product! Highly recommended."
  }'
```

### 2. Get Reviews for a Product

```bash
curl -X GET http://localhost:3000/review/product/PRODUCT_ID_HERE
```

### 3. Get Review Statistics for a Product

```bash
curl -X GET http://localhost:3000/review/stats/PRODUCT_ID_HERE
```

### 4. Update a Review (requires authentication)

```bash
curl -X PUT http://localhost:3000/review/REVIEW_ID_HERE \
  -H "Content-Type: application/json" \
  -H "x-access-token: YOUR_JWT_TOKEN" \
  -d '{
    "rating": 4,
    "comment": "Updated review comment - still a good product!"
  }'
```

### 5. Delete a Review (requires authentication)

```bash
curl -X DELETE http://localhost:3000/review/REVIEW_ID_HERE \
  -H "x-access-token: YOUR_JWT_TOKEN"
```

Note: For any protected routes requiring authentication, you'll need to include the JWT token received during login:

```bash
curl -X GET http://localhost:3000/protected-route \
  -H "x-access-token: YOUR_JWT_TOKEN"
```

To test the server connection:

```bash
curl http://localhost:3000
```
