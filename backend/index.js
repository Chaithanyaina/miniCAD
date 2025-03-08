const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const modelRoutes = require('./routes/modelRoutes');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');

app.use(helmet());
app.use(compression());
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-production-domain.com'],
  credentials: true
}));

// Error handling middleware
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use('/api/models', modelRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
