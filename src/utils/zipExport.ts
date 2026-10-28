/**
 * Project File Exporter & ZIP Bundler
 */
import JSZip from 'jszip';
import { PROJECT_SOURCE_FILES } from '../data/projectFiles.ts';

export function downloadSingleFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadProjectZip() {
  const zip = new JSZip();

  // Root folder in zip
  const root = zip.folder('multilayer_perceptron_diabetes_project');
  if (!root) return;

  for (const [filename, content] of Object.entries(PROJECT_SOURCE_FILES)) {
    root.file(filename, content);
  }

  try {
    const docxResp = await fetch('/college_micro_project_report.docx');
    if (docxResp.ok) {
      const docxBlob = await docxResp.blob();
      root.file('Build_MLP_Neural_Network_Classification_Report.docx', docxBlob);
    }
  } catch (e) {
    console.warn('Could not bundle docx into zip:', e);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'multilayer_perceptron_diabetes_project.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
