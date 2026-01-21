<p align="center">
  <h1 align="center">🏠 StayScape</h1>
  <p align="center">
    <strong>A Full-Stack Vacation Rental Platform</strong>
    <br/>
    <em>Discover, Book, and Host Properties Worldwide</em>
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Mapbox-000000?style=for-the-badge&logo=mapbox&logoColor=white" alt="Mapbox"/>
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary"/>
  <img src="https://img.shields.io/badge/Passport.js-34E27A?style=for-the-badge&logo=passport&logoColor=white" alt="Passport.js"/>
</p>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Routes](#-api-routes)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About The Project

**StayScape** is a full-featured vacation rental marketplace inspired by platforms like Airbnb. It enables users to discover unique accommodations worldwide, book their stays seamlessly, and even become hosts by listing their own properties. Built with the **MERN stack** (MongoDB, Express.js, Node.js) and rendered with **EJS**, this application demonstrates proficiency in full-stack development, RESTful API design, and modern web technologies.

### 🌟 What Makes StayScape Special?

- **Complete Booking System** with date conflict detection and availability management
- **Interactive Map Integration** using Mapbox GL JS with clustering and popups
- **Cloud-Based Image Management** via Cloudinary for optimized media handling
- **Secure Authentication** with session management and protected routes
- **Responsive Design** that works flawlessly across all devices

---

## ✨ Key Features

### 🏡 Property Listings
- **Browse & Search**: Filter listings by location, price range, and categories
- **Category Filters**: Explore by type - Trending, Rooms, Iconic Cities, Mountains, Castles, Pools, Camping, Farms, Arctic, Domes, and Boats
- **Detailed Views**: Image galleries, amenity lists, location maps, and owner information
- **Multiple Image Upload**: Support for primary and additional property images

### 📅 Booking System
- **Real-time Availability**: Check available dates with conflict detection
- **Smart Date Validation**: Prevents double bookings with database-level checks
- **Booking Management**: View, track, and manage reservations
- **Host Dashboard**: Property owners can see and manage incoming bookings
- **Price Calculation**: Automatic total price computation based on nights stayed

### 🗺️ Interactive Maps
- **Mapbox Integration**: Beautiful, interactive maps for each listing
- **Cluster View**: See all listings on a single map with intelligent clustering
- **Location Geocoding**: Automatic coordinates from address using Mapbox Geocoding API
- **Custom Popups**: Rich property previews directly on the map

### 👤 User Features
- **Secure Authentication**: Register, login, and logout with Passport.js
- **User Profiles**: Personalized dashboard with listings and bookings
- **Wishlist**: Save favorite properties for later
- **Review System**: Rate and review properties with 1-5 star ratings

### 🛡️ Security & Authorization
- **Owner-Only Actions**: Edit/delete restricted to property owners
- **Review Authorization**: Only authors can modify their reviews
- **Session Management**: Secure sessions with MongoDB store
- **Input Validation**: Schema validation using Joi

### 📱 Amenities System
Track and display 20+ amenities including:
```
WiFi • AC • TV • Kitchen • Washer • Parking • Pool • Hot Tub
Gym • BBQ • Fireplace • Balcony • Garden • Beach Access
Ski Access • Pet Friendly • Smoking Allowed • Workspace
First Aid Kit • Fire Extinguisher
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js 5** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **Passport.js** | Authentication |
| **Express-Session** | Session management |
| **Connect-Mongo** | MongoDB session store |

### Frontend
| Technology | Purpose |
|------------|---------|
| **EJS** | Templating engine |
| **EJS-Mate** | Layout support for EJS |
| **CSS3** | Styling |
| **JavaScript** | Client-side interactivity |

### External Services
| Service | Purpose |
|---------|---------|
| **MongoDB Atlas** | Cloud database hosting |
| **Cloudinary** | Image upload and CDN |
| **Mapbox GL JS** | Interactive maps |
| **Mapbox Geocoding** | Address to coordinates |

### Development & Utilities
| Tool | Purpose |
|------|---------|
| **Multer** | File upload handling |
| **Joi** | Data validation |
| **Method-Override** | HTTP verb support |
| **Connect-Flash** | Flash messages |
| **Dotenv** | Environment variables |

---

## 🏗️ Architecture

```
StayScape/
├── 📁 controllers/          # Route handlers (MVC pattern)
│   ├── booking.js           # Booking logic
│   ├── listing.js           # Listing CRUD operations
│   ├── review.js            # Review management
│   └── users.js             # User authentication
│
├── 📁 models/               # Mongoose schemas
│   ├── booking.js           # Booking model with conflict detection
│   ├── listing.js           # Property listings with GeoJSON
│   ├── review.js            # Review model
│   └── user.js              # User model with Passport
│
├── 📁 routes/               # Express routers
│   ├── booking.js           # /bookings routes
│   ├── listing.js           # /listings routes
│   ├── review.js            # /listings/:id/reviews routes
│   └── user.js              # Authentication routes
│
├── 📁 views/                # EJS templates
│   ├── 📁 layouts/          # Layout templates
│   ├── 📁 includes/         # Partials (navbar, footer)
│   ├── 📁 listings/         # Listing pages
│   └── 📁 users/            # User pages
│
├── 📁 public/               # Static assets
│   ├── 📁 css/              # Stylesheets
│   └── 📁 js/               # Client-side JavaScript
│
├── 📁 utils/                # Utility functions
│   └── ExpressError.js      # Custom error class
│
├── 📁 init/                 # Database initialization
│
├── app.js                   # Main entry point
├── cloudConfig.js           # Cloudinary configuration
├── middleware.js            # Custom middleware
├── schema.js                # Joi validation schemas
└── package.json             # Dependencies
```

### 📊 Database Schema Design

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │   Listing   │       │   Review    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ _id         │◀──────│ owner       │       │ _id         │
│ username    │       │ _id         │──────▶│ author      │
│ email       │       │ title       │       │ comment     │
│ password    │       │ description │       │ rating      │
│ wishlist[]  │──────▶│ price       │       │ createdAt   │
└─────────────┘       │ location    │       └─────────────┘
                      │ country     │              ▲
                      │ image       │              │
                      │ images[]    │              │
                      │ category    │       ┌──────┘
                      │ amenities[] │       │
                      │ geometry    │       │
                      │ reviews[]   │───────┘
                      └─────────────┘
                             ▲
                             │
                      ┌──────┴──────┐
                      │   Booking   │
                      ├─────────────┤
                      │ _id         │
                      │ listing     │
                      │ guest       │
                      │ checkIn     │
                      │ checkOut    │
                      │ guests      │
                      │ totalPrice  │
                      │ status      │
                      └─────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v20.x recommended)
- **MongoDB** (local or Atlas)
- **Cloudinary Account** (for image uploads)
- **Mapbox Account** (for maps)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stayscape.git
   cd stayscape
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (see section below)

4. **Start the server**
   ```bash
   node app.js
   ```

5. **Open your browser**
   ```
   http://localhost:8080
   ```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
ATLASDB_URL=<your-mongodb-atlas-connection-string>

# Session
SECRET=<your-session-secret>

# Cloudinary
CLOUD_NAME=<your-cloud-name>
CLOUD_API_KEY=<your-api-key>
CLOUD_API_SECRET=<your-api-secret>

# Mapbox
MAP_TOKEN=<your-mapbox-token>
```

---

## 🛣️ API Routes

### Listings
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/listings` | View all listings (with filters) |
| `GET` | `/listings/new` | New listing form |
| `POST` | `/listings` | Create new listing |
| `GET` | `/listings/:id` | View single listing |
| `GET` | `/listings/:id/edit` | Edit listing form |
| `PUT` | `/listings/:id` | Update listing |
| `DELETE` | `/listings/:id` | Delete listing |
| `GET` | `/listings/map` | Interactive map view |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/listings/:id/reviews` | Add review |
| `DELETE` | `/listings/:id/reviews/:reviewId` | Delete review |

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/signup` | Registration form |
| `POST` | `/signup` | Create account |
| `GET` | `/login` | Login form |
| `POST` | `/login` | Authenticate user |
| `GET` | `/logout` | End session |
| `GET` | `/profile` | User dashboard |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/bookings/:listingId` | Create booking |
| `GET` | `/my-bookings` | View user's bookings |
| `GET` | `/my-listings/bookings` | View host's received bookings |
| `DELETE` | `/bookings/:id` | Cancel booking |

---

## 📸 Screenshots

> *Add screenshots of your application here*

### Home Page
*Browse all available listings with category filters*

### Listing Details
*View property details, amenities, reviews, and location map*

### Interactive Map
*Explore all listings on a clustered map view*

### User Dashboard
*Manage bookings, listings, and wishlist*

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 📬 Contact

**Bhumika Narula** 

- GitHub: [@bhumikanarula](https://github.com/bhumikanarula)
- LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)

---

<p align="center">
  <strong>⭐ If you found this project helpful, please consider giving it a star!</strong>
</p>

---

## 🙏 Acknowledgments

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- [Cloudinary](https://cloudinary.com/)
- [Passport.js](http://www.passportjs.org/)
