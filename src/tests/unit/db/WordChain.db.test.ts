import { GameType } from "@prisma/client";
import {
  createWordChainGame,
  endWordChainGame,
  getWordChainGame,
  updateWordChainGame,
} from "../../../db/wordChain.db";
import { mockReset } from "jest-mock-extended";
import { prismaMock } from "../../__mocks__/prisma";

jest.mock("../../../config/prisma", () => ({
  get prisma() {
    return require("../../__mocks__/prisma").prismaMock;
  },
}));

const mockWordChain = {
  id: 1,
  chat_id: "chat_123",
  last_word: null,
  used_words: [],
  start_letter: "A",
  created_at: new Date(),
};

beforeEach(() => {
  mockReset(prismaMock);
});

describe("wordChain_db", () => {
  describe("getWordChainGame", () => {
    it("returns the word chain game when found", async () => {
      prismaMock.word_Chain.findUnique.mockResolvedValue(mockWordChain);

      const result = await getWordChainGame("chat_123");

      expect(prismaMock.word_Chain.findUnique).toHaveBeenCalledWith({
        where: { chat_id: "chat_123" },
      });

      expect(result).toEqual(mockWordChain);
    });

    it("returns null when no game exists", async () => {
      prismaMock.word_Chain.findUnique.mockResolvedValue(null);

      const result = await getWordChainGame("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("createWordChainGame", () => {
    it("throws an error if a game session already exists", async () => {
      const existingSession = {
        id: "session_1",
        chat_id: "chat_123",
        type: GameType.PHRASE,
        createdAt: new Date(),
      };

      const tx = {
        gameSession: {
          findUnique: jest.fn().mockResolvedValue(existingSession),
        },
      };

      (prismaMock.$transaction as jest.Mock).mockImplementation(async (fn) =>
        fn(tx),
      );

      await expect(createWordChainGame("chat_123", "B")).rejects.toThrow(
        "Another game is already running.",
      );
    });

    it("creates a word chain game with the correct start letter", async () => {
      const tx = {
        gameSession: {
          findUnique: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue({}),
        },
        word_Chain: {
          create: jest.fn().mockResolvedValue(mockWordChain),
        },
      };

      (prismaMock.$transaction as jest.Mock).mockImplementation(async (fn) =>
        fn(tx),
      );

      await createWordChainGame("chat_123", "Z");

      expect(tx.gameSession.create).toHaveBeenCalledWith({
        data: {
          chat_id: "chat_123",
          type: GameType.WORD_CHAIN,
        },
      });

      expect(tx.word_Chain.create).toHaveBeenCalledWith({
        data: {
          chat_id: "chat_123",
          last_word: null,
          used_words: [],
          start_letter: "Z",
        },
      });
    });
  });

  describe("updateWordChainGame", () => {
    it("updates last_word and used_words", async () => {
      const updated = {
        ...mockWordChain,
        last_word: "apple",
        used_words: ["apple"],
      };

      prismaMock.word_Chain.update.mockResolvedValue(updated);

      const result = await updateWordChainGame("chat_123", {
        lastWord: "apple",
        usedWords: ["apple"],
      });

      expect(prismaMock.word_Chain.update).toHaveBeenCalledWith({
        where: { chat_id: "chat_123" },
        data: {
          last_word: "apple",
          used_words: ["apple"],
        },
      });

      expect(result).toEqual(updated);
    });

    it("updates multiple used words", async () => {
      const usedWords = ["apple", "elephant", "tiger"];

      const updated = {
        ...mockWordChain,
        last_word: "tiger",
        used_words: usedWords,
      };

      prismaMock.word_Chain.update.mockResolvedValue(updated);

      const result = await updateWordChainGame("chat_123", {
        lastWord: "tiger",
        usedWords,
      });

      expect(result?.used_words).toEqual(usedWords);
    });
  });

  describe("endWordChainGame", () => {
    it("deletes both the word chain and the game session in a transaction", async () => {
      const deletedWordChain = {
        id: 1,
        chat_id: "chat_123",
        last_word: null,
        used_words: [],
        start_letter: "A",
        created_at: new Date(),
      };

      const deletedSession = {
        id: "session_1",
        chat_id: "chat_123",
        type: GameType.WORD_CHAIN,
        createdAt: new Date(),
      };

      prismaMock.word_Chain.delete.mockResolvedValue(deletedWordChain);
      prismaMock.gameSession.delete.mockResolvedValue(deletedSession);

      prismaMock.$transaction.mockResolvedValue([
        deletedWordChain,
        deletedSession,
      ]);

      await endWordChainGame("chat_123");

      expect(prismaMock.word_Chain.delete).toHaveBeenCalledWith({
        where: { chat_id: "chat_123" },
      });

      expect(prismaMock.gameSession.delete).toHaveBeenCalledWith({
        where: { chat_id: "chat_123" },
      });

      expect(prismaMock.$transaction).toHaveBeenCalled();
    });
  });
});
