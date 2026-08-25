# LocalPro

LocalPro is a local service marketplace for discovering and booking trusted local providers.

## Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- NextAuth.js

## Phase 1 setup

1. Install dependencies:
   npm install
2. Create your PostgreSQL database.
3. Copy `.env.example` to `.env` and update the values.
4. Generate the Prisma client:
   npx prisma generate
5. Run the initial migration:
   npx prisma migrate dev --name init
6. Start the app:
   npm run dev

## Environment variables

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_APP_NAME`

## Notes

This repository is currently in the Phase 1 foundation stage.
