import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { HttpError } from "../../errors/HttpError.js";

function cleanExtractedText(text: string) {
  return text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/-- \d+ of \d+ --/g, "")
    .trim();
}

export async function extractResumeText(file: Express.Multer.File) {
  let extractedText = "";

  if (file.mimetype === "application/pdf") {
    const data = new Uint8Array(file.buffer);
    const parser = new PDFParse({ data });
    const result = await parser.getText();

    extractedText = result.text;
  } else if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    extractedText = result.value;
  } else {
    throw new HttpError(
      "Unsupported file type for text extraction",
      400,
      "UNSUPPORTED_RESUME_FILE_TYPE"
    );
  }

  const cleanedText = cleanExtractedText(extractedText);

  if (!cleanedText) {
    throw new HttpError(
      "Could not extract text from resume",
      422,
      "RESUME_TEXT_EXTRACTION_FAILED"
    );
  }

  return cleanedText;
}