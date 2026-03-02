import express    from 'express';
import dotenv     from 'dotenv';
import './config/database';
import bookRoutes from './routes/book.routes';
import errorHandler from './utils/errorHandler';

dotenv.config();

// I create the express app here
// and register all middleware and routes
const app  = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARE ────────────────────────
// I add JSON middleware so I can read
// incoming request body as JSON
app.use(express.json());

// ── HEALTH CHECK ──────────────────────
// I add a health check route
// so anyone can verify the API is running
app.get('/', (_req, res) => {
  res.json({
    success : true,
    message : "Bookstore API is running!",
    version : "1.0.0"
  });
});

// ── ROUTES ────────────────────────────
// I register all book routes here
// all book endpoints will be
// prefixed with /api/books
app.use('/api/books', bookRoutes);

// ── ERROR HANDLER ─────────────────────
// I add error handler LAST
// so it catches errors from all routes
// order is important here!
app.use(errorHandler);

// ── START SERVER ──────────────────────
app.listen(PORT, () => {
  console.log(`I have started the server on http://localhost:${PORT}`);
});

export default app;