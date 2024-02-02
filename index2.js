const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());

// Mock database
const users = [];
const notes = [];

// Secret key for JWT
const secretKey = 'your_secret_key';

// Middleware for authentication
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = user;
    next();
  });
};

// Middleware for authorization
const authorizeUser = (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

// Register a new user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, username, password: hashedPassword };

  users.push(user);
  res.json({ message: 'User registered successfully' });
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, secretKey);
  res.json({ token });
});

// Get user profile
app.get('/profile', authenticateUser, (req, res) => {
  res.json({ username: req.user.username });
});

// Forgot password
app.post('/forgot-password', (req, res) => {
  // Implement forgot password logic (send email, reset link, etc.)
  res.json({ message: 'Password reset instructions sent successfully' });
});

// Change password
app.put('/change-password/:userId', authenticateUser, authorizeUser, async (req, res) => {
  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = users.find(u => u.id === req.params.userId);
  user.password = hashedPassword;

  res.json({ message: 'Password changed successfully' });
});

// CRUD operations for notes
app.get('/notes', authenticateUser, (req, res) => {
  const userNotes = notes.filter(note => note.userId === req.user.id);
  res.json(userNotes);
});

app.post('/notes', authenticateUser, (req, res) => {
  const { title, content } = req.body;
  const note = { id: notes.length + 1, title, content, userId: req.user.id };
  notes.push(note);
  res.json(note);
});

