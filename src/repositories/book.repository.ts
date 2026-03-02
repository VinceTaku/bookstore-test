import db        from '../config/database';
import AppError  from '../utils/AppError';
import { Book, CreateBookDto, UpdateBookDto } from '../models/book.model';

// I prepare all SQL queries outside the repository object
// so they are compiled once when the app starts
// and reused every time a function is called
// this is more efficient than preparing on every call
const queries = {

  // I use SELECT * to get all columns
  // ordered by title for consistent results
  findAll: db.prepare(`
    SELECT * FROM books
    ORDER BY title ASC
  `),

  // I use ? placeholder for security
  // this prevents SQL injection attacks
  findById: db.prepare(`
    SELECT * FROM books
    WHERE id = ?
  `),

  // I find books by genre for discount calculation
  // I use LOWER() to make search case insensitive
  findByGenre: db.prepare(`
    SELECT * FROM books
    WHERE LOWER(genre) = LOWER(?)
    ORDER BY title ASC
  `),

  // I insert all required fields
  // id and created_at are handled by database
  insertBook: db.prepare(`
    INSERT INTO books (title, author, genre, price, stock)
    VALUES (?, ?, ?, ?, ?)
  `),

  // I update all fields at once
  // I always check existence before updating
  updateBook: db.prepare(`
    UPDATE books
    SET title  = ?,
        author = ?,
        genre  = ?,
        price  = ?,
        stock  = ?
    WHERE id = ?
  `),

  // I delete by id only
  // I always check existence before deleting
  deleteBook: db.prepare(`
    DELETE FROM books
    WHERE id = ?
  `)

};

const bookRepository = {

  // ── GET ALL BOOKS ─────────────────────
  // INPUT  : nothing
  // OUTPUT : array of all books
  getAll: (): Book[] => {
    return queries.findAll.all() as Book[];
  },

  // ── GET ONE BOOK BY ID ────────────────
  // INPUT  : id
  // OUTPUT : one book
  getById: (id: number): Book => {
    const book = queries.findById.get(id) as Book;

    if (!book) {
      throw new AppError("Book not found", 404);
    }

    return book;
  },

  // ── GET BOOKS BY GENRE ────────────────
  // INPUT  : genre name
  // OUTPUT : array of books in that genre
  
  // This function needs a unit test
  getByGenre: (genre: string): Book[] => {
    return queries.findByGenre.all(genre) as Book[];
  },

  // ── CREATE BOOK ───────────────────────
  // INPUT  : book data
  // OUTPUT : newly created book
  create: (data: CreateBookDto): Book => {
    const result = queries.insertBook.run(
      data.title,
      data.author,
      data.genre,
      data.price,
      data.stock
    );

    return queries.findById
                  .get(result.lastInsertRowid) as Book;
  },

  // ── UPDATE BOOK ───────────────────────
  // INPUT  : id + data to update
  // OUTPUT : updated book
  update: (id: number, data: UpdateBookDto): Book => {

    // I check the book exists before updating
    const existing = queries.findById.get(id) as Book;
    if (!existing) {
      throw new AppError("Book not found", 404);
    }

    // I keep existing values if not sent
    // using ?? operator
    const updatedTitle  = data.title  ?? existing.title;
    const updatedAuthor = data.author ?? existing.author;
    const updatedGenre  = data.genre  ?? existing.genre;
    const updatedPrice  = data.price  ?? existing.price;
    const updatedStock  = data.stock  ?? existing.stock;

    queries.updateBook.run(
      updatedTitle,
      updatedAuthor,
      updatedGenre,
      updatedPrice,
      updatedStock,
      id
    );

    return queries.findById.get(id) as Book;
  },

  // ── DELETE BOOK ───────────────────────
  // INPUT  : id
  // OUTPUT : nothing
  delete: (id: number): void => {

    // I check the book exists before deleting
    const existing = queries.findById.get(id);
    if (!existing) {
      throw new AppError("Book not found", 404);
    }

    queries.deleteBook.run(id);
  }

};

export default bookRepository;