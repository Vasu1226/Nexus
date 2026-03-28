const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// WebSockets Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Attach io to the app so routes can use it
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// WebSocket event handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/pdf', require('./routes/pdf'));

// Basic health check route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'Server is running normally' });
});

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
