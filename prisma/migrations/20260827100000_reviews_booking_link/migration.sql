ALTER TABLE "reviews" ADD COLUMN "bookingId" TEXT;

ALTER TABLE "reviews" ADD CONSTRAINT "reviews_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "reviews_bookingId_key" ON "reviews"("bookingId");

ALTER TABLE "reviews" ALTER COLUMN "bookingId" SET NOT NULL;