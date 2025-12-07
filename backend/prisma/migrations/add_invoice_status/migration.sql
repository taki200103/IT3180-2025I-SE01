-- AlterTable
ALTER TABLE "invoices" ADD COLUMN "status" VARCHAR(255) NOT NULL DEFAULT 'unpaid';

-- Update existing invoices based on service status
-- If service status is 'paid', set invoice status to 'paid'
UPDATE "invoices" 
SET "status" = 'paid' 
WHERE "ID_service" IN (
  SELECT "ID_khoan_thu" FROM "services" WHERE "status" = 'paid'
);

-- If service status is 'pending', set invoice status to 'pending'
UPDATE "invoices" 
SET "status" = 'pending' 
WHERE "ID_service" IN (
  SELECT "ID_khoan_thu" FROM "services" WHERE "status" = 'pending'
);
