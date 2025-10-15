# Real Estate API - Error Handling & Response System

## Cấu trúc File

```
src/
├── exceptions/
│   ├── error-code.ts           # Định nghĩa ErrorCode enum và ErrorDetails
│   └── app.exception.ts        # AppException class
├── types/
│   └── response.type.ts        # Định nghĩa response interfaces
├── utils/
│   └── response.util.ts        # ResponseUtil helper class
├── middlewares/
│   └── error.middleware.ts     # Error handling middleware
├── controllers/
│   └── user.controller.ts      # Example controller
├── routes/
│   └── user.routes.ts          # Example routes
└── app.example.ts              # Example Express app setup
```

## Cách sử dụng

### 1. Ném lỗi trong Repository/Service

```typescript
import { AppException } from '../exceptions/app.exception';
import { ErrorCode } from '../exceptions/error-code';

// Ví dụ trong repository
async findById(id: string): Promise<User> {
  const user = await this.prisma.user.findUnique({ where: { id } });
  
  if (!user) {
    throw new AppException(ErrorCode.USER_NOT_FOUND, `User with id ${id} not found`);
  }
  
  return user;
}
```

### 2. Trả response trong Controller

```typescript
import { ResponseUtil } from '../utils/response.util';
import { asyncHandler } from '../middlewares/error.middleware';

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.findById(id);
  
  return ResponseUtil.success(res, user, 'User retrieved successfully');
});
```

### 3. Setup middleware trong Express app

```typescript
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// ... other middlewares ...

// Routes
app.use('/api/users', userRoutes);

// Error handling middleware (phải đặt cuối cùng)
app.use(errorHandler);
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "fullName": "John Doe"
  },
  "message": "User retrieved successfully",
  "timestamp": "2024-10-05T10:30:00.000Z",
  "path": "/api/users/user-123"
}
```

### Error Response
```json
{
  "success": false,
  "timestamp": "2024-10-05T10:30:00.000Z",
  "path": "/api/users/invalid-id",
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found",
    "details": null
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [
    { "id": "user-1", "email": "user1@example.com" },
    { "id": "user-2", "email": "user2@example.com" }
  ],
  "message": "Users retrieved successfully",
  "timestamp": "2024-10-05T10:30:00.000Z",
  "path": "/api/users",
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `BAD_REQUEST` | 400 | Bad request |
| `UNAUTHORIZED` | 401 | Unauthorized access |
| `FORBIDDEN` | 403 | Access forbidden |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict |
| `VALIDATION_ERROR` | 422 | Validation failed |
| `INTERNAL_SERVER_ERROR` | 500 | Internal server error |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `EMAIL_ALREADY_EXISTS` | 409 | Email already exists |
| `USER_NOT_FOUND` | 404 | User not found |

## Cài đặt Dependencies (Optional)

Nếu muốn sử dụng app.example.ts:

```bash
npm install cors helmet
npm install --save-dev @types/cors
```

## Testing

Bạn có thể test endpoints bằng cách:

1. Start server: `npm run dev`
2. Test endpoints:
   - GET `/health` - Health check
   - GET `/api/users` - Get all users
   - GET `/api/users/123` - Get user by ID
   - POST `/api/users` - Create user
   - PUT `/api/users/123` - Update user
   - DELETE `/api/users/123` - Delete user

Tất cả response đều sẽ follow format đã định nghĩa ở trên.