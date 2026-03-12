import { Box } from "@prisma/client";
import {
  deleteWordById,
  deleteWordByWord,
  getAllWords,
  getWordById,
  getWordByWord,
  storeWord,
  updateWordById,
  updateWordByWord,
} from "../../../db/box.db";

import { mockReset } from "jest-mock-extended";
import { prismaMock } from "../../__mocks__/prisma";

jest.mock("../../../config/prisma", () => ({
  get prisma() {
    return require("../../__mocks__/prisma").prismaMock;
  },
}));

beforeEach(() => {
  mockReset(prismaMock);
});
const mockBox: Box = {
  id: 1,
  word: "hello",
  definition: "greeting",
  example: "Hello John",
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("box_db", () => {
  describe("storeWord", () => {
    it("trims and lowercases the word before upserting", async () => {
      prismaMock.box.upsert.mockResolvedValue(mockBox);

      await storeWord({
        word: "  Hello  ",
        definition: "A greeting",
        example: "Hello world",
      });

      expect(prismaMock.box.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { word: "hello" },
          create: expect.objectContaining({ word: "hello" }),
        }),
      );
    });

    it("trims definition and example before upserting", async () => {
      prismaMock.box.upsert.mockResolvedValue(mockBox);

      await storeWord({
        word: "hello",
        definition: "  A greeting  ",
        example: "  Hello world  ",
      });

      expect(prismaMock.box.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            definition: "A greeting",
            example: "Hello world",
          }),
        }),
      );
    });

    it("returns the upserted box record", async () => {
      prismaMock.box.upsert.mockResolvedValue(mockBox);

      const result = await storeWord({ word: "hello" });

      expect(result).toEqual(mockBox);
    });

    it("handles undefined definition and example", async () => {
      prismaMock.box.upsert.mockResolvedValue({
        ...mockBox,
        definition: null,
        example: null,
      });

      await storeWord({ word: "hello" });

      expect(prismaMock.box.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            definition: undefined,
            example: undefined,
          }),
        }),
      );
    });
  });

  describe("getWordById", () => {
    it("returns the word when found", async () => {
      prismaMock.box.findUnique.mockResolvedValue(mockBox);

      const result = await getWordById(1);

      expect(prismaMock.box.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { id: true, word: true, example: true, definition: true },
      });
      expect(result).toEqual(mockBox);
    });

    it("returns null when not found", async () => {
      prismaMock.box.findUnique.mockResolvedValue(null);

      const result = await getWordById(999);

      expect(result).toBeNull();
    });
  });

  describe("getWordByWord", () => {
    it("trims and lowercases before querying", async () => {
      prismaMock.box.findUnique.mockResolvedValue(mockBox);

      await getWordByWord("  Hello  ");

      expect(prismaMock.box.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { word: "hello" } }),
      );
    });

    it("returns the word when found", async () => {
      prismaMock.box.findUnique.mockResolvedValue(mockBox);

      const result = await getWordByWord("hello");

      expect(result).toEqual(mockBox);
    });

    it("returns null when not found", async () => {
      prismaMock.box.findUnique.mockResolvedValue(null);

      const result = await getWordByWord("unknown");

      expect(result).toBeNull();
    });
  });

  describe("getAllWords", () => {
    it("returns all words", async () => {
      const words = [mockBox, { ...mockBox, id: 2, word: "world" }];
      prismaMock.box.findMany.mockResolvedValue(words);

      const result = await getAllWords();

      expect(prismaMock.box.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          select: expect.objectContaining({ word: true, id: true }),
        }),
      );
      expect(result).toEqual(words);
    });

    it("returns an empty array when no words exist", async () => {
      prismaMock.box.findMany.mockResolvedValue([]);

      const result = await getAllWords();

      expect(result).toEqual([]);
    });
  });

  describe("deleteWordById", () => {
    it("deletes the word by id", async () => {
      prismaMock.box.delete.mockResolvedValue(mockBox);

      const result = await deleteWordById(1);

      expect(prismaMock.box.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockBox);
    });
  });

  describe("deleteWordByWord", () => {
    it("trims and lowercases before deleting", async () => {
      prismaMock.box.delete.mockResolvedValue(mockBox);

      await deleteWordByWord("  Hello  ");

      expect(prismaMock.box.delete).toHaveBeenCalledWith({
        where: { word: "hello" },
      });
    });
  });

  describe("updateWordById", () => {
    it("updates the word by id", async () => {
      const updated = { ...mockBox, definition: "Updated definition" };
      prismaMock.box.update.mockResolvedValue(updated);

      const result = await updateWordById(1, {
        word: "hello",
        definition: "Updated definition",
        example: "Hi",
      });

      expect(prismaMock.box.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          word: "hello",
          definition: "Updated definition",
          example: "Hi",
        },
      });
      expect(result).toEqual(updated);
    });
  });

  describe("updateWordByWord", () => {
    it("updates the word by word string", async () => {
      const updated = { ...mockBox, example: "New example" };
      prismaMock.box.update.mockResolvedValue(updated);

      const result = await updateWordByWord("hello", {
        word: "hello",
        example: "New example",
      });

      expect(prismaMock.box.update).toHaveBeenCalledWith({
        where: { word: "hello" },
        data: { word: "hello", example: "New example", definition: undefined },
      });
      expect(result).toEqual(updated);
    });
  });
});
