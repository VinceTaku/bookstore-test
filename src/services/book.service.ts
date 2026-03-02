import bookRepository from '../repositories/book.repository';
import AppError       from '../utils/AppError';
import {
  CreateBookDto,
  UpdateBookDto,
  DiscountQuery,
  Book
} from '../models/book.model';

// I extract the discount calculation into its own function
// so I can test it independently without needing
// a database connection
// This function needs a unit test
export const calculateDiscountedPrice = (
  books    : Book[],
  discount : number
): number => {

  // I calculate total original price first
  const totalOriginal = books.reduce(
    (sum, book) => sum + book.price, 0
  );

  // I apply discount percentage to total
  const totalDiscounted = totalOriginal - (totalOriginal * discount / 100);

  // I round to 2 decimal places
  return parseFloat(totalDiscounted.toFixed(2));
};

const bookService = {

  // ── GET ALL BOOKS ─────────────────────
  // INPUT  : nothing
  // OUTPUT : array of all books
  getAll: (): Book[] => {
    return bookRepository.getAll();
  },

  // ── GET ONE BOOK BY ID ────────────────
  // INPUT  : id
  // OUTPUT : one book
  getById: (id: number): Book => {

    // I validate id before calling repository
    if (isNaN(id) || id <= 0) {
      throw new AppError("Invalid id", 400);
    }

    return bookRepository.getById(id);
  },

  // ── CREATE BOOK ───────────────────────
  // INPUT  : book data
  // OUTPUT : newly created book
  create: (data: CreateBookDto): Book => {

    // I check for duplicate title
    // to avoid having same book twice
    const allBooks  = bookRepository.getAll();
    const duplicate = allBooks.find(
      (b) => b.title.toLowerCase() === data.title.toLowerCase()
    );

    if (duplicate) {
      throw new AppError("Book already exists", 400);
    }

    return bookRepository.create(data);
  },

  // ── UPDATE BOOK ───────────────────────
  // INPUT  : id + data to update
  // OUTPUT : updated book
  update: (id: number, data: UpdateBookDto): Book => {

    // I validate id before calling repository
    if (isNaN(id) || id <= 0) {
      throw new AppError("Invalid id", 400);
    }

    return bookRepository.update(id, data);
  },

  // ── DELETE BOOK ───────────────────────
  // INPUT  : id
  // OUTPUT : nothing
  delete: (id: number): void => {

    // I validate id before calling repository
    if (isNaN(id) || id <= 0) {
      throw new AppError("Invalid id", 400);
    }

    bookRepository.delete(id);
  },

  // ── GET DISCOUNTED PRICE ──────────────
  // INPUT  : genre name + discount percent
  // OUTPUT : discount summary
  // This function needs a unit test
  getDiscountedPrice: (query: DiscountQuery) => {

    // I get all books in the requested genre
    const books = bookRepository.getByGenre(query.genre);

    // I handle case where no books found in genre
    if (books.length === 0) {
      throw new AppError(
        `No books found in genre: ${query.genre}`, 404
      );
    }

    // I calculate total original price
    const totalOriginal = books.reduce(
      (sum, book) => sum + book.price, 0
    );

    // I use my extracted function to calculate discount
    // I extracted it so I can unit test it independently
    const totalDiscounted = calculateDiscountedPrice(
      books,
      query.discount
    );

    // I return summary matching their required format
    return {
      genre                : query.genre,
      discount_percentage  : query.discount,
      total_original_price : parseFloat(totalOriginal.toFixed(2)),
      total_discounted_price: totalDiscounted
    };
  },

  // ── GET BOOKS BY GENRE ────────────────
// INPUT  : genre name
// OUTPUT : array of books in that genre
    getByGenre: (genre: string): Book[] => {

    // I validate genre is not empty
    if (!genre || genre.trim() === '') {
        throw new AppError("Genre is required", 400);
    }

    return bookRepository.getByGenre(genre);
    },
    };

export default bookService;