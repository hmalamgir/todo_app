const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.get('/', (req, res) => res.json({ msg: 'Contact keeper app.....' }));

// Connect Database
mongoose.connect(
  'mongodb://127.0.0.1:27017/todo',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  },
  () => console.log('DB Connected....')
);

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/todos', require('./routes/todos'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
