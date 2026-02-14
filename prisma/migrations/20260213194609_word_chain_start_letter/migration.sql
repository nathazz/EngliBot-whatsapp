/*
  Warnings:

  - Added the required column `start_letter` to the `word_chain` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `word_chain` ADD COLUMN `start_letter` VARCHAR(191) NOT NULL,
    MODIFY `last_word` VARCHAR(191) NULL;
