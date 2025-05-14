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

To add products route functionality as seen in your code:

```bash
curl -X GET http://localhost:3000/product
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
