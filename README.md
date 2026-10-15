# LocalPro — Local Services Marketplace

LocalPro is a full-stack marketplace web application that connects customers with local service providers. Customers can discover services, compare listings, save favorites, book services, and manage their bookings. Providers can manage their profiles and service listings, respond to booking requests, and track service progress.

This project is being developed as a portfolio project to demonstrate practical full-stack web development skills.

## Features

### Authentication and User Roles
- User registration and login
- Password hashing
- Role-based access for customers and providers
- Protected dashboards and API routes

### Service Marketplace
- Browse published service listings
- Search services by keyword
- Filter by category, price type, location type, and minimum rating
- Sort by newest, price, and rating
- View service details and provider profiles

### Customer Features
- Save and remove favorite services
- Create and cancel bookings
- Track booking statuses
- Receive notifications
- Submit reviews for completed bookings

### Provider Features
- Manage provider profile information
- Create and manage service listings
- Receive booking requests
- Accept or reject pending requests
- Update booking statuses
- Receive notifications about booking activity

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js (Auth.js v5)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **Forms:** React Hook Form
- **Password Hashing:** bcryptjs

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Badamyan/LocalPro.git
cd LocalPro
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your local PostgreSQL connection string and a strong authentication secret.

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/localpro"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-strong-secret"
NEXT_PUBLIC_APP_NAME="LocalPro"
```

Create a PostgreSQL database named `localpro` before continuing. Replace the example database credentials with your own.

**Never commit your `.env` file or publish real secrets.**

### 4. Set up the database

Apply the existing Prisma migrations:

```bash
npx prisma migrate dev
```

Generate the Prisma Client if needed:

```bash
npx prisma generate
```

### 5. Add demo data

```bash
npx prisma db seed
```

The seed script creates demo marketplace data for local development.

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Run the production build |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma migrate dev` | Apply development database migrations |
| `npx prisma db seed` | Populate the database with seed data |

## Project Structure

```text
app/
  api/          API routes
  categories/    Service categories
  dashboard/    Customer and provider dashboard
  login/        Login page
  provider/     Provider profile and service management
  providers/    Public provider profiles
  register/     Registration page
  services/     Service listings and details

components/      Reusable UI components
lib/             Shared utilities and configuration
prisma/          Database schema, migrations, and seed script
services/        Business logic and database operations
```

## Database Models

The Prisma schema includes the main marketplace entities:

- `User`
- `ProviderProfile`
- `ServiceCategory`
- `ServiceListing`
- `Booking`
- `Review`
- `Favorite`
- `Notification`

## Project Status

The core marketplace functionality is implemented, including authentication, service discovery, provider management, bookings, favorites, reviews, and notifications.

The project continues to evolve as part of a full-stack development portfolio.

## Author

**Elen Badamyan**

GitHub: [Badamyan](https://github.com/Badamyan)
