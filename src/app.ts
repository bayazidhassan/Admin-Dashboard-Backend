import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFoundRoute from './middlewares/notFoundRoute';
import router from './routes';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://your-frontend-domain.vercel.app',
    ],
    credentials: true,
  }),
);

app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.send('Hello Admin Dashboard!');
});

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(notFoundRoute);
app.use(globalErrorHandler);

export default app;
