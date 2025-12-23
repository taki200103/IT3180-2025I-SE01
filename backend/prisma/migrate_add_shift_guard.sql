-- Migration: Add ID_guard column to shifts table
-- This migration adds the ID_guard column to the existing shifts table

-- First, check if the column already exists, if not, add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'shifts' 
        AND column_name = 'ID_guard'
    ) THEN
        -- Add the ID_guard column (nullable first to allow existing rows)
        ALTER TABLE shifts ADD COLUMN "ID_guard" TEXT;
        
        -- Delete existing rows that don't have guard ID (they're invalid anyway)
        DELETE FROM shifts WHERE "ID_guard" IS NULL;
        
        -- Now make it NOT NULL
        ALTER TABLE shifts ALTER COLUMN "ID_guard" SET NOT NULL;
        
        -- Add foreign key constraint to residents table
        ALTER TABLE shifts 
        ADD CONSTRAINT shifts_ID_guard_fkey 
        FOREIGN KEY ("ID_guard") 
        REFERENCES residents("ID_Resident") 
        ON DELETE RESTRICT;
    END IF;
END $$;
