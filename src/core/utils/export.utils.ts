import { toBlob, toCanvas } from 'html-to-image';
import jsPDF from 'jspdf';

/**
 * Exports a DOM element to a PNG blob using html-to-image.
 *
 * Uses SVG foreignObject rendering so modern CSS color functions (oklch, lch,
 * lab, etc.) are handled natively by the browser with no pre-processing.
 *
 * @param element - The DOM element to capture.
 * @returns A blob containing the PNG image.
 */
export async function exportElementToPngBlob(element: HTMLElement): Promise<Blob> {
  const blob = await toBlob(element, {
    backgroundColor: '#ffffff',
    pixelRatio: 2,
  });

  if (!blob) {
    throw new Error('Failed to export element to PNG');
  }

  return blob;
}

/**
 * Exports a DOM element to a PDF file and triggers download.
 *
 * Uses html-to-image (SVG foreignObject) for DOM capture so modern CSS color
 * functions are supported natively.
 *
 * @param element - The DOM element to export.
 * @param filename - The name for the downloaded PDF file.
 */
export async function exportElementToPdf(element: HTMLElement, filename: string): Promise<void> {
  const canvas = await toCanvas(element, {
    backgroundColor: '#ffffff',
    pixelRatio: 2,
  });

  const imgData = canvas.toDataURL('image/png');
  const pageWidth = 297;
  const pageHeight = (canvas.height * pageWidth) / canvas.width;

  const pdf = new jsPDF({
    orientation: pageHeight > pageWidth ? 'portrait' : 'landscape',
    unit: 'mm',
    format: [pageWidth, pageHeight],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
  pdf.save(`${filename}.pdf`);
}
