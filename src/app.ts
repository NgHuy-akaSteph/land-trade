import express, { Request, Response, Express } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './configs/swagger.config';
import { healthRoutes, authRoutes, viewRoutes, imageRoutes } from './routes';
import { errorHandler } from './middlewares/handle-error';

const app: Express = express();
const ENDPOINT = '/api/v1';

// Basic middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use(`${ENDPOINT}`, healthRoutes);
app.use(`${ENDPOINT}/auth`, authRoutes);
app.use(`${ENDPOINT}/images`, imageRoutes);

// View Routes - không có prefix api vì đây là các trang frontend
app.use(viewRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
