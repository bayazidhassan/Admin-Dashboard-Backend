import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFoundRoute from './middlewares/notFoundRoute';
import router from './routes';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.send('Hello Admin Dashboard!');
});

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(notFoundRoute);
app.use(globalErrorHandler);

export default app;
