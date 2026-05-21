# A-09 Backend - Doctors Appointment System

A robust Node.js backend API for a doctors appointment management system with secure authentication and MongoDB integration.

## Overview

This backend service provides API endpoints for managing doctors, appointments, and user authentication. It uses Express.js, MongoDB, and Better Auth for JWT-based authentication with Google OAuth support.

---

## Functionalities

### 1. **User Authentication & Authorization**
- **JWT-based authentication** via Better Auth with Google OAuth integration
- **Token verification** using remote JWKS (JSON Web Key Set) from Better Auth
- **Role-based access control** with middleware protection (`requireAuth`)
- **User profile management** - retrieve authenticated user information
- Automatic token expiration handling with clear error responses

### 2. **Doctor Management**
- **List all doctors** - Retrieve complete list of available doctors with details
- **Doctor profiles** - Store and manage doctor information in MongoDB
- **Doctor filtering** - Support for querying doctors by specialty and availability
- **Database persistence** - MongoDB collection for doctors data

### 3. **Appointment Booking System**
- **Create appointments** - Schedule appointments between patients and doctors
- **Appointment tracking** - Store appointment details in MongoDB
- **Appointment history** - Retrieve past and upcoming appointments
- **Status management** - Track appointment states (pending, confirmed, completed, cancelled)

### 4. **Secure API Endpoints with CORS**
- **Cross-Origin Resource Sharing (CORS)** - Frontend communication from localhost:3000
- **Credential-based authentication** - Secure cookie and token handling
- **Request/Response middleware** - JSON parsing and data validation
- **Error handling** - Comprehensive HTTP status codes and error messages

### 5. **MongoDB Database Integration**
- **Connection pooling** - Efficient MongoDB client management
- **Collections management** - Separate collections for doctors and appointments
- **Async operations** - Non-blocking database queries using async/await
- **Data persistence** - Reliable storage and retrieval of application data

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Express** | 5.2.1 | Web framework & routing |
| **MongoDB** | 7.2 | NoSQL database |
| **JOSE** | Latest | JWT verification & JWK processing |
| **CORS** | 2.8.6 | Cross-origin resource sharing |
| **dotenv** | 17.4.2 | Environment variable management |

---

## Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** account and connection string
- **Better Auth** instance (for JWT & Google OAuth)

### Setup Steps

1. **Clone the repository**
   ```bash
   cd a-09-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   BETTER_AUTH_SECRET=your_better_auth_secret
   BETTER_AUTH_URL=http://localhost:3000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=dbname
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Start the server**
   ```bash
   npm start
   # Server runs on http://localhost:5000
   ```

---

## API Endpoints

### Authentication & User Routes

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/users/me` | Get authenticated user profile | ✅ Yes |
| `GET` | `/profile` | Get user profile information | ✅ Yes |

### Doctor Routes

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/doctors` | List all available doctors | ❌ No |

### Appointment Routes

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/appointments` | Get user's appointments | ✅ Yes |
| `POST` | `/appointments` | Create new appointment | ✅ Yes |
| `PUT` | `/appointments/:id` | Update appointment status | ✅ Yes |
| `DELETE` | `/appointments/:id` | Cancel appointment | ✅ Yes |

---

## Authentication

### JWT Bearer Token

All protected endpoints require a Bearer token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

### Token Structure

The JWT payload includes:
- `sub` - User ID
- `email` - User email address
- `name` - User full name
- `image` - User profile image URL
- Additional OAuth claims from Google

### Error Handling

- **No token**: Returns `401 Unauthorized: No token provided`
- **Expired token**: Returns `401 Unauthorized: Token expired`
- **Invalid token**: Returns `401 Unauthorized: Invalid token`

---

## Project Structure

```
a-09-backend/
├── index.js              # Main server & routes
├── package.json          # Dependencies & metadata
├── .env                  # Environment variables (git-ignored)
└── README.md             # Documentation
```

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `BETTER_AUTH_SECRET` | Secret key for Better Auth | `uraHCNIuVwBWXgh0Lx9wTngFTs2qYMXn` |
| `BETTER_AUTH_URL` | Base URL of Better Auth instance | `http://localhost:3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster...` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `1078852276613-kp3...` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | `GOCSPX-yFTZ2w1WAz...` |

---

## Server Configuration

- **Port**: 5000
- **CORS Origin**: http://localhost:3000
- **Credentials**: Enabled
- **DNS Servers**: Google Public DNS (8.8.8.8, 8.8.4.4)

---

## Error Handling

The API returns standardized error responses:

```json
{
  "error": "Error message description"
}
```

### Common Status Codes

- `200 OK` - Successful request
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid authentication
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Security Considerations

✅ **Implemented**:
- JWT token verification via JWKS
- CORS protection
- Environment variable protection
- Bearer token validation
- Token expiration checks

🔒 **Best Practices**:
- Never commit `.env` file
- Use HTTPS in production
- Implement rate limiting
- Add input validation
- Use secure MongoDB passwords
- Rotate secrets regularly

---

## Future Enhancements

- [ ] Request validation schemas (Joi/Zod)
- [ ] Rate limiting middleware
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Unit and integration tests
- [ ] Appointment notifications
- [ ] Doctor availability calendar
- [ ] Payment integration
- [ ] Admin dashboard endpoints

---

## License

ISC

---

## Support

For issues or questions, contact the development team or check the project documentation.
