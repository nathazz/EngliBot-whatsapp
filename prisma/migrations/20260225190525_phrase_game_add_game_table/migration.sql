/*
  Warnings:

  - The primary key for the `Answer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Phrase` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `chat_id` on the `Phrase` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Phrase` table. All the data in the column will be lost.
  - Added the required column `gameId` to the `Phrase` table without a default value. This is not possible if the table is not empty.
  - Made the column `difficulty` on table `Phrase` required. This step will fail if there are existing NULL values in that column.
  - Made the column `category` on table `Phrase` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Answer` DROP FOREIGN KEY `Answer_phraseId_fkey`;

-- DropIndex
DROP INDEX `Answer_phraseId_fkey` ON `Answer`;

-- DropIndex
DROP INDEX `Phrase_chat_id_key` ON `Phrase`;

-- AlterTable
ALTER TABLE `Answer` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `phraseId` VARCHAR(191) NOT NULL,
    ALTER COLUMN `isCorrect` DROP DEFAULT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Phrase` DROP PRIMARY KEY,
    DROP COLUMN `chat_id`,
    DROP COLUMN `createdAt`,
    ADD COLUMN `gameId` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `difficulty` VARCHAR(191) NOT NULL,
    MODIFY `category` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `Game` (
    `id` VARCHAR(191) NOT NULL,
    `chat_id` VARCHAR(191) NOT NULL,
    `currentRound` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Game_chat_id_key`(`chat_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Phrase` ADD CONSTRAINT `Phrase_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_phraseId_fkey` FOREIGN KEY (`phraseId`) REFERENCES `Phrase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
