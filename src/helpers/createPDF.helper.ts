import puppeteer from "puppeteer";
import { templatePDF } from "../utils/constants";
import { WordListSchema } from "../types/box.schema";

export async function generatePDF(data: WordListSchema) {
  let browser;

  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    const rows = data
      .map(
        (item, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${item.word}</td>
      <td>${item.definition ?? "N/A"}</td>
      <td>${item.example ?? "N/A"}</td>
    </tr>
  `,
      )
      .join("");

    const html = templatePDF(rows);

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    return pdf;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
      
    console.error("[generatePDF] Failed to generate PDF:", message);
    throw new Error(`PDF generation failed: ${message}`);
  } finally {
    if (browser) await browser.close();
  }
}
