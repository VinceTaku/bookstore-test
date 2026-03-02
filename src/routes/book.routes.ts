import { Router } from 'express';
import bookController from '../controllers/book.controller';

const router = Router();

// I define all book routes here
// I map each URL to its controller function
// I place discounted-price BEFORE /:id
// because Express reads routes top to bottom
// if /:id comes first, "discounted-price"
// would be treated as an id 

// ── BOOK ROUTES ───────────────────────
// GET    /api/books                          → getAll
// GET    /api/books/discounted-price         → getDiscountedPrice
// GET    /api/books/:id                      → getById
// POST   /api/books                          → create
// PUT    /api/books/:id                      → update
// DELETE /api/books/:id                      → delete

router.get   ('/discounted-price', bookController.getDiscountedPrice);
router.get   ('/',                 bookController.getAll);
router.get   ('/:id',              bookController.getById);
router.post  ('/',                 bookController.create);
router.put   ('/:id',              bookController.update);
router.delete('/:id',              bookController.delete);

export default router;