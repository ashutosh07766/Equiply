# Equiply - Equipment Rental Platform

Equiply is a full-stack web application that enables users to rent equipment and tools instead of buying them. The platform allows users to list their own items for rent and rent items from others, creating a peer-to-peer sharing economy for equipment.

## 🚀 Features

### User Features
- **User Authentication**
  - Email/password registration and login
  - Google OAuth authentication
  - User profile management
  
- **Product Browsing & Search**
  - Browse all available products
  - Search by keywords
  - Filter by location and categories
  - Featured products section
  
- **Rental Process**
  - Add items to wishlist
  - Select rental duration
  - Checkout process with address selection
  - Multiple payment options
  
- **User Dashboard**
  - Order history
  - Listed items management
  - Wishlist management
  - Profile settings

### Owner/Admin Features
- **Admin Dashboard**
  - User management (ban/unban)
  - Product management
  - Order monitoring
  - Featured product selection
  - Analytics overview

## 🛠️ Technology Stack

### Frontend
- React.js with Vite
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- Context API for state management

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Cloudinary for image storage

## 📋 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB server
- Cloudinary account for image uploads
- Google OAuth credentials (for Google login)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/equiply.git
   cd Equiply/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment variables**
   Create a `.env` file in the backend directory with the following variables:
   ```
   TOKEN_SECRET=your_jwt_secret_key
   MONGO_URL=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```
   The server will run on http://localhost:3000

### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd ../equiply-frontend-customer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment variables**
   Create a `.env` file in the frontend directory with:
   ```
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The frontend will run on http://localhost:5173

## 📊 API Endpoints

### Authentication
- `POST /user/signup` - Register a new user
- `POST /user/signin` - Login with email and password
- `POST /oauth/google` - Login with Google OAuth

### Products
- `GET /product` - Get all products
- `GET /product/featured` - Get featured products
- `GET /product/:id` - Get specific product details
- `POST /product` - Create a new product listing

### User Operations
- `GET /user/addresses` - Get user addresses
- `POST /user/address` - Add a new address
- `PUT /user/address/:id` - Update an address
- `DELETE /user/address/:id` - Delete an address
- `GET /checkout/my-orders` - Get user's order history

### Orders & Payments
- `POST /checkout` - Create a new order
- `POST /payment/process` - Process payment for an order
- `GET /payment/:orderId` - Get payment details for an order

### Admin Operations
- `GET /admin/dashboard` - Get admin dashboard statistics
- `GET /admin/users` - Get all users
- `PATCH /admin/user/:id` - Update user status (ban/unban)
- `GET /admin/products` - Get all products for admin
- `POST /admin/set-featured` - Set featured products

## 🧪 Testing

For testing the application:

1. **Create test users**
   - Regular user: Register through the signup page
   - Admin user: Create via backend/database with type: 'admin'

2. **Sample test flow**
   - Register/login with a user account
   - Browse and add products to wishlist
   - Proceed to checkout
   - Add delivery address
   - Complete payment
   - View order history

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- Input validation
- CORS configuration
- User role authorization

## 🌟 Future Enhancements

- Real-time notifications
- Chat functionality between renters and owners
- Review and rating system
- Advanced search filters
- Geolocation-based product search
- Mobile app version
- Integration with more payment gateways
