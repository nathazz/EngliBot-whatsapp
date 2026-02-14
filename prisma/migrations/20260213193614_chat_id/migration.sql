/*
  Warnings:

  - A unique constraint covering the columns `[chat_id]` on the table `word_chain` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chat_id` to the `word_chain` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `word_chain` ADD COLUMN `chat_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `word_chain_chat_id_key` ON `word_chain`(`chat_id`);
