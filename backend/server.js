const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRoutes = require('./routes/adminroute');
const supervisorRoutes = require('./routes/supervisorroute');
const workerRoutes = require('./routes/workerroute');
const app = express();
app.use(cors());
app.use(express.json());

// Replace with your real MongoDB Atlas connection string:
const uri = 'mongodb+srv://harsha:3025@cluster0.bu8ggog.mongodb.net/NGO_JPMC?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri)
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.log('Error:', err));


app.use('/api/admin', adminRoutes);
app.use('/api/supervisor', supervisorRoutes);
app.use('/api/worker', workerRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
