# FlixFlex Backend API

FlixFlex is a web application that allows users to explore movies and series, add them to their favorites, and enjoy a personalized streaming experience. This repository contains the backend codebase for FlixFlex.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Usage Examples](#usage-examples)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and authentication.
- Browse and search movies and series.
- View top movies and series.
- Add and remove items from favorites.
- View favorite movies and series.
- View details and watch trailers.

## Technologies

- Node.js
- Express.js
- MongoDB
- Passport.js (JWT for authentication)
- Axios (HTTP client for API requests)
- TMDB API (as a data source)

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed
- TMDB API key (get it [here](https://www.themoviedb.org/documentation/api))

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/chaalelidris/flixflex-backend.git
   ```

2. Install dependencies:
   ```bash
   cd flixflex-backend
   npm install
   ```

### Configuration

1. Create a `.env` file in the root directory:

   ```bash
   PORT=3000
   NODE_ENV=development
   DEV_ORIGIN=*
   PROD_ORIGIN=https://mysite.com

   MONGODB_URI=mongodb://localhost:27017/flixflex
   JWT_SECRET=your_secret_key_for_jwt
   TMDB_API_KEY=your_tmdb_api_key
   ```

   Replace `your-tmdb-api-key` with your TMDB API key.

2. Start the server in dev mode:

   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:3000` by default.

### Usage:

You should copy `.env.sample` to `.env` and then:

`npm run dev` - Run the development server.

`npm test` - Run tests.

`npm run test:watch` - Run tests when files update.

`npm run build` - Builds the server.

`npm start` - Runs the server.

## Endpoints:

# API Endpoints

## User Authentication

- **POST** `/api/v1/users/register`: Register a new user.
- **POST** `/api/v1/users/login`: User login.

## Movies and Series

- **GET** `/api/v1/flixflex/movies`: Get all movies.
- **GET** `/api/v1/flixflex/movies?page=2&batch10=true`: Get movies in batches of 10.
- **GET** `/api/v1/flixflex/movies/top`: Get top5 movies.
- **GET** `/api/v1/flixflex/series`: Get all series.
- **GET** `/api/v1/flixflex/series?page=2&batch10=true`: Get series in batches of 10.
- **GET** `/api/v1/flixflex/series/top`: Get top5 series.

## Favorites

- **GET** `/api/v1/users/favorites`: Get user's favorite items.
- **POST** `/api/v1/users/favorites`: Add an item to favorites.
- **DELETE** `/api/v1/users/favorites/:favoriteId`: Remove an item from favorites.

## Search, Details, and Trailer

- **GET** `/search/multi/:query`: Search for movies and series.
- **GET** `/details/:itemType/:itemId`: Get details of a movie or series.
- **GET** `/trailer/:itemType/:itemId`: Get the trailer of a movie or series.

## Authentication

User authentication is handled using Passport.js with JSON Web Tokens (JWT). Users need to register and log in to access certain features.
