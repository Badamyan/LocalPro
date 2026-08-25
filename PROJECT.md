# LocalPro Project Specification

## 1. Project Overview

LocalPro is a local service marketplace that helps users discover trustworthy providers for everyday services such as cleaning, plumbing, repairs, tutoring, home maintenance, and similar categories. The platform should make it easy to browse local providers, compare service offerings, read reviews, and request bookings.

This project is intended to be a realistic portfolio-grade application that demonstrates full-stack engineering, data modeling, user flows, role-based access control, and a production-style project structure without introducing unnecessary infrastructure.

## 2. Recommended Technology Stack

The project should use a simple but modern stack that is maintainable by one student while still feeling production-ready.

### Core stack
- Frontend: Next.js with TypeScript
- UI styling: Tailwind CSS
- Backend: Next.js API routes
- Database: PostgreSQL
- ORM: Prisma
- Authentication: NextAuth.js (Credentials + JWT/session strategy)
- Validation: Zod
- Forms: React Hook Form
- Testing: Jest + React Testing Library (basic API and component tests)
- Documentation: README with setup and environment instructions

### Why this stack
- One codebase for app + REST API reduces setup and maintenance complexity.
- Next.js is fast to build, familiar in portfolios, and handles SSR/CSR cleanly.
- PostgreSQL is reliable and well-suited for relational data.
- Prisma keeps the database layer easy to reason about and maintain.
- Auth.js simplifies secure login and role-based authorization.
- Tailwind keeps the UI modern and easy to implement quickly.

### Out of scope for this project
- Microservices
- Docker/Kubernetes
- Serverless abstraction for the core app
- High-scale distributed infrastructure
- Separate frontend and backend repositories

## 3. Project Architecture

### High-level architecture
The project should be a single full-stack application with a clean separation between:
- Public customer-facing pages
- Provider-specific workflows
- Admin management screens
- API endpoints for all state-changing actions
- Shared service and validation layers

### Recommended folder structure

```text
app/
  (public)/
    page.tsx
    search/
    providers/[id]/page.tsx
    services/[id]/page.tsx
  (auth)/
    login/page.tsx
    register/page.tsx
  (dashboard)/
    user/
    provider/
    admin/
  api/
    auth/[...nextauth]/route.ts
    users/route.ts
    providers/route.ts
    services/route.ts
    bookings/route.ts
    reviews/route.ts
    favorites/route.ts
    notifications/route.ts
  globals.css
components/
  common/
  layout/
  forms/
  cards/
  filters/
lib/
  auth/
  utils/
  validations/
  constants/
prisma/
  schema.prisma
  seed.ts
services/
  user-service.ts
  provider-service.ts
  booking-service.ts
  review-service.ts
middleware.ts
README.md
PROJECT.md
```

### Architecture principles
- Keep business logic in service modules rather than pushing everything into route handlers.
- Use a shared validation layer for request bodies and query params.
- Centralize auth/role checks in reusable guards.
- Keep UI and API concerns separate, but within one Next.js app for simplicity.
- Prefer readability and maintainability over clever abstractions.

## 4. Database Entities and Relationships

The database should be relational and normalized enough to support real service marketplace behavior.

### Core entities

#### User
Represents any registered person.
Fields:
- id
- name
- email
- passwordHash
- phone
- role (customer | provider | admin)
- avatarUrl
- isActive
- createdAt
- updatedAt

Relationships:
- One-to-one with ProviderProfile (for provider users)
- One-to-many with Booking (as customer)
- One-to-many with Review (as reviewer)
- One-to-many with Favorite
- One-to-many with Notification

#### ProviderProfile
Represents a user with provider capabilities.
Fields:
- id
- userId
- businessName
- tagline
- bio
- location
- city
- state
- country
- latitude
- longitude
- hourlyRate
- responseTimeHours
- isVerified
- createdAt
- updatedAt

Relationships:
- One-to-one with User
- One-to-many with ServiceListing
- One-to-many with Review (provider reviews)

#### ServiceCategory
Defines a service type such as Cleaning, Plumbing, Repair, Tutoring, etc.
Fields:
- id
- name
- slug
- description
- icon
- parentCategoryId (optional for nested categories)

Relationships:
- One-to-many with ServiceListing

#### ServiceListing
Represents a specific offering by a provider.
Fields:
- id
- providerProfileId
- categoryId
- title
- description
- price
- priceType (hourly | fixed | custom)
- durationMinutes
- locationType (on-site | remote | both)
- status (draft | published | paused | archived)
- createdAt
- updatedAt

Relationships:
- Many-to-one with ProviderProfile
- Many-to-one with ServiceCategory
- One-to-many with Booking
- One-to-many with Favorite
- One-to-many with Review

#### Booking
Represents a user request or booking for a service.
Fields:
- id
- customerId
- providerProfileId
- serviceListingId
- status (pending | accepted | rejected | completed | cancelled)
- scheduledDate
- durationMinutes
- notes
- totalPrice
- createdAt
- updatedAt

Relationships:
- Many-to-one with User (customer)
- Many-to-one with ProviderProfile
- Many-to-one with ServiceListing

#### Review
Represents ratings and comments.
Fields:
- id
- customerId
- providerProfileId
- serviceListingId
- rating
- comment
- createdAt

Relationships:
- Many-to-one with User
- Many-to-one with ProviderProfile
- Many-to-one with ServiceListing

#### Favorite
Tracks services or providers saved by users.
Fields:
- id
- userId
- serviceListingId or providerProfileId
- createdAt

Relationships:
- Many-to-one with User
- Many-to-one with ServiceListing or ProviderProfile

#### Notification
Tracks user-facing updates.
Fields:
- id
- userId
- type
- message
- isRead
- relatedEntityType
- relatedEntityId
- createdAt

Relationships:
- Many-to-one with User

### Relationship summary
- User -> ProviderProfile: 1:1
- ProviderProfile -> ServiceListing: 1:N
- ServiceCategory -> ServiceListing: 1:N
- User -> Booking: 1:N
- ServiceListing -> Booking: 1:N
- User -> Review: 1:N
- ProviderProfile -> Review: 1:N
- User -> Favorite: 1:N
- ServiceListing -> Favorite: 1:N
- User -> Notification: 1:N

## 5. Frontend Structure

The frontend should be organized around user roles and browsing flows.

### Public pages
- Home page with hero, search, categories, featured providers
- Search results page with filters
- Provider profile page
- Service detail page
- About / contact / help page

### Auth pages
- Register
- Login
- Forgot password / reset password (later phase)

### User dashboard
- Overview
- Bookings
- Favorites
- Reviews
- Profile settings

### Provider dashboard
- Overview
- Active listings
- Booking requests
- Calendar or availability
- Profile setup
- Earnings summary (later Phase 3 or Phase 4)

### Admin dashboard
- User management
- Category management
- Provider verification queue
- Reports and moderation tools
- Review moderation

### Reusable UI modules
- Navbar
- Search bar
- Category chips
- Filter sidebar
- Provider cards
- Service cards
- Booking form
- Review form
- Notification center
- User avatar/profile control

## 6. Backend Structure

The backend will primarily live in Next.js route handlers and server-side service modules.

### Route layer responsibilities
- Parse request params, body, and query data
- Validate incoming data using Zod
- Call service methods
- Return consistent JSON responses
- Handle error states and forbidden access

### Service layer responsibilities
- Business logic
- Data access through Prisma
- Role checks and authorization rules
- Efficient query composition
- Reusable domain logic for multiple endpoints

### Example backend modules
- auth service
- user service
- provider service
- service listing service
- booking service
- review service
- favorites service
- notification service
- admin service

### Shared validation and utility layers
- Input validation schemas
- API response formatter
- Error handling utilities
- Pagination helpers
- Date and slug utilities

## 7. API Structure

The API should be REST-based and resource-oriented.

### Auth endpoints
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/session

### User endpoints
- GET /api/users/me
- PATCH /api/users/me
- GET /api/users/:id

### Provider endpoints
- GET /api/providers
- GET /api/providers/:id
- POST /api/providers
- PATCH /api/providers/:id

### Service endpoints
- GET /api/services
- GET /api/services/:id
- POST /api/services
- PATCH /api/services/:id
- DELETE /api/services/:id

### Booking endpoints
- GET /api/bookings
- GET /api/bookings/:id
- POST /api/bookings
- PATCH /api/bookings/:id
- DELETE /api/bookings/:id

### Review endpoints
- GET /api/reviews
- POST /api/reviews
- PATCH /api/reviews/:id
- DELETE /api/reviews/:id

### Favorites endpoints
- GET /api/favorites
- POST /api/favorites
- DELETE /api/favorites/:id

### Notifications endpoints
- GET /api/notifications
- PATCH /api/notifications/:id/read

### Admin endpoints
- GET /api/admin/users
- GET /api/admin/providers
- GET /api/admin/reports
- PATCH /api/admin/providers/:id/verify

### API conventions
- Use JSON responses with consistent structure:
  - success: true/false
  - message
  - data
  - error
- Use pagination for list endpoints.
- Use HTTP status codes correctly: 200, 201, 204, 400, 401, 403, 404, 409, 422, 500.
- Validate all input server-side.

## 8. Authentication and Authorization

### Authentication approach
Use NextAuth.js with a credentials-based strategy for simplicity and portability.

Recommended flow:
- Register new account
- Hash password with bcrypt
- Store user in database
- Sign session using JWT or database session strategy
- Protect routes and API endpoints using middleware or server-side checks

### Authorization model
Roles:
- Customer
- Provider
- Admin

The app should enforce rules such as:
- Customers can browse, book, review, and favorite
- Providers can manage their own listings and bookings
- Admins can manage users, providers, categories, and moderation
- Users cannot access or mutate another user’s data

### Security requirements
- Password hashing
- Session-based route protection
- Role-based access control
- Validation on all client and server boundaries
- Avoid exposing sensitive data in frontend code

## 9. User Experience and UI Requirements

The application should feel modern and polished even in the MVP stage.

### Core UI expectations
- Clean, responsive layout
- strong typography and spacing
- clear hover and focus states
- filterable search experience
- card-based browsing for providers and services
- clear booking form states and validation
- dashboard interfaces with summary cards and tables

### Responsive behavior
- Mobile-first layout
- Desktop-friendly search and dashboard panels
- Touch-friendly buttons and forms
- Search and filtering should work gracefully on smaller screens

## 10. MVP Features vs Later Features

### MVP (must implement first)
These are the features that define the core product and should be built in the first development phase.

1. User registration and login
2. User profile management
3. Provider profile creation and update
4. Categories of services
5. Search for services/providers
6. Filtering by category and useful criteria
7. Provider/service detail pages
8. Booking/request system
9. User dashboard
10. Provider dashboard
11. API layer
12. Database and ORM setup
13. Authentication and authorization
14. Validation/error handling
15. Basic tests
16. README setup instructions

### Post-MVP / later phases
These are valuable enhancements but not required to deliver the core marketplace experience.

1. Admin dashboard with moderation and analytics
2. Advanced review tooling and moderation
3. Favorites and saved list management
4. Notifications and in-app messaging
5. Payment integration
6. Real-time chat between user and provider
7. Map-based search and location radius filters
8. Availability calendar and scheduling automation
9. Multi-image galleries for providers and services
10. Email notifications and forgot-password flow
11. Reporting, admin exports, and analytics dashboards
12. Multi-language support and localization

## 11. Implementation Phases

### Phase 1 – Foundation and setup
- Initialize the project structure
- Choose the stack and confirm configuration
- Configure TypeScript, Tailwind, Prisma, and auth
- Build the PostgreSQL schema and initial migrations
- Create the base app layout and design system
- Set up environment variables and project documentation

### Phase 2 – Auth and user profiles
- Register/login flow
- Role creation for customer/provider/admin
- User profile editing
- Provider profile creation
- Access rules and route protection

### Phase 3 – Marketplace core
- Categories
- Service listing creation and management
- Search, filtering, and listing pages
- Provider/service detail pages
- Responsive card-based UI

### Phase 4 – Booking and dashboards
- Booking request creation and status updates
- User dashboard with bookings and favorites
- Provider dashboard with bookings and listings
- Basic notification flows

### Phase 5 – Reviews and polish
- Review creation and display
- Rating averages and trust metrics
- UI refinement and mobile responsiveness
- Error handling improvements
- Basic test coverage

### Phase 6 – Production polish and documentation
- README improvements
- Environment configuration guide
- Deployment prep
- Final QA
- Documentation of assumptions and project roadmap

## 12. Development Approach for One Student

This project should stay intentionally simple enough for a single developer to manage.

### Good decisions for maintainability
- Prefer one repository and one app instead of a monorepo.
- Keep routing and feature domains straightforward.
- Use Prisma for schema clarity and query management.
- Put API business logic behind service modules.
- Do not over-engineer state management; use local state and server data patterns first.
- Keep dashboard pages focused and practical rather than overly abstract.

### Anti-patterns to avoid
- Overbuilding with multiple services and infrastructure layers
- Creating a custom auth system from scratch when NextAuth is sufficient
- Starting with advanced analytics or chat before base booking flows work
- Adding complex state libraries before data needs them
- Building too many optional features before the core marketplace is stable

## 13. Testing Strategy

Testing should be introduced early but kept lightweight.

### Basic test coverage for MVP
- Auth registration validation
- Login success/failure flows
- Service creation and validation
- Booking request creation flow
- User/provider access restrictions
- Basic dashboard rendering checks
- API route response contracts

### Recommended tools
- Jest
- React Testing Library
- Prisma test setup or a temporary SQLite test database for isolated checks

## 14. Suggested Success Criteria

The project should be considered successful when the following are true:
- A user can register and log in
- A provider can create a profile and service listings
- A customer can search and filter providers/services
- A user can request a booking
- A provider can review and manage bookings
- The app uses a relational database and REST API
- Access is protected by authentication and role checks
- The project includes setup documentation and basic tests
- The UI is responsive and polished enough for portfolio presentation

## 15. Final Recommendation

This project should be implemented as a single full-stack Next.js application using PostgreSQL, Prisma, and NextAuth. It is the best balance of simplicity, professionalism, and maintainability for one student while still supporting a real marketplace workflow.

The architecture is intentionally lean and avoids unnecessary infrastructure, but it still looks and behaves like a production-quality portfolio project with proper domain modeling, authentication, API patterns, dashboard flows, and a realistic release sequence.

## 16. Approved Development Plan

### MVP release
The MVP should deliver:
- Auth and role-based access
- User and provider profiles
- Category and service listing management
- Search and filters
- Provider/service detail views
- Booking request workflow
- User/provider dashboards
- API, validation, and database foundation
- Basic tests and README

### Phase after MVP
- Admin dashboard
- Reviews and ratings
- Favorites
- Notifications
- Final polish and deployment preparation

This plan keeps the project realistic, manageable, and portfolio-worthy without over-engineering beyond what a single developer can maintain.
