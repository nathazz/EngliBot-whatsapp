import { GameType } from "@prisma/client";
import { getGameSession } from "../../../db/gameSession.db";

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
const mockGameSession = {
  id: "cb75b217-44cf-4882-bebe-14e665dbb131",
  chat_id: "chat_123",
  type: GameType.PHRASE,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("gameSession_db", () => {
  describe("getGameSession", () => {
    it("returns the game session when found", async () => {
      prismaMock.gameSession.findUnique.mockResolvedValue(mockGameSession);

      const result = await getGameSession("chat_123");

      expect(prismaMock.gameSession.findUnique).toHaveBeenCalledWith({
        where: { chat_id: "chat_123" },
      });
      expect(result).toEqual(mockGameSession);
    });

    it("returns null when no session exists for the given chatId", async () => {
      prismaMock.gameSession.findUnique.mockResolvedValue(null);

      const result = await getGameSession("nonexistent_chat");

      expect(result).toBeNull();
    });

    it("passes the chatId exactly as received (no trimming)", async () => {
      prismaMock.gameSession.findUnique.mockResolvedValue(null);

      await getGameSession("  chat_with_spaces  ");

      expect(prismaMock.gameSession.findUnique).toHaveBeenCalledWith({
        where: { chat_id: "  chat_with_spaces  " },
      });
    });
  });
});
