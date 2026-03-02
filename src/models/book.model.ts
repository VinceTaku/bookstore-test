import { z } from 'zod';

// I define the shape of a book
// this interface is used across
// all layers of my application
export interface Book {
  id         : number;
  title      : string;
  author     : string;
  genre      : string;
  price      : number;
  stock      : number;
  created_at : string;
}

// I define validation rules for creating a book
// I use Zod because it gives clear error messages
// and works well with TypeScript
export const CreateBookSchema = z.object({
  title  : z.string().min(1, "Title is required"),
  author : z.string().min(1, "Author is required"),
  genre  : z.string().min(1, "Genre is required"),
  price  : z.number().positive("Price must be positive"),
  stock  : z.number().int().min(0, "Stock cannot be negative")
});

// I define validation rules for updating a book
// all fields are optional because
// the user may only want to update one field
export const UpdateBookSchema = z.object({
  title  : z.string().min(1).optional(),
  author : z.string().min(1).optional(),
  genre  : z.string().min(1).optional(),
  price  : z.number().positive().optional(),
  stock  : z.number().int().min(0).optional()
});

// I define validation rules for discount endpoint
// genre and discount are required query params
export const DiscountQuerySchema = z.object({
  genre    : z.string().min(1, "Genre is required"),
  discount : z.coerce
              .number()
              .min(0,   "Discount cannot be negative")
              .max(100, "Discount cannot exceed 100%")
});

//DiscountQuerySchema needs unit test
// test valid inputs
// test invalid inputs

// I create TypeScript types from my schemas
// so I do not repeat myself
export type CreateBookDto = z.infer<typeof CreateBookSchema>;
export type UpdateBookDto = z.infer<typeof UpdateBookSchema>;
export type DiscountQuery = z.infer<typeof DiscountQuerySchema>;