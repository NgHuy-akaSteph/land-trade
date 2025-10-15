import swaggerJSDoc, { type Options } from 'swagger-jsdoc';
import path from 'path';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Real Estate API Documentation',
      version: '1.0.0',
      description: 'API documentation for Real Estate management system',
    },
    servers: [
      {
        url: 'http://localhost:3005',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT Bearer token **_only_**',
        },
        refreshToken: {
          type: 'apiKey',
          in: 'header',
          name: 'refresh-token',
          description: 'Enter refresh token to generate a new access token',
        },
      },
      schemas: {
        RefreshToken: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: {
              type: 'string',
              description: 'Refresh token nhận được khi đăng nhập',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              description: 'JWT access token',
            },
            refreshToken: {
              type: 'string',
              description: 'Refresh token để lấy access token mới',
            },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                fullName: { type: 'string' },
                role: { type: 'string' },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.resolve(__dirname, '../routes/**/*.ts')],
};

export const swaggerSpec = swaggerJSDoc(options);
