---
slug: pixelpress
name: PixelPress
thread: homegrown
year: 2026
status: active
intent: A privacy-first PDF compressor for sensitive documents, running entirely in your browser without sending them to a cloud service.
stack: [React, TypeScript, Vite, WebAssembly, Pyodide, PyMuPDF, OPFS, Tesseract OCR]
links: [Live tool::https://pixelpress.jinnotgin.com/, GitHub::https://github.com/jinnotgin/pixelpress-pdf-compressor]
images: [./pixelpress-main.png::PixelPress compression queue showing an engineering blog export reduced by 59% and a research paper reduced by 1%.]
---

## Why it existed

PDF compression was usually part of a cloud service or a larger paid application. That creates a problem when the document is sensitive: uploading it is not always acceptable, and I did not want another expensive subscription.

## The friction it answered

PixelPress addresses two related gaps:

- **Privacy:** sensitive PDFs should stay on the device. Government work is one example, but the same applies to any confidential material.
- **Compression:** PDFs exported from Figma or FigJam could remain surprisingly large, especially when they contained vector-heavy screens and diagrams.

## What was built

PixelPress runs entirely in the browser. Files are processed locally in a Web Worker using Pyodide, which lets Python run in the browser, and PyMuPDF. Nothing is uploaded to a cloud service.

The browser's Origin Private File System (OPFS) handles larger files and keeps results locally. Tesseract can optionally add searchable text to pages without usable text.

PixelPress chooses a compression strategy per page: preserve pages that are already efficient, and flatten clearly vector-heavy exports. A dedicated Figma preset keeps the more aggressive flattening workflow for screens and diagrams.

To try the tool, [click here](https://pixelpress.jinnotgin.com/).
