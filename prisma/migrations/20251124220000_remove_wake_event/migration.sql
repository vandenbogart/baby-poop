-- Delete any existing WAKE events
DELETE FROM "Event" WHERE type = 'WAKE';

-- AlterEnum - Remove WAKE from EventType
ALTER TYPE "EventType" RENAME TO "EventType_old";
CREATE TYPE "EventType" AS ENUM ('POOP', 'PEE', 'NAP', 'FEED', 'DIAPER');
ALTER TABLE "Event" ALTER COLUMN "type" TYPE "EventType" USING ("type"::text::"EventType");
DROP TYPE "EventType_old";
