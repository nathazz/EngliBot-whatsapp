/*
  Warnings:

  - A unique constraint covering the columns `[word]` on the table `Box` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Box` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Box` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Box_word_key` ON `Box`(`word`);
