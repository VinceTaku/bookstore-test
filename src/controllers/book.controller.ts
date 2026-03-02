import { Request, Response, NextFunction } from 'express';
import bookService                          from '../services/book.service';
import {
  CreateBookSchema,
  UpdateBookSchema,
  DiscountQuerySchema
} from '../models/book.model';

const bookController = {

  // ── GET ALL BOOKS ─────────────────────
  // INPUT  : nothing
  // OUTPUT : array of all books
    getAll: (_req: Request, res: Response, next: NextFunction): void => {
    try {

        // I check if genre query param was sent
        // if yes I return books filtered by genre
        // if no I return all books
        const genre = _req.query.genre as string;

        const books = genre
        ? bookService.getByGenre(genre)
        : bookService.getAll();

        res.status(200).json({
        success : true,
        data    : books
        });

    } catch (error) {
        next(error);
    }
    },

  // ── GET ONE BOOK BY ID ────────────────
  // INPUT  : id from URL params
  // OUTPUT : one book
  getById: (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id   = parseInt(req.params.id as string);
      const book = bookService.getById(id);
      res.status(200).json({
        success : true,
        data    : book
      });
    } catch (error) {
      next(error);
    }
  },

  // ── CREATE BOOK ───────────────────────
  // INPUT  : book data from body
  // OUTPUT : newly created book
  create: (req: Request, res: Response, next: NextFunction): void => {
    try {

      // I validate incoming data against my schema
      // before passing it to the service layer
      const result = CreateBookSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({
          success : false,
          message : "Validation failed",
          errors  : result.error.issues.map((e) => ({
            field   : e.path[0],
            message : e.message
          }))
        });
        return;
      }

      const book = bookService.create(result.data);
      res.status(201).json({
        success : true,
        data    : book
      });

    } catch (error) {
      next(error);
    }
  },

  // ── UPDATE BOOK ───────────────────────
  // INPUT  : id from URL + data from body
  // OUTPUT : updated book
  update: (req: Request, res: Response, next: NextFunction): void => {
    try {

      // I validate incoming data against my schema
      const result = UpdateBookSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({
          success : false,
          message : "Validation failed",
          errors  : result.error.issues.map((e) => ({
            field   : e.path[0],
            message : e.message
          }))
        });
        return;
      }

      const id   = parseInt(req.params.id as string);
      const book = bookService.update(id, result.data);
      res.status(200).json({
        success : true,
        data    : book
      });

    } catch (error) {
      next(error);
    }
  },

  // ── DELETE BOOK ───────────────────────
  // INPUT  : id from URL
  // OUTPUT : nothing
  delete: (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = parseInt(req.params.id as string);
      bookService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  // ── GET DISCOUNTED PRICE ──────────────
  // INPUT  : genre and discount from query params
  // OUTPUT : discount summary
  getDiscountedPrice: (req: Request, res: Response, next: NextFunction): void => {
    try {

      // I validate query params against my schema
      // I use z.coerce in schema to convert
      // discount string to number automatically
      const result = DiscountQuerySchema.safeParse(req.query);
      if (!result.success) {
        res.status(400).json({
          success : false,
          message : "Validation failed",
          errors  : result.error.issues.map((e) => ({
            field   : e.path[0],
            message : e.message
          }))
        });
        return;
      }

      const summary = bookService.getDiscountedPrice(result.data);
      res.status(200).json({
        success : true,
        data    : summary
      });

    } catch (error) {
      next(error);
    }
  }

};

export default bookController;