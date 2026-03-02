import { calculateDiscountedPrice } from '../services/book.service';
import { Book } from '../models/book.model';

// I am testing the discount calculation function
// I extracted this function from the service
// so I can test it without needing a database

// I create mock books to use in my tests
// these are fake books that simulate
// what would come from the database
const mockBooks: Book[] = [
  {
    id         : 1,
    title      : "To Kill a Mockingbird",
    author     : "Harper Lee",
    genre      : "Fiction",
    price      : 50,
    stock      : 20,
    created_at : "2024-01-01"
  },
  {
    id         : 2,
    title      : "1984",
    author     : "George Orwell",
    genre      : "Fiction",
    price      : 75,
    stock      : 30,
    created_at : "2024-01-01"
  }
];

// I group all discount tests together
describe('calculateDiscountedPrice', () => {

  // ── TEST 1 ────────────────────────────
  // I test the main calculation from their example
  // two books at $50 and $75 with 10% discount
  // expected result is $112.50
  test('should calculate correct discounted price', () => {
    const result = calculateDiscountedPrice(mockBooks, 10);
    expect(result).toBe(112.50);
  });

  // ── TEST 2 ────────────────────────────
  // I test that 0% discount returns
  // the original total price unchanged
  test('should return original price when discount is 0', () => {
    const result = calculateDiscountedPrice(mockBooks, 0);
    expect(result).toBe(125);
  });

  // ── TEST 3 ────────────────────────────
  // I test that 100% discount returns 0
  // meaning everything is free
  test('should return 0 when discount is 100%', () => {
    const result = calculateDiscountedPrice(mockBooks, 100);
    expect(result).toBe(0);
  });

  // ── TEST 4 ────────────────────────────
  // I test that empty array returns 0
  // no books means no price
  test('should return 0 when no books provided', () => {
    const result = calculateDiscountedPrice([], 10);
    expect(result).toBe(0);
  });

  // ── TEST 5 ────────────────────────────
  // I test with a single book
  // $50 with 10% discount = $45
  test('should handle single book correctly', () => {
    const singleBook = [mockBooks[0]];
    const result     = calculateDiscountedPrice(singleBook, 10);
    expect(result).toBe(45);
  });

  // ── TEST 6 ────────────────────────────
  // I test with 50% discount
  // $125 with 50% discount = $62.50
  test('should handle 50% discount correctly', () => {
    const result = calculateDiscountedPrice(mockBooks, 50);
    expect(result).toBe(62.50);
  });

  // ── TEST 7 ────────────────────────────
  // I test decimal precision
  // result should be rounded to 2 decimal places
  test('should round result to 2 decimal places', () => {
    const booksWithOddPrice: Book[] = [
      {
        id         : 3,
        title      : "Test Book",
        author     : "Test Author",
        genre      : "Fiction",
        price      : 33.33,
        stock      : 10,
        created_at : "2024-01-01"
      }
    ];
    const result = calculateDiscountedPrice(booksWithOddPrice, 10);
    // 33.33 - 10% = 33.33 - 3.333 = 29.997 → 30
    expect(result).toBe(30);
  });

});