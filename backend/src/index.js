require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = async () => {
  const connect = require('./config/db');
  await connect();
};

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();


app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/projects', require('./routes/project.routes'));
app.use('/api/admin', require('./routes/admin.routes'));




app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
