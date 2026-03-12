import { prisma } from "../config/prisma";
import { BoxUpdateFn, BoxWordFn } from "../types/box.schema";

export async function storeWord(data: BoxWordFn) {
  const cleanWord = data.word.trim().toLowerCase();

  return prisma.box.upsert({
    where: { word: cleanWord },
    update: {
      definition: data.definition?.trim(),
      example: data.example?.trim(),
    },
    create: {
      word: cleanWord,
      definition: data.definition?.trim(),
      example: data.example?.trim(),
    },
  });
}

export async function getWordById(id: number) {
  return prisma.box.findUnique({
    where: { id },
    select: { id: true, word: true, example: true, definition: true },
  });
}

export async function getWordByWord(word: string) {
  return prisma.box.findUnique({
    where: { word: word.trim().toLowerCase() },
    select: { id: true, word: true, example: true, definition: true },
  });
}

export async function getAllWords() {
  return prisma.box.findMany({
    select: {
      createdAt: false,
      updatedAt: false,
      word: true,
      definition: true,
      example: true,
      id: true,
    },
  });
}

export async function deleteWordById(id: number) {
  return prisma.box.delete({ where: { id } });
}

export async function deleteWordByWord(word: string) {
  return prisma.box.delete({ where: { word: word.trim().toLowerCase() } });
}

export async function updateWordById(id: number, data: BoxUpdateFn) {
  return prisma.box.update({
    where: { id: id },
    data: {
      word: data.word,
      example: data.example,
      definition: data.definition,
    },
  });
}

export async function updateWordByWord(word: string, data: BoxUpdateFn) {
  return prisma.box.update({
    where: { word: word },
    data: {
      word: data.word,
      example: data.example,
      definition: data.definition,
    },
  });
}
