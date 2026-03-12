import { GameType } from "@prisma/client";
import {
  createPhraseGame,
  endPhraseGame,
  getPhraseGame,
  updatePhraseGame,
} from "../../../db/phrase.db";
import { PhraseInput } from "../../../types/phraseLLM.schema";

import { prismaMock } from "../../__mocks__/prisma";
import { mockReset } from "jest-mock-extended";

jest.mock("../../../config/prisma", () => ({
  get prisma() {
    return require("../../__mocks__/prisma").prismaMock;
  },
}));

beforeEach(() => {
  mockReset(prismaMock);
});
const mockPhrases: PhraseInput[] = [
  {
    fullPhrase: "Break the ice",
    tip: "start a conversation",
    difficulty: "b1",
    category: "phrasal",
    answers: [
      { text: "start conversation", isCorrect: true },
      { text: "destroy ice", isCorrect: false },
    ],
  },
];

const mockGamePhrase = {
  id: "csaasas75b217-44cf-4882-bebe-14e665dbb131",
  chat_id: "chat_123",
  currentRound: 0,
  phrases: [
    {
      id: "cb75b217-44cf-4882-bebe-14e665dbb131",
      fullPhrase: "Break the ice",
      tip: "start a conversation",
      difficulty: "b1",
      category: "phrasal",
      answers: [
        { id: 1, text: "start conversation", isCorrect: true },
        { id: 2, text: "destroy ice", isCorrect: false },
      ],
    },
  ],
  createdAt: new Date(),
};

describe("phrase_db", () => {
  describe("getPhraseGame", () => {
    it("returns the phrase game with phrases and answers when found", async () => {
      prismaMock.gamePhrase.findUnique.mockResolvedValue(mockGamePhrase);

      const result = await getPhraseGame("chat_123");

      expect(prismaMock.gamePhrase.findUnique).toHaveBeenCalledWith({
        where: { chat_id: "chat_123" },
        include: {
          phrases: {
            include: { answers: true },
          },
        },
      });

      expect(result).toEqual(mockGamePhrase);
    });

    it("returns null when no phrase game exists", async () => {
      prismaMock.gamePhrase.findUnique.mockResolvedValue(null);

      const result = await getPhraseGame("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("createPhraseGame", () => {
    it("creates a game session and phrase game inside a transaction", async () => {
      const tx = {
        gameSession: {
          findUnique: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue({}),
        },
        gamePhrase: {
          create: jest.fn().mockResolvedValue(mockGamePhrase),
        },
      };

      (prismaMock.$transaction as jest.Mock).mockImplementation(async (fn) =>
        fn(tx),
      );

      const result = await createPhraseGame("chat_123", mockPhrases);

      expect(tx.gameSession.findUnique).toHaveBeenCalledWith({
        where: { chat_id: "chat_123" },
      });

      expect(tx.gameSession.create).toHaveBeenCalledWith({
        data: {
          chat_id: "chat_123",
          type: "PHRASE",
        },
      });

      expect(tx.gamePhrase.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            chat_id: "chat_123",
          }),
          include: {
            phrases: {
              include: { answers: true },
            },
          },
        }),
      );

      expect(result).toEqual(mockGamePhrase);
    });

    it("throws an error if a game session already exists", async () => {
      const existingSession = {
        id: "session_1",
        chat_id: "chat_123",
        type: GameType.WORD_CHAIN,
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

      await expect(createPhraseGame("chat_123", mockPhrases)).rejects.toThrow(
        "Another game is already running.",
      );

      expect(tx.gameSession.findUnique).toHaveBeenCalledWith({
        where: { chat_id: "chat_123" },
      });
    });
  });


  describe("updatePhraseGame", () => {
    it("increments currentRound by 1", async () => {
      const updated = { ...mockGamePhrase, currentRound: 1 };

      prismaMock.gamePhrase.update.mockResolvedValue(updated);

      const result = await updatePhraseGame("chat_123");

      expect(prismaMock.gamePhrase.update).toHaveBeenCalledWith({
        where: { chat_id: "chat_123" },
        data: {
          currentRound: { increment: 1 },
        },
      });

      expect(result).toEqual(updated);
    });
  });


  describe("endPhraseGame", () => {
    it("deletes both the phrase game and the game session in a transaction", async () => {
      const mockDeletedPhrase = {
        id: "phrase_1",
        chat_id: "chat_123",
        currentRound: 0,
        createdAt: new Date(),
      };

      const mockDeletedSession = {
        id: "session_1",
        chat_id: "chat_123",
        type: GameType.PHRASE,
        createdAt: new Date(),
      };

      prismaMock.gamePhrase.delete.mockResolvedValue(mockDeletedPhrase);
      prismaMock.gameSession.delete.mockResolvedValue(mockDeletedSession);

      prismaMock.$transaction.mockResolvedValue([
        mockDeletedPhrase,
        mockDeletedSession,
      ]);

      await endPhraseGame("chat_123");

      expect(prismaMock.gamePhrase.delete).toHaveBeenCalledWith({
        where: { chat_id: "chat_123" },
      });

      expect(prismaMock.gameSession.delete).toHaveBeenCalledWith({
        where: { chat_id: "chat_123" },
      });

      expect(prismaMock.$transaction).toHaveBeenCalled();
    });
  });
});
