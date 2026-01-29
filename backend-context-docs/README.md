# Mappr Backend - AI Context Documentation

**AI Resume & Single Entry Point for Comprehensive Backend Understanding**

Welcome! This folder contains complete architectural documentation for the Mappr Backend application. Use this README as your starting point, then navigate to specific documents based on your needs.

## 📚 Documentation Map

### 1. **[01-ARCHITECTURE.md](./01-ARCHITECTURE.md)** - System Design & Patterns
- Complete system architecture overview
- Modular structure explanation
- Design patterns used (Service, Circuit Breaker, Event-Driven, etc.)
- Data flow diagrams and sequences
- Technology stack and deployment considerations

### 2. **[modules/](./modules/)** - Individual Module Documentation
Each of the 13 modules has complete documentation:
- `modules/{module}/Details.md` - Features, how it works, database models
- `modules/{module}/API.md` - All endpoints with request/response examples
- `modules/{module}/types.ts` - Complete TypeScript type definitions

**Modules**: Crypto, Banking, Transactions, Auth, Organizations, Subscriptions, Accounts, Payments, User-Subscriptions, Usage, Integrations, External-APIs, Admin

### 3. **[04-DATABASE.md](./04-DATABASE.md)** - Database Schema & Models
- All 49+ Prisma models
- Table relationships and constraints
- Indexes and performance optimizations
- Migration guide
- Query patterns and best practices

### 4. **[05-FEATURES.md](./05-FEATURES.md)** - Available Features
- Feature breakdown by user perspective
- What users can do in the app
- Available integrations (crypto, banking, payments)
- Feature limitations by plan (FREE/PRO/ULTIMATE)
- Real-time capabilities (SSE, webhooks)

### 5. **[06-GAPS.md](./06-GAPS.md)** - Missing Features & Gap Analysis
- Comparative analysis vs. Monarch.com
- P0 Critical issues to address
- Missing features by priority
- Implementation roadmap
- Security and performance gaps

### 6. **[07-GETTING-STARTED.md](./07-GETTING-STARTED.md)** - Quick Reference
- Development setup
- Common commands
- Environment configuration
- Debugging techniques
- Testing approach

---

## 🎯 Quick Navigation

### If you need to...

**Understand the overall system**
→ Start with [01-ARCHITECTURE.md](./01-ARCHITECTURE.md)

**Find a specific API endpoint**
→ Go to `modules/{module}/API.md` (e.g., `modules/crypto/API.md`)

**Understand a specific module (e.g., crypto, banking)**
→ Go to `modules/{module}/Details.md` for features and workflows
→ Go to `modules/{module}/API.md` for endpoints
→ Go to `modules/{module}/types.ts` for TypeScript types

**Get TypeScript types for a module**
→ Go to `modules/{module}/types.ts`

**Check database structure**
→ Go to [04-DATABASE.md](./04-DATABASE.md)

**See what features exist**
→ Go to [05-FEATURES.md](./05-FEATURES.md)

**Find what needs to be built**
→ Go to [06-GAPS.md](./06-GAPS.md)

**Set up development environment**
→ Go to [07-GETTING-STARTED.md](./07-GETTING-STARTED.md)

---

## 📂 Module Documentation Structure

Each module (`modules/{module}/`) contains 3 complementary files:

### 1. **Details.md** - Features & Workflows
- Overview of module features
- How it works with flow diagrams
- Architecture components (controllers, services, jobs)
- Key methods and what they do
- Database models
- Performance optimizations
- Error handling
- Common use cases
- Plan limits

### 2. **API.md** - API Endpoints & Integration
- Complete endpoint list with HTTP methods
- Detailed request/response examples with JSON
- Query parameters and filters
- Status codes (201, 400, 403, 404, 503, etc.)
- Error codes specific to module
- Rate limiting rules
- Authentication requirements
- Real-time updates (SSE, webhooks)

### 3. **types.ts** - TypeScript Definitions
- All enums and constants
- Request/Response DTOs
- Main interface types
- Service response wrappers
- Database record types
- Error classes
- Comprehensive type coverage

**Example**: To understand crypto wallets:
1. Read `modules/crypto/Details.md` to understand features
2. Check `modules/crypto/API.md` to see wallet endpoints
3. Reference `modules/crypto/types.ts` for `CryptoWallet` interface

---

## 📊 System Overview at a Glance

### Architecture
- **Backend**: Node.js + Express.js + TypeScript (strict mode)
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Queue**: Redis with BullMQ for background jobs
- **Authentication**: Better Auth + JWT tokens
- **Real-time**: Server-Sent Events (SSE)
- **Documentation**: Swagger/OpenAPI 3.0

### Modules (13 total) - New Structure!
Each module now has 3 documentation files in `modules/{module}/`:

1. **Crypto** - Cryptocurrency portfolio (15+ networks)
   - 48+ endpoints | 7+ services | 15 networks

2. **Banking** - Bank account sync & reconciliation
   - 12+ endpoints | 16+ services | 3 providers (Plaid, Teller, MX)

3. **Transactions** - Financial transaction management
   - 30+ endpoints | 17+ services | ML categorization

4. **Auth** - User authentication & authorization
   - 10+ endpoints | 2FA, JWT, Better Auth

5. **Organizations** - Multi-tenancy workspace management
   - 15+ endpoints | Team collaboration

6. **Subscriptions** - Plan & billing management
   - 11+ endpoints | FREE/PRO/ULTIMATE tiers

7. **Accounts** - Financial account grouping
   - 10+ endpoints | Group management

8. **Payments** - Payment processing
   - 7+ endpoints | Stripe integration

9. **User Subscriptions** - SaaS subscription detection
   - 5+ endpoints | Feature entitlements

10. **Usage** - Feature usage tracking
    - 4+ endpoints | Quota management

11. **Integrations** - Generic integration framework
    - 10+ endpoints | Webhook management

12. **External APIs** - Third-party service integrations
    - 6+ endpoints | Zerion, Zapper, Plaid, etc.

13. **Admin** - Administrative functions
    - 12+ endpoints | User & system management

### Data
- **49 Database Models** covering all aspects
- **130+ API Endpoints** across 13 modules
- **3 External Integrations** (Zerion, Zapper, Plaid)
- **5 Background Job Queues** for async processing

### Features
- Multi-wallet cryptocurrency tracking
- Real-time portfolio synchronization
- Bank account integration & reconciliation
- Transaction categorization with ML
- Recurring transaction detection
- Budget alerts and tracking
- Multi-tenancy with organization support
- Plan-based access control
- Comprehensive audit logging

---

## ⚡ Key Statistics

| Metric | Count |
|--------|-------|
| TypeScript Files | 184 |
| Controllers | 32 |
| Services | 54+ |
| Database Models | 49 |
| API Endpoints | 130+ |
| External Integrations | 3 |
| Background Job Queues | 5 |
| Supported Networks | 15+ |
| Test Coverage | 0% (TODO: P0) |

---

## 🚀 Critical Issues (P0)

Before any new feature development, these MUST be addressed:

1. **⚠️ Zero Test Coverage** - 0% → 70%+ coverage needed
2. **🔒 Secrets in Plaintext** - Needs encryption service
3. **🚨 Budget Alerts Broken** - Processor missing
4. **📈 Database Performance** - Missing indexes
5. **📊 No APM/Monitoring** - Need Datadog/New Relic

See [06-GAPS.md](./06-GAPS.md) for complete details and implementation roadmap.

---

## 💡 Usage Examples

### Checking Feature Availability
See [05-FEATURES.md](./05-FEATURES.md) for what users can do and plan-based limits.

### Understanding Crypto Sync Flow
See `modules/crypto/Details.md` → "How It Works" section with sync flow diagrams.

### Finding Bank Account Integration
See `modules/banking/API.md` for 12+ endpoints or `modules/banking/Details.md` for workflows.

### Getting API Endpoints for a Feature
See the specific module's `API.md` file (e.g., `modules/transactions/API.md` for transaction endpoints).

### Understanding Recurring Transaction Detection
See `modules/transactions/Details.md` → "Recurring Detection Flow" section.

### Comparing Features vs Monarch
See [06-GAPS.md](./06-GAPS.md) → Comparative Analysis.

---

## 📖 Document Details

### File Structure
**Root Files** (~100 KB):
- 01-ARCHITECTURE.md - System design and patterns
- 04-DATABASE.md - Database schema reference
- 05-FEATURES.md - Feature overview
- 06-GAPS.md - Missing features and roadmap
- 07-GETTING-STARTED.md - Development setup

**Module Documentation** (~350 KB, 39 files):
- 13 modules × 3 files each (Details.md, API.md, types.ts)
- Each module 20-40 KB depending on complexity
- Crypto: largest (48+ endpoints, 15+ networks)
- Auth, Admin: medium (10-15 endpoints each)
- Accounts, Usage: smaller (3-10 endpoints each)

**Total Documentation: ~450 KB**

### Documentation Quality
All documents follow a consistent structure:
- Clear section headings with emojis
- Real code examples where relevant
- Complete JSON schemas for API data
- Full TypeScript type definitions
- Practical workflow diagrams
- Error codes and status codes
- Cross-document references
- Performance optimization notes

---

## 🔗 External References

- **Project Root**: `/mappr-backend-new/`
- **Source Code**: `/src/`
- **Configuration**: `/src/config/`
- **Database**: `/prisma/schema.prisma`
- **Original Docs**: `/CLAUDE.md`, `/GAP-ANALYSIS.md`

---

## 🎓 How to Use This Documentation

### For New Team Members
1. Start with [01-ARCHITECTURE.md](./01-ARCHITECTURE.md) for system overview
2. Pick a module and read its `Details.md` to understand how it works
3. Check [07-GETTING-STARTED.md](./07-GETTING-STARTED.md) for development setup

### For Feature Development
1. Check [05-FEATURES.md](./05-FEATURES.md) for existing features
2. Check [06-GAPS.md](./06-GAPS.md) for what needs building
3. Find related modules and read their `Details.md` and `API.md`
4. Use [04-DATABASE.md](./04-DATABASE.md) to plan data model changes
5. Reference module `types.ts` for data structures

### For Bug Fixes
1. Find the affected endpoint in module's `API.md` file
2. Read module's `Details.md` to understand the workflow
3. Review database schema in [04-DATABASE.md](./04-DATABASE.md)
4. Check module's `types.ts` for data types
5. Use [07-GETTING-STARTED.md](./07-GETTING-STARTED.md) for debugging tips

### For API Integration
1. Go to the specific module's `API.md` file
2. Find the endpoint with its request/response schema
3. Check module's `types.ts` for TypeScript types
4. Review error codes in the module's documentation

### For Architecture Review
1. Read [01-ARCHITECTURE.md](./01-ARCHITECTURE.md)
2. Review design patterns used
3. Check [06-GAPS.md](./06-GAPS.md) for technical debt

---

## ✨ Key Highlights

### Strengths ✅
- **Comprehensive crypto support** - 15+ networks, DeFi, NFTs
- **Professional architecture** - Modular, scalable, maintainable
- **Advanced job system** - Real-time progress, circuit breakers, retry logic
- **Multi-tenancy ready** - Organization-based data isolation
- **Production-ready foundation** - ~60% feature complete

### Weaknesses ⚠️
- **No tests** - Critical P0 issue
- **Security gaps** - Secrets in plaintext, no audit logging
- **Performance gaps** - Missing indexes, no APM
- **Feature gaps** - Missing ~40% of Monarch features

---

## 📝 Notes

- All code examples use TypeScript strict mode
- API examples use current v1 endpoints
- Database models are normalized and indexed
- All timestamps use ISO 8601 format
- All monetary values use decimal precision (not floats)

---

## 🔄 Version History

- **v1.0** - Initial comprehensive documentation
- **Created**: 2025-01-18
- **Scope**: Complete architectural overview for AI resume

---

## 📧 Questions or Updates?

This documentation was generated from the actual codebase. If you find discrepancies or need clarifications:

1. Check the source files in `/src/`
2. Reference `/CLAUDE.md` for original project instructions
3. Check `/GAP-ANALYSIS.md` for detailed implementation plans

---

**Happy exploring! 🚀**
