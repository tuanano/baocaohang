export const BRANDS = [
  { id: 'XMI', name: 'XIAOMI' },
  { id: 'XMV', name: 'XIAOMI VN' },
  { id: 'APL', name: 'APPLE' },
  { id: 'SAM', name: 'SAMSUNG' },
  { id: 'ASU', name: 'ASUS' },
  { id: 'DEL', name: 'DELL' },
  { id: 'HPQ', name: 'HP' },
  { id: 'LEN', name: 'LENOVO' },
];

export const CATEGORIES_CS = [
  { id: 'SP', name: 'SMART PHONE' },
  { id: '1B', name: 'Hàng hóa, dịch vụ SB3-WS' },
  { id: '1D', name: 'TRADE DISCOUNTS CEG' },
  { id: '1F', name: 'Hàng hóa, dịch vụ SG.FPP' },
];

export const PRODUCT_LINES_PS = [
  { id: 'SPXMI', name: 'SMART PHONE XIAOMI' },
  { id: 'SPXMV', name: 'SMART PHONE XIAOMI VN' },
  { id: 'NBDLL', name: 'NOTEBOOK DELL' },
  { id: 'OTMSF', name: 'OTHERS MICROSOFT' },
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
  org: string[];
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
      org: ["A80"],
      brand: ["APL", "SAM"],
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
      org: ["A77", "A82"],
      brand: ["ASU", "DEL", "HPQ"],
      productLine: ["NBDLL", "PLCIS"],
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
      org: ["A80"],
      brand: ["SAM"],
      productLine: ["SVXFU"],
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
      org: [],
      brand: ["APL", "LEN"],
      productLine: ["OTMSF"],
      productCode: [],
      productName: ["iPad Pro"],
      partNumber: [],
      cpuBrand: ["Apple"],
      osType: ["iOS"],
      poNumber: ["PO-123"]
    }
  },
  {
    id: "5",
    reportCode: "BC_EXP_0005",
    brand: "Xiaomi",
    reportType: "Báo cáo Sell Through (Số lượng)",
    tag: "Báo cáo Xiaomi Q2",
    period: "01/04/2026 - 30/06/2026",
    exporter: "thaohh5",
    exportDate: "10/05/2026 14:20",
    status: "success",
    downloadUrl: "#",
    parameters: {
      fromDate: "01/04/2026",
      toDate: "30/06/2026",
      reportType: "Báo cáo Sell Through (Số lượng)",
      tag: "Báo cáo Xiaomi Q2",
      warehouseType: "Kho báo cáo",
      company: ["FDC HN"],
      org: ["A80"],
      brand: ["XMI"],
      productLine: ["SPXMI"],
      productCode: ["70281468", "71055945"],
      productName: [],
      partNumber: [],
      cpuBrand: [],
      osType: [],
      poNumber: []
    }
  },
];
