import express from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler';
import router from './routes';

const app = express();

app.use(express.json());

app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.send('Hello Admin Dashboard!');
});

app.use(globalErrorHandler);

export default app;
