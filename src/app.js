import express from 'express';
import userRoutes from './routes/userRoutes.js'

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Server running'
  });
});

app.use('/users', userRoutes)

export default app;