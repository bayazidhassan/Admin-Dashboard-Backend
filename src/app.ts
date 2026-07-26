import express from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Admin Dashboard!');
});

app.use(globalErrorHandler);

export default app;
