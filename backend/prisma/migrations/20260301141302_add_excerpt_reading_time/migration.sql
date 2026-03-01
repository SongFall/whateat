-- AlterTable
ALTER TABLE `Article` ADD COLUMN `excerpt` TEXT NULL,
    ADD COLUMN `readingTime` INTEGER NOT NULL DEFAULT 1;
