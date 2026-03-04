/*
  Warnings:

  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Phrase` DROP FOREIGN KEY `Phrase_gameId_fkey`;

-- DropIndex
DROP INDEX `Phrase_gameId_fkey` ON `Phrase`;

-- DropTable
DROP TABLE `Game`;

-- CreateTable
CREATE TABLE `GameSession` (
    `id` VARCHAR(191) NOT NULL,
    `chat_id` VARCHAR(191) NOT NULL,
    `type` ENUM('WORD_CHAIN', 'PHRASE') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `GameSession_chat_id_key`(`chat_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GamePhrase` (
    `id` VARCHAR(191) NOT NULL,
    `chat_id` VARCHAR(191) NOT NULL,
    `currentRound` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `GamePhrase_chat_id_key`(`chat_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Phrase` ADD CONSTRAINT `Phrase_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `GamePhrase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
