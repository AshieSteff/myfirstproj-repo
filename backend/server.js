require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = require('./routes/todos');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serverless functions (Vercel) start cold, so connect lazily and reuse the
// connection between requests instead of connecting once at startup.
let connecting = null;
function connectDB() {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!connecting) {
    connecting = mongoose.connect(process.env.MONGODB_URI).catch((err) => {
      connecting = null;
      throw err;
    });
  }
  return connecting;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/todos', todoRoutes);

// Central error handler. Express 5 forwards rejected async handlers here.
app.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid id' });
  }
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

// Only listen when run directly (npm start / npm run dev).
// On Vercel the file is imported, so app is handed to the platform instead.
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
  });
}

module.exports = app;
