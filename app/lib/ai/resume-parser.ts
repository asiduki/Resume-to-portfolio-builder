import { PDFParse } from "pdf-parse";

export async function parseResume(file: File) {
  const bytes = await file.arrayBuffer();

  const buffer = Buffer.from(bytes);

  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();

    return result.text;
  } finally {
    await parser.destroy();
  }
}