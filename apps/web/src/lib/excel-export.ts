import * as XLSX from "xlsx";

export interface ExcelColumn<T = any> {
  header: string;
  key: keyof T | string;
  width?: number;
  format?: (value: any, row: T) => any;
}

export function exportToExcel<T extends Record<string, any>>({
  filename,
  sheetName = "Sheet1",
  columns,
  data,
}: {
  filename: string;
  sheetName?: string;
  columns: ExcelColumn<T>[];
  data: T[];
}) {
  // Map rows to plain objects using column definitions
  const formattedData = data.map((row) => {
    const rowObj: Record<string, any> = {};
    columns.forEach((col) => {
      const rawVal = col.key in row ? row[col.key as string] : "";
      const val = col.format ? col.format(rawVal, row) : rawVal;
      rowObj[col.header] = val ?? "";
    });
    return rowObj;
  });

  // Create worksheet & workbook
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Set column widths dynamically if provided or calculated
  worksheet["!cols"] = columns.map((col) => ({
    wch: col.width || Math.max(col.header.length + 5, 15),
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate file download
  const cleanFilename = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
  XLSX.writeFile(workbook, cleanFilename);
}
