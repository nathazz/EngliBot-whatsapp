-- CreateTable
CREATE TABLE `Box` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `word` VARCHAR(191) NOT NULL,
    `definition` VARCHAR(191) NULL,
    `example` VARCHAR(191) NULL,

    INDEX `Box_word_idx`(`word`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
