const dotenv = require('dotenv');
dotenv.config()
const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const cors=require("cors");
const path = require('path');
const authenticateToken = require('./middlewares/auth');
const otherRoutes = require('./routes/v1');


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({limit:'40mb'}));
app.use(bodyParser.urlencoded({ extended: true , limit:'40mb'}));
// app.use(express.urlencoded({extended:true, limit:'40mb'}));
// app.use(express.json({limit:'40mb'}));

// Serve the 'uploads' directory as a static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);

// Strict Auth
app.use(authenticateToken);

// Other Routes
app.use("/v1", otherRoutes);


// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
