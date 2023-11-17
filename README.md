# FlixFlex Backend API

FlixFlex is a web application that allows users to explore movies and series, add them to their favorites, and enjoy a personalized streaming experience. This repository contains the backend codebase for FlixFlex.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Project structure](#project-structure)
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

## Project structure

The project follows a modular and organized structure to enhance readability, maintainability, and scalability. Here's an overview of the main directories and files:

- **`/src`**: The source code directory.

  - **`/controllers`**: Contains controllers responsible for handling HTTP requests and responses.
  - **`/db`**: Includes database-related files and configurations.
  - **`/middleware`**: Holds middleware functions used in request processing.
  - **`/models`**: Contains data models representing entities in the application.
  - **`/routes`**: Defines API routes and connects them to appropriate controllers.
  - **`/services`**: Contains business logic or services used by controllers.
  - **`/tests`**: Houses test files for automated testing.
  - **`/app.js`**: The main application file responsible for setting up the server and middleware.
  - **`/config.js`**: Stores configuration settings for the application.
  - **`/index.js`**: The entry point file that initializes the application.

- **Other Files and Directories:**
  - **`.babelrc`**: Babel configuration for transpiling modern JavaScript code.
  - **`.dockerignore`**: Specifies files and directories to be excluded when creating Docker images.
  - **`.env`**: Configuration file for environment variables. (Note: Should not be committed to version control)
  - **`.env.sample`**: Sample environment file with placeholders for configuration variables.
  - **`.eslintrc.json`**: ESLint configuration for linting JavaScript code.
  - **`.gitignore`**: Specifies files and directories to be ignored by Git.
  - **`Dockerfile`**: Configuration for building a Docker image of the application.
  - **`jest.config.json`**: Jest configuration for JavaScript testing.
  - **`jsconfig.json`**: Configuration file for JavaScript language features in VSCode.
  - **`package-lock.json`**: Auto-generated file specifying the exact versions of npm packages used.
  - **`package.json`**: Project metadata and configuration, including dependencies.
  - **`README.md`**: Documentation file providing an overview of the project.
    The structure aims to promote clean separation of concerns and facilitate ease of navigation within the project.

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

`npm run test:watch` - Run tests when files update.

`npm start` - Runs the server.

`npm test` - Run tests.

# API Endpoints

## Swagger Documentation

Explore the API documentation using Swagger Available at [FlixFlex swagger documentation](https://app.swaggerhub.com/apis-docs/CHAALELIDRIS8/flixflex/1.0.0)
(in review: please report me if there is issues)

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

- **GET** `/api/v1/flixflex/search/multi?query=query`: Search for movies and series.
- **GET** `/api/v1/flixflex/movies/:movieId`: Get details of a movie or series.
- **GET** `/api/v1/flixflex/movies/:movieId/trailer`: Get the trailer of a movie or series.
- **GET** `/api/v1/flixflex/series/:serieId`: Get details of a movie or series.
- **GET** `/api/v1/flixflex/series/:serieId/trailer`: Get the trailer of a movie or series.

## Authentication

User authentication is handled using Passport.js with JSON Web Tokens (JWT). Users need to register and log in to access certain features.

# Usage Examples

## 1. Register a New User

### Request

```http
POST /api/v1/users/register
Content-Type: application/json

{
  "username": "example_user",
  "password": "securepassword123"
}
```

### Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTU3NzlkNThiMzE0ZDY2MDEyOTE2NzIiLCJpYXQiOjE3MDAyMzE2MzcsImV4cCI6MTcwMDMxODAzN30.AYkYEdq9kDTnYP0A50kmZS2SIs3jUGkAFVcqSGGDats",
  "user": {
    "_id": "655779d58b314d6601291672",
    "username": "idris39"
  }
}
```

## 2. Add Item to Favorites

### Request

```http
POST /api/v1/users/favorites
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjBmN2MwMmE4YjVhMzgwMDE1YmQ4YzMxIiwiaWF0IjoxNjI2NjgxMjQyLCJleHAiOjE2MjY2ODM4NDJ9.IyL-5vC3IOCVI5hO7_VbRzQUksXdg2n_wvyz2ZZd11A

{
  "itemId": "12345",
  "itemType": "movie"
}
```

### Response

```json
{
  "message": "Added to favorites successfully"
}
```

# Todos

Here is a list of tasks and improvements that can be addressed for the FlixFlex backend API:

&#x2610; **Enhance Error Handling:**

- Improve error handling throughout the application by providing more meaningful error messages.
- Implement a centralized error handling middleware for consistency.

&#x2610; **Input Validation:**

- Strengthen input validation to ensure that all incoming requests are properly validated.
- Implement validation middleware to centralize validation logic.

&#x2610; **Testing:**

- Increase test coverage by adding unit tests, integration tests, and end-to-end tests where applicable.
- Integrate continuous integration (CI) tools to automate testing on code changes.

&#x2610; **Documentation:**

- Expand API documentation to include more detailed information about each endpoint, request/response formats, and authentication mechanisms.
- Keep Swagger/OpenAPI documentation up-to-date with the latest changes to the API.

&#x2610; **Optimization:**

- Identify and optimize any performance bottlenecks in the code.
- Consider caching strategies for frequently requested data.

&#x2610; **Enhance User Authentication:**

&#x2610; **Monitoring:**

- Set up monitoring tools to track the health and performance of the API in real-time.
- Configure alerts for critical issues or unusual behavior.
