# Bookstore API

A RESTful API for a bookstore built with Express and TypeScript.
I implemented an n-layered architecture to ensure clean separation
of concerns and maintainability.

## Tech Stack

- **Runtime**    : Node.js
- **Framework**  : Express
- **Language**   : TypeScript
- **Database**   : SQLite (better-sqlite3)
- **Validation** : Zod
- **Testing**    : Jest

## Architecture

I used an n-layered architecture where each layer
has one responsibility and only communicates
with the layer directly next to it.
```
Routes → Controller → Service → Repository → Database
```

- **Routes**     : Maps URLs to controller functions
- **Controller** : Handles HTTP requests and responses
- **Service**    : Contains business logic and validation
- **Repository** : Handles all database queries
- **Models**     : Defines data shapes and validation schemas

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/VinceTaku/bookstore-test.git
cd bookstore-test
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
# create .env file in root of project
# add the following:
PORT=3000
DB_NAME=bookstore.db
```

4. Run the API
```bash
npm run dev
```

The API will start on http://localhost:3000

## Running Tests
```bash
npm test
```

Expected output:
```
PASS src/tests/discount.test.ts
  calculateDiscountedPrice
    ✓ should calculate correct discounted price
    ✓ should return original price when discount is 0
    ✓ should return 0 when discount is 100%
    ✓ should return 0 when no books provided
    ✓ should handle single book correctly
    ✓ should handle 50% discount correctly
    ✓ should round result to 2 decimal places

Tests: 7 passed
```

## API Endpoints

### Health Check
```
GET /
```

Response:
```json
{
  "success" : true,
  "message" : "Bookstore API is running!",
  "version" : "1.0.0"
}
```

---

### Get All Books
```
GET /api/books
```

Response:
```json
{
  "success" : true,
  "data"    : [
    {
      "id"         : 1,
      "title"      : "To Kill a Mockingbird",
      "author"     : "Harper Lee",
      "genre"      : "Fiction",
      "price"      : 50,
      "stock"      : 20,
      "created_at" : "2024-01-01"
    }
  ]
}
```

---

### Get Books By Genre
```
GET /api/books?genre=Fiction
```

Response:
```json
{
  "success" : true,
  "data"    : [
    {
      "id"     : 1,
      "title"  : "To Kill a Mockingbird",
      "author" : "Harper Lee",
      "genre"  : "Fiction",
      "price"  : 50,
      "stock"  : 20
    }
  ]
}
```

---

### Get One Book
```
GET /api/books/:id
```

Response:
```json
{
  "success" : true,
  "data"    : {
    "id"     : 1,
    "title"  : "To Kill a Mockingbird",
    "author" : "Harper Lee",
    "genre"  : "Fiction",
    "price"  : 50,
    "stock"  : 20
  }
}
```

---

### Create Book
```
POST /api/books
```

Request body:
```json
{
  "title"  : "To Kill a Mockingbird",
  "author" : "Harper Lee",
  "genre"  : "Fiction",
  "price"  : 50,
  "stock"  : 20
}
```

Response:
```json
{
  "success" : true,
  "data"    : {
    "id"     : 1,
    "title"  : "To Kill a Mockingbird",
    "author" : "Harper Lee",
    "genre"  : "Fiction",
    "price"  : 50,
    "stock"  : 20
  }
}
```

---

### Update Book
```
PUT /api/books/:id
```

Request body (all fields optional):
```json
{
  "price" : 55
}
```

Response:
```json
{
  "success" : true,
  "data"    : {
    "id"     : 1,
    "title"  : "To Kill a Mockingbird",
    "author" : "Harper Lee",
    "genre"  : "Fiction",
    "price"  : 55,
    "stock"  : 20
  }
}
```

---

### Delete Book
```
DELETE /api/books/:id
```

Response:
```
204 No Content
```

---

### Get Discounted Price
```
GET /api/books/discounted-price?genre={genre_name}&discount={discount_percentage}
```

Example:
```
GET /api/books/discounted-price?genre=Fiction&discount=10
```

Response:
```json
{
  "success" : true,
  "data"    : {
    "genre"                  : "Fiction",
    "discount_percentage"    : 10,
    "total_original_price"   : 125,
    "total_discounted_price" : 112.50
  }
}
```

---

## Error Handling

All errors return consistent format:
```json
{
  "success" : false,
  "message" : "Error message here"
}
```

### Status Codes
```
200 → success
201 → created
204 → deleted
400 → validation error
404 → not found
500 → server error
```

## Input Validation

I use Zod for input validation on all endpoints.

### Book Validation Rules
```
title  → required, min 1 character
author → required, min 1 character
genre  → required, min 1 character
price  → required, must be positive number
stock  → required, must be 0 or more
```

### Discount Validation Rules
```
genre    → required, min 1 character
discount → required, must be 0-100
```
