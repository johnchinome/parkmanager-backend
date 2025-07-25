/*
  Warnings:

  - Added the required column `registeredBy` to the `EntryExit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EntryExit" ADD COLUMN     "registeredBy" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "EntryExit" ADD CONSTRAINT "EntryExit_registeredBy_fkey" FOREIGN KEY ("registeredBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
