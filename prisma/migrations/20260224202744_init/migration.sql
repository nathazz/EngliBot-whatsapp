-- CreateTable
CREATE TABLE `Word_Chain` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `last_word` VARCHAR(191) NULL,
    `chat_id` VARCHAR(191) NOT NULL,
    `start_letter` VARCHAR(191) NOT NULL,
    `used_words` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Word_Chain_chat_id_key`(`chat_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Phrase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullPhrase` VARCHAR(191) NOT NULL,
    `tip` VARCHAR(191) NOT NULL,
    `difficulty` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `chat_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Phrase_chat_id_key`(`chat_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Answer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `phraseId` INTEGER NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `isCorrect` BOOLEAN NOT NULL DEFAULT false,

    INDEX `Answer_phraseId_fkey`(`phraseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_phraseId_fkey` FOREIGN KEY (`phraseId`) REFERENCES `Phrase`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
