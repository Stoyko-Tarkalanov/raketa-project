import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const processFile = async (file, setImageSize) => {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const data = JSON.parse(e.target.result);

    const totalImageSize = calculateTotalImageSize(data);
    setImageSize(totalImageSize.toFixed(2));

    const buttons = extractButtons(data);
    await saveButtonsToCSV(buttons);

    const updatedData = simplifyImageReferences(data);
    saveUpdatedJSON(updatedData);
  };

  reader.readAsText(file);
};

export const extractButtons = (data) => {
  const buttons = [];

  const findButtons = (obj) => {
    if (obj && typeof obj === 'object') {
      if ('label' in obj && 'link' in obj && 'type' in obj) {
        buttons.push(obj);
      }

      Object.values(obj).forEach((value) => findButtons(value));
    }
  };

  findButtons(data);
  return buttons;
};

export const saveButtonsToCSV = async (buttons) => {
  const rows = buttons.map((button) => ({
    label: button.label,
    link: button.link,
    type: button.type,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Buttons');

  const csvData = XLSX.write(workbook, { bookType: 'csv', type: 'array' });
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'call-to-actions.csv');
};

export const simplifyImageReferences = (data) => {
  const regex = /images\/(\d{3})\/(\d{3})\/(\d{3})\//;

  const findAndSimplifyImages = (obj) => {
    if (obj && typeof obj === 'object') {
      if (obj.image && obj.image.urls && obj.image.urls.original) {
        const match = obj.image.urls.original.match(regex);
        if (match) {
          obj.image = `raketa-images://${match[3]}`;
        }
      }

      Object.values(obj).forEach((value) => findAndSimplifyImages(value));
    }
  };

  findAndSimplifyImages(data);
  return data;
};

export const saveUpdatedJSON = (data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });

  saveAs(blob, 'payhawk-homepage-updated.json');
};

export const calculateTotalImageSize = (data) => {
  let totalSize = 0;

  const findImageSizes = (obj) => {
    if (obj && typeof obj === 'object') {
      if ('size' in obj && typeof obj.size === 'number') {
        totalSize += obj.size;
      }

      Object.values(obj).forEach((value) => findImageSizes(value));
    }
  };

  findImageSizes(data);
  return totalSize / (1024 * 1024);
};
