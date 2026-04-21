import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Exports a DOM element to a PNG blob using html2canvas.
 *
 * @param element - The DOM element to capture.
 * @returns A blob containing the PNG image.
 */
export async function exportElementToPngBlob(element: HTMLElement): Promise<Blob> {
  const canvas = await html2canvas(element, {
    useCORS: true,
    allowTaint: false,
    scale: 2,
    backgroundColor: '#ffffff',
  });

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to export element to PNG'));
      }
    }, 'image/png');
  });
}

/**
 * Exports a DOM element to a PDF file and triggers download.
 *
 * @param element - The DOM element to export.
 * @param filename - The name for the downloaded PDF file.
 */
export async function exportElementToPdf(element: HTMLElement, filename: string): Promise<void> {
  const canvas = await html2canvas(element, {
    useCORS: true,
    allowTaint: false,
    scale: 2,
    backgroundColor: '#ffffff',
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
