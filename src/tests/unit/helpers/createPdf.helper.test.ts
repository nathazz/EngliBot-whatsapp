import puppeteer from "puppeteer";
import { generatePDF } from "../../../helpers/createPDF.helper";

jest.mock("puppeteer");

describe("generatePDF", () => {
  const pdfBuffer = Buffer.from("fake-pdf");

  const mockPage = {
    setContent: jest.fn(),
    pdf: jest.fn().mockResolvedValue(pdfBuffer),
  };

  const mockBrowser = {
    newPage: jest.fn().mockResolvedValue(mockPage),
    close: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);
  });

  it("should generate a PDF from word list", async () => {
    const data = [
      {
        id: 1,
        word: "hello",
        definition: "a greeting",
        example: "Hello world",
      },
    ];

    const result = await generatePDF(data);

    expect(puppeteer.launch).toHaveBeenCalled();
    expect(mockBrowser.newPage).toHaveBeenCalled();
    expect(mockPage.setContent).toHaveBeenCalled();
    expect(mockPage.pdf).toHaveBeenCalledWith({
      format: "A4",
      printBackground: true,
    });

    expect(result).toEqual(pdfBuffer);
    expect(mockBrowser.close).toHaveBeenCalled();
  });

  it("should throw error if pdf generation fails", async () => {
    mockPage.pdf.mockRejectedValueOnce(new Error("PDF crash"));

    const data = [
      {
        id: 1,
        word: "test",
        definition: "test def",
        example: "example",
      },
    ];

    await expect(generatePDF(data)).rejects.toThrow(
      "PDF generation failed: PDF crash",
    );

    expect(mockBrowser.close).toHaveBeenCalled();
  });
});
