-- CreateTable
CREATE TABLE `word_chain` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `last_word` VARCHAR(191) NOT NULL,
    `used_words` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Phrase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullPhrase` VARCHAR(191) NOT NULL,
    `tip` VARCHAR(191) NULL,
    `difficulty` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Answer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `phraseId` INTEGER NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `isCorrect` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_phraseId_fkey` FOREIGN KEY (`phraseId`) REFERENCES `Phrase`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
