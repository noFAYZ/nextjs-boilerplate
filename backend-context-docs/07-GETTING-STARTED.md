# 07. Getting Started & Quick Reference

**Development setup, common commands, and debugging techniques**

> **Learning Modules**: After setup, check `modules/{module}/Details.md` to understand how different modules work and contribute to features.

## Environment Setup

### Prerequisites
```bash
# Node.js & npm
node --version  # v20.10.0+
npm --version   # v10.0.0+

# PostgreSQL
psql --version  # 12+

# Redis
redis-cli --version  # 6+

# Git
git --version
```

### Installation Steps

**1. Clone Repository**
```bash
git clone https://github.com/your-repo/mappr-backend.git
cd mappr-backend
```

**2. Install Dependencies**
```bash
npm install

# Or with npm cache clean (if issues)
npm cache clean --force
npm install
```

**3. Environment Configuration**
```bash
# Copy template
cp .env.example .env.local

# Edit with your values
nano .env.local
```

**4. Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Create/migrate database
npx prisma migrate dev --name init

# Seed with initial data
npm run db:seed

# View database in GUI
npx prisma studio
```

**5. Start Development Server**
```bash
npm run dev

# Server runs on http://localhost:3000
# Swagger docs at http://localhost:3000/docs
```

---

## Environment Variables (.env.local)

### Required Variables
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mappr"
DATABASE_DIRECT_URL="postgresql://user:password@localhost:5432/mappr"

# Redis
REDIS_URL="redis://localhost:6379"

# External APIs
ZERION_API_KEY="your_key_here"
ZAPPER_API_KEY="your_key_here"
PLAID_CLIENT_ID="your_id"
PLAID_SECRET="your_secret"

# Authentication
BETTER_AUTH_SECRET="your_secret_key_min_32_chars"
JWT_SECRET="your_jwt_secret_key"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password"

# AWS (for S3, encryption)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your_key"
AWS_SECRET_ACCESS_KEY="your_secret"
AWS_S3_BUCKET="mappr-uploads"

# Stripe/Polar
STRIPE_SECRET_KEY="sk_test_..."
POLAR_API_KEY="your_key"

# Application
NODE_ENV="development"
PORT="3000"
LOG_LEVEL="debug"
```

### Optional Variables
```bash
# Monitoring
DATADOG_API_KEY="optional"
SENTRY_DSN="optional"

# Feature flags
ENABLE_AUTH_TESTING="false"
ENABLE_ADMIN_ROUTES="true"
REDIS_PREFIX="mappr_dev"
```

---

## Common Commands

### Development
```bash
# Start dev server with hot reload
npm run dev

# Build TypeScript
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix

# Code formatting
npm run format
npm run format:check
```

### Database
```bash
# Generate Prisma client
npx prisma generate

# Create new migration
npx prisma migrate dev --name description_of_change

# Apply pending migrations to database
npx prisma migrate deploy

# Reset database (dev only!)
npx prisma migrate reset

# Seed database
npm run db:seed

# Open Prisma Studio GUI
npx prisma studio
```

### Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- crypto.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="wallet"
```

### Quality Assurance
```bash
# Run all checks (lint, type, test)
npm run validate

# Type check only
npm run typecheck

# Lint only
npm run lint

# Format only
npm run format
```

### Production
```bash
# Build for production
npm run build

# Start production server
npm start

# Start with PM2
pm2 start npm --name "mappr" -- start
```

---

## Database Operations

### Creating Migrations

**Add new model:**
```bash
# After editing prisma/schema.prisma
npx prisma migrate dev --name add_new_feature

# This will:
# 1. Detect schema changes
# 2. Generate SQL migration
# 3. Apply to database
# 4. Regenerate Prisma client
```

**Safe migration process:**
```bash
# 1. Test locally first
npm run db:seed  # Reset with test data

# 2. Generate migration
npx prisma migrate dev --name description

# 3. Review generated SQL migration
# File location: prisma/migrations/[timestamp]_description/

# 4. Test on staging
npm run migrate:prod

# 5. Document breaking changes
```

### Database Debugging

**Connect directly:**
```bash
psql $DATABASE_URL

# List tables
\dt

# Describe table
\d users

# Count records
SELECT COUNT(*) FROM users;

# View recent transactions
SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10;
```

**Using Prisma Studio:**
```bash
# Open GUI browser
npx prisma studio

# Visual database browser
# Query builder
# Record viewer & editor
# Relationship explorer
```

**Query analysis:**
```bash
# Enable query logging
export LOG_SQL=true
npm run dev

# View slow query log
SELECT * FROM pg_stat_statements
WHERE query LIKE '%transactions%'
ORDER BY total_time DESC;
```

---

## API Testing

### Using cURL
```bash
# Get portfolio
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:3000/api/v1/crypto/portfolio

# Create wallet
curl -X POST \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x...",
    "network": "ethereum",
    "name": "My Wallet"
  }' \
  http://localhost:3000/api/v1/crypto/wallets

# Sync wallet (async)
curl -X POST \
  -H "Authorization: Bearer <TOKEN>" \
  http://localhost:3000/api/v1/crypto/wallets/wallet_1/sync
```

### Using Swagger UI
```
1. Open http://localhost:3000/docs
2. Click "Authorize" button
3. Paste JWT token
4. Try out endpoints interactively
5. View request/response bodies
6. Copy curl commands
```

### Using VS Code REST Client
```
Create rest-client.http:

@token = Bearer eyJhbGc...
@baseUrl = http://localhost:3000/api/v1

### Get Portfolio
GET {{baseUrl}}/crypto/portfolio
Authorization: {{token}}

### Create Wallet
POST {{baseUrl}}/crypto/wallets
Authorization: {{token}}
Content-Type: application/json

{
  "address": "0x...",
  "network": "ethereum",
  "name": "Test Wallet"
}

### Get Wallet Details
GET {{baseUrl}}/crypto/wallets/wallet_1
Authorization: {{token}}
```

### Using Postman
```
1. Import OpenAPI spec from /docs/swagger.json
2. Set Authorization header with Bearer token
3. Create environment variables:
   - {{baseUrl}} = http://localhost:3000/api/v1
   - {{token}} = your_jwt_token
4. Create requests & organize in folders
5. Export collection for sharing
```

---

## Debugging Techniques

### VSCode Debugger

**Debug configuration (.vscode/launch.json):**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/dist/server.js",
      "preLaunchTask": "npm: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

**Using debugger:**
```bash
# Set breakpoints in VSCode (click line number)
# Press F5 to start debugging
# Step through code (F10)
# Step into functions (F11)
# Watch variables
# View call stack
```

### Logging

**Structured logging:**
```typescript
import { logger } from '@/shared/utils/logger';

// Info log
logger.info('User registered', {
  userId: user.id,
  email: user.email,
  plan: user.plan,
  timestamp: new Date().toISOString()
});

// Error log with context
logger.error('Wallet sync failed', {
  walletId: wallet.id,
  userId: wallet.userId,
  error: error.message,
  stack: error.stack,
  retryAttempt: 2
});

// Debug log (dev only)
logger.debug('Processing transaction', {
  transactionId: txn.id,
  data: txn
});
```

**View logs:**
```bash
# See real-time logs
npm run dev | grep "ERROR\|WARN"

# Filter by level
npm run dev 2>&1 | grep "ERROR"

# Save to file
npm run dev > logs/dev.log 2>&1

# View last 100 lines
tail -100 logs/dev.log
```

### Database Query Debugging

**Enable Prisma logging:**
```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  // Enable query logging
}

// env var
process.env.DEBUG = "prisma:*"
```

**Track slow queries:**
```bash
# PostgreSQL slow query log
# In postgresql.conf:
log_min_duration_statement = 1000  # Log queries > 1 second

# View logs
tail -f /var/log/postgresql/postgresql.log
```

### External API Debugging

**Check service health:**
```bash
curl http://localhost:3000/api/v1/crypto/providers/status

Response:
{
  "zerion": {
    "status": "healthy",
    "responseTime": 234,
    "lastError": null
  },
  "zapper": {
    "status": "healthy",
    "responseTime": 456,
    "lastError": null
  },
  "plaid": {
    "status": "healthy",
    "responseTime": 123,
    "lastError": null
  }
}
```

**Track API calls:**
```bash
# View external API metrics
curl http://localhost:3000/api/v1/admin/analytics

# Check circuit breaker status
curl http://localhost:3000/api/v1/admin/queue-stats

# View provider metrics
curl http://localhost:3000/api/v1/admin/metrics?provider=zerion
```

---

## Performance Profiling

### Node.js Built-in Profiler
```bash
# Run with profiler
node --prof src/server.ts

# Process profiling output
node --prof-process isolate-*.log > profile.txt

# Analyze
cat profile.txt | head -100
```

### Using Clinic.js
```bash
# Install
npm install -g clinic

# Profile with Clinic Doctor
clinic doctor -- node src/server.ts

# Profile with Clinic Flame (CPU)
clinic flame -- node src/server.ts

# Profile with Clinic Bubbleprof (async)
clinic bubbleprof -- node src/server.ts
```

### Database Query Performance
```bash
# Find slow queries
SELECT query, mean_time, stddev_time, calls
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

# Reset statistics
SELECT pg_stat_statements_reset();

# Explain query plan
EXPLAIN ANALYZE
SELECT * FROM transactions
WHERE userId = 'user_123'
ORDER BY date DESC
LIMIT 20;
```

---

## Common Workflows

### Adding a New API Endpoint

**1. Create route:**
```typescript
// src/modules/mymodule/routes/index.ts
router.post('/my-endpoint', authenticateUser, (req, res) => {
  MyService.getInstance().myMethod(req.body)
    .then(result => res.json(result))
    .catch(error => next(error));
});
```

**2. Add controller:**
```typescript
// src/modules/mymodule/controllers/myController.ts
export const myEndpoint = async (req: Request, res: Response) => {
  const service = MyService.getInstance();
  const result = await service.myMethod(req.body);
  res.json(result);
};
```

**3. Add service method:**
```typescript
// src/modules/mymodule/services/myService.ts
async myMethod(data: MyDTO) {
  // Validation
  if (!data.required) throw new ValidationError('Missing field');

  // Business logic
  const result = await prisma.myTable.create({ data });

  // Event emission
  eventEmitter.emit('my_event:created', result);

  return result;
}
```

**4. Update Swagger docs:**
```typescript
// src/config/swagger.ts
paths: {
  '/api/v1/my-endpoint': {
    post: {
      summary: 'My endpoint',
      requestBody: { /* schema */ },
      responses: { /* schemas */ }
    }
  }
}
```

**5. Add tests:**
```typescript
// src/modules/mymodule/__tests__/myController.test.ts
describe('MyController', () => {
  it('should create resource', async () => {
    const response = await request(app)
      .post('/api/v1/my-endpoint')
      .send({ required: 'value' });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
  });
});
```

### Adding Database Model

**1. Update schema:**
```prisma
model MyTable {
  id        String    @id @default(cuid())
  userId    String
  data      Json
  createdAt DateTime  @default(now())

  user      User      @relation(fields: [userId], references: [id])

  @@index([userId])
}
```

**2. Generate migration:**
```bash
npx prisma migrate dev --name add_my_table
```

**3. Update types:**
```typescript
// src/types/myTable.ts
export interface MyTable {
  id: string;
  userId: string;
  data: any;
  createdAt: Date;
}
```

**4. Use in service:**
```typescript
const result = await prisma.myTable.create({
  data: {
    userId: req.user.id,
    data: { /* ... */ }
  }
});
```

### Deploying Changes

**1. Local testing:**
```bash
npm run validate  # type, lint, test
npm run build     # compile TypeScript
npm run dev       # test locally
```

**2. Commit changes:**
```bash
git add .
git commit -m "feat: add new feature"
git push origin feature-branch
```

**3. Create PR:**
```bash
# GitHub CLI
gh pr create --title "Add new feature" --body "Description"
```

**4. Deploy to staging:**
```bash
# Merge to develop branch
git merge feature-branch develop
git push origin develop

# CI/CD pipeline triggers
# Runs tests, builds, deploys to staging
```

**5. Deploy to production:**
```bash
# Merge to main after approval
git merge develop main
git push origin main

# Production deployment
# Usually has manual approval gate
# Zero-downtime deployment
```

---

## Troubleshooting

### Common Issues

**Issue**: Database connection refused
```bash
# Solution:
1. Check PostgreSQL is running:
   pg_isready

2. Verify credentials in .env.local:
   DATABASE_URL="postgresql://user:password@localhost:5432/mappr"

3. Create database if missing:
   createdb mappr

4. Run migrations:
   npx prisma migrate dev --name init
```

**Issue**: Redis connection failed
```bash
# Solution:
1. Check Redis is running:
   redis-cli ping

2. Verify Redis URL in .env.local:
   REDIS_URL="redis://localhost:6379"

3. Restart Redis:
   redis-server

4. Check port 6379 is not blocked
```

**Issue**: Tests failing
```bash
# Solution:
1. Check test database exists:
   npm run test:setup

2. Clear Jest cache:
   npm test -- --clearCache

3. Run single test:
   npm test -- crypto.test.ts --verbose

4. Check environment:
   NODE_ENV=test npm test
```

**Issue**: Module not found error
```bash
# Solution:
1. Regenerate Prisma client:
   npx prisma generate

2. Clear node_modules:
   rm -rf node_modules
   npm install

3. Check TypeScript paths in tsconfig.json:
   "@/*": ["./src/*"]

4. Verify import paths start with @/:
   import { MyService } from '@/modules/my/services';
```

**Issue**: Crypto sync fails
```bash
# Solution:
1. Check API key in .env.local:
   ZERION_API_KEY=...

2. Check rate limits:
   curl http://localhost:3000/api/v1/crypto/providers/status

3. Check wallet address format:
   Must be valid Ethereum address (0x...)

4. Check network support:
   Wallet network must be in supported list

5. View job error:
   npm run dev  # Look for job error logs
```

---

## Useful References

### Documentation
- Prisma: https://www.prisma.io/docs/
- Express: https://expressjs.com/
- Better Auth: https://better-auth.com/
- TypeScript: https://www.typescriptlang.org/docs/
- Jest: https://jestjs.io/docs/getting-started

### APIs
- Zerion: https://docs.zerion.io/
- Zapper: https://docs.zapper.xyz/
- Plaid: https://plaid.com/docs/
- Teller: https://teller.io/docs/
- MX: https://docs.mx.com/

### Tools
- Postman: https://www.postman.com/
- TablePlus: https://tableplus.com/ (Database GUI)
- Redis Commander: https://www.npmjs.com/package/redis-commander
- ESLint: https://eslint.org/

---

## Next Steps

1. **Complete setup**: Follow Environment Setup section
2. **Start server**: `npm run dev`
3. **Test endpoints**: Use Swagger UI at http://localhost:3000/docs
4. **Read module docs**: See [02-MODULES.md](./02-MODULES.md)
5. **Understand gaps**: See [06-GAPS.md](./06-GAPS.md) for what needs building
6. **Run tests**: `npm test` (when implemented)

---

For more detailed information, see the main documentation:
- [README.md](./README.md) - Overview & navigation
- [01-ARCHITECTURE.md](./01-ARCHITECTURE.md) - System design
- [02-MODULES.md](./02-MODULES.md) - Module reference
- [03-APIS.md](./03-APIS.md) - API endpoints
- [04-DATABASE.md](./04-DATABASE.md) - Database schema
- [05-FEATURES.md](./05-FEATURES.md) - Available features
- [06-GAPS.md](./06-GAPS.md) - Missing features
