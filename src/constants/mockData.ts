export const BRANDS = [
  { id: 'APL', name: 'APPLE' },
  { id: 'ASU', name: 'ASUS' },
  { id: 'DEL', name: 'DELL' },
  { id: 'SAM', name: 'SAMSUNG' },
  { id: 'HPQ', name: 'HP' },
  { id: 'LEN', name: 'LENOVO' },
  { id: 'ACE', name: 'ACER' },
  { id: 'AMD', name: 'AMD' },
  { id: 'ADB', name: 'ADOBE' },
];

export const CATEGORIES_CS = [
  { id: '1B', name: 'Hàng hóa, dịch vụ SB3-WS' },
  { id: '1D', name: 'TRADE DISCOUNTS CEG' },
  { id: '1F', name: 'Hàng hóa, dịch vụ SG.FPP' },
  { id: '2B', name: 'Hàng hóa, dịch vụ SG.SB1' },
  { id: '2F', name: 'Hàng hóa, dịch vụ SG.FSS' },
  { id: '3B', name: 'Hàng hóa, dịch vụ SG.SB2' },
  { id: '3C', name: 'CONSUMABLES OF 3D MACHINE' },
  { id: '3D', name: '3D PRINTER' },
  { id: '3F', name: 'Hàng hóa, dịch vụ FCT-ITS' },
  { id: '4B', name: 'Hàng hóa, dịch vụ SB3-NTT' },
];

export const PRODUCT_LINES_PS = [
  { id: 'PLCIS', name: 'POWER SUPPLIES CISCO' },
  { id: 'K0DLL', name: 'PROMOTION GOODS NB DELL' },
  { id: 'NBDLL', name: 'NOTEBOOK DELL' },
  { id: 'OTMSF', name: 'OTHERS MICROSOFT' },
  { id: 'SVXFU', name: 'SERVERS XFUSION' },
  { id: 'K1COL', name: 'PROMOTION GOODS CB COLORFUL' },
  { id: 'CBCOL', name: 'COMMERCIAL NOTEBOOK COLORFUL' },
  { id: 'C1COL', name: 'TRADE DISCOUNTS CB COLORFUL' },
  { id: 'A0COL', name: 'TRADE DISCOUNTS COLORFUL' },
];

export const REPORT_TYPES = [
  'Báo cáo Sell Through (Số lượng)',
  'Báo cáo Sell Through (Serial)',
  'Báo cáo Sell In (Số lượng)',
  'Báo cáo Sell In (Serial)',
  'Báo cáo Inventory (Số lượng)',
  'Báo cáo Inventory (Serial)',
];

export const PERIODS = ['Ngày', 'Tuần', 'Tháng', 'Quý'];

export interface ExportParameters {
  fromDate: string;
  toDate: string;
  reportType: string;
  tag: string;
  warehouseType: string;
  company: string[];
  brand: string[];
  productLine: string[];
  productCode: string[];
  productName: string[];
  partNumber: string[];
  cpuBrand: string[];
  osType: string[];
  poNumber: string[];
}

export interface ExportRecord {
  id: string;
  reportCode: string;
  brand: string;
  reportType: string;
  period: string;
  tag: string;
  exporter: string;
  exportDate: string;
  status: "success" | "processing" | "failed";
  downloadUrl?: string;
  parameters?: ExportParameters;
}

export const INITIAL_BRAND_REPORTS: ExportRecord[] = [
  {
    id: "1",
    reportCode: "BC_EXP_0001",
    brand: "Apple",
    reportType: "Báo cáo Sell Through (Số lượng)",
    tag: "Báo cáo 1",
    period: "01/03/2026 - 31/03/2026",
    exporter: "thaohh5",
    exportDate: "23/04/2026 08:30",
    status: "success",
    downloadUrl: "#",
    parameters: {
      fromDate: "01/03/2026",
      toDate: "31/03/2026",
      reportType: "Báo cáo Sell Through (Số lượng)",
      tag: "Báo cáo 1",
      warehouseType: "Kho báo cáo",
      company: ["Công ty A", "Công ty B"],
      brand: ["1"],
      productLine: [],
      productCode: [],
      productName: [],
      partNumber: [],
      cpuBrand: [],
      osType: [],
      poNumber: []
    }
  },
  {
    id: "2",
    reportCode: "BC_EXP_0002",
    brand: "Asus (+2)",
    reportType: "Báo cáo Sell Through (Serial)",
    tag: "Báo cáo 2",
    period: "01/03/2026 - 31/03/2026",
    exporter: "thaohh5",
    exportDate: "23/04/2026 08:35",
    status: "success",
    downloadUrl: "#",
    parameters: {
      fromDate: "01/03/2026",
      toDate: "31/03/2026",
      reportType: "Báo cáo Sell Through (Serial)",
      tag: "Báo cáo 2",
      warehouseType: "Kho báo cáo",
      company: ["Công ty A"],
      brand: ["2", "3", "4"],
      productLine: ["DienThoai"],
      productCode: [],
      productName: [],
      partNumber: [],
      cpuBrand: [],
      osType: [],
      poNumber: []
    }
  },
  {
    id: "3",
    reportCode: "BC_EXP_0003",
    brand: "Samsung",
    reportType: "Báo cáo Inventory (Số lượng)",
    tag: "Báo cáo 1",
    period: "01/04/2026 - 28/04/2026",
    exporter: "thaohh5",
    exportDate: "28/04/2026 09:45",
    status: "processing",
    parameters: {
      fromDate: "01/04/2026",
      toDate: "28/04/2026",
      reportType: "Báo cáo Inventory (Số lượng)",
      tag: "Báo cáo 1",
      warehouseType: "Kho tổng",
      company: ["Công ty B"],
      brand: ["6"],
      productLine: ["Laptop"],
      productCode: ["MH001"],
      productName: [],
      partNumber: [],
      cpuBrand: ["Intel"],
      osType: ["Windows"],
      poNumber: []
    }
  },
  {
    id: "4",
    reportCode: "BC_EXP_0004",
    brand: "Apple (+1)",
    reportType: "Báo cáo Inventory (Serial)",
    tag: "Báo cáo 2",
    period: "01/02/2026 - 28/02/2026",
    exporter: "system",
    exportDate: "22/04/2026 10:15",
    status: "failed",
    parameters: {
      fromDate: "01/02/2026",
      toDate: "28/02/2026",
      reportType: "Báo cáo Inventory (Serial)",
      tag: "Báo cáo 2",
      warehouseType: "Kho báo cáo",
      company: ["Công ty C"],
      brand: ["1", "5"],
      productLine: ["Tablet"],
      productCode: [],
      productName: ["iPad Pro"],
      partNumber: [],
      cpuBrand: ["Apple"],
      osType: ["iOS"],
      poNumber: ["PO-123"]
    }
  },
];
