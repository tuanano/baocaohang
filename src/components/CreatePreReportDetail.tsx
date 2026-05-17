import {
  useState,
  useMemo,
  useRef,
  useEffect,
  type ReactNode,
  type MouseEvent,
} from "react";
import {
  ChevronLeft,
  RefreshCcw,
  ChevronDown,
  Calendar,
  Flag,
  ChevronRight,
  ChevronsUpDown,
  Search,
  CheckCircle2,
  Download,
  Save,
  ExternalLink,
  X,
  Check,
  FilePlus,
  ArrowLeft,
  XCircle,
  HelpCircle,
  History,
  User,
  SlidersHorizontal,
  Upload,
  Plus,
  Trash2,
  Edit2,
  FileText,
  Package,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BRANDS } from "../constants/mockData";

interface ReportDetailProps {
  type: "pre" | "post";
  category: "quantity" | "serial";
  mode?: "create" | "view";
  isApproveMode?: boolean;
  onBack: () => void;
}

interface TableRow {
  id: string;
  brandVendor: string;
  comName: string;
  geo: string;
  reportCustomerId: string;
  reportCustomerName: string;
  reportTaxId: string;
  customerGroupId: string;
  customerGroup: string;
  invtOrgCode: string;
  invtOrgName: string;
  invtSubCode: string;
  invtSubName: string;
  brand: string;
  ps: string;
  itemCode: string;
  partNumber: string;
  itemName: string;
  model: string;
  color: string;
  cpuBrand: string;
  cpuModel: string;
  osType: string;
  reportInvoiceDate: string;
  reportInvoiceNumber: string;
  reportQty: string;
  serialNumber?: string;
  importPONumber?: string;
  importDate?: string;
  vendorOrderNumber?: string;
  poNumber: string;
  poUnitCost: string;
  currencyCode: string;
  unitCost: string;
  totalCost: string;
  unitPrice: string;
  revenue: string;
  billToLocationId: string;
  billToLocation: string;
  billToAddress: string;
  zipCode: string;
  city: string;
  country: string;
  shipToLocationId: string;
  shipToLocation: string;
  shipToAddress: string;
  shipToZipCode: string;
  shipToCity: string;
  shipToCountry: string;
  bidNumber: string;
  endUserName: string;
  endUserAddress: string;
  endUserCity: string;
  endUserCountry: string;
  endUserZipCode: string;
  transactionNumber: string;
  transactionDate: string;
  systemCustomerId?: string;
  systemCustomerName?: string;
  systemInvoiceNumber?: string;
  systemInvoiceDate?: string;
  systemQty?: string;
  unitOfMeasure?: string;
  transactionType: string;
  changeType?: "add" | "update" | "delete";
  originalData?: Partial<TableRow>;
}

const COLUMN_CONFIG_BASE: { key: keyof TableRow; label: string }[] = [
  { key: "brandVendor", label: "Hãng/ Vendor" },
  { key: "comName", label: "Com_name" },
  { key: "geo", label: "GEO" },
  { key: "reportCustomerId", label: "Mã khách hàng" },
  { key: "reportCustomerName", label: "Tên khách hàng" },
  { key: "reportTaxId", label: "Mã số thuế" },
  { key: "customerGroupId", label: "GroupID_khách hàng" },
  { key: "customerGroup", label: "Group_khách hàng" },
  { key: "invtOrgCode", label: "Invt Org Code" },
  { key: "invtOrgName", label: "Invt Org Name" },
  { key: "invtSubCode", label: "Invt Sub Code" },
  { key: "invtSubName", label: "Invt Sub Name" },
  { key: "brand", label: "Brand" },
  { key: "ps", label: "PS" },
  { key: "itemCode", label: "Item Code" },
  { key: "partNumber", label: "Part_Number" },
  { key: "itemName", label: "Item Name" },
  { key: "model", label: "Model" },
  { key: "color", label: "Color" },
  { key: "cpuBrand", label: "CPU_Brand" },
  { key: "cpuModel", label: "CPU_Model" },
  { key: "osType", label: "Loại hệ điều hành" },
  { key: "reportInvoiceDate", label: "Invoice Date" },
  { key: "reportInvoiceNumber", label: "Invoice Number" },
  { key: "reportQty", label: "Qty" },
  { key: "billToLocation", label: "Bill To Location" },
  { key: "billToAddress", label: "Bill To Address" },
  { key: "zipCode", label: "ZIP Code (Bill)" },
  { key: "city", label: "Tỉnh thành (Bill)" },
  { key: "country", label: "Quốc gia (Bill)" },
  { key: "shipToLocation", label: "Ship To Location" },
  { key: "shipToAddress", label: "Ship To Address" },
  { key: "shipToZipCode", label: "ZIP Code (Ship)" },
  { key: "shipToCity", label: "Tỉnh thành (Ship)" },
  { key: "shipToCountry", label: "Quốc gia (Ship)" },
  { key: "poNumber", label: "PO number" },
  // Dynamic columns will be inserted here
  { key: "transactionNumber", label: "Số giao dịch" },
  { key: "transactionDate", label: "Ngày giao dịch" },
  { key: "transactionType", label: "Transaction Type" },
];

const mockCommonFields = {
  brandVendor: "XIAOMI",
  comName: "FDC HN",
  geo: "HN",
  reportCustomerId: "219748",
  reportCustomerName: "CÔNG TY TNHH CÔNG NGHỆ HÀ DUY",
  reportTaxId: "0402226769",
  customerGroupId: "",
  customerGroup: "",
  invtOrgCode: "A80",
  invtOrgName: "Kho khác HN",
  invtSubCode: "111000000",
  invtSubName: "Kho hang nhap khau HCM",
  brand: "XIAOMI",
  ps: "SMART PHONE XIAOMI",
  itemCode: "70281468",
  partNumber: "MZB0ARHEU",
  itemName: "Điện thoại di động Redmi Note 11 Pro Polar White 8GB RAM 128GB ROM (2201116TG)_MZB0ARHEU",
  model: "Redmi Note 11 Pro",
  color: "Polar White",
  cpuBrand: "MediaTek",
  cpuModel: "Helio G96",
  osType: "Android",
  reportInvoiceDate: "25/03/2026",
  reportInvoiceNumber: "167285",
  reportQty: "10",
  poNumber: "PO-XIAOMI-2026-001",
  poUnitCost: "6,000,000",
  currencyCode: "VND",
  unitCost: "6,200,000",
  totalCost: "62,000,000",
  unitPrice: "7,490,000",
  revenue: "74,900,000",
  billToLocationId: "LOC-HCM-01",
  billToLocation: "HCM Dist 1",
  billToAddress: "123 Le Loi, HCM",
  zipCode: "700000",
  city: "HCM",
  country: "VN",
  shipToLocationId: "LOC-HCM-01",
  shipToLocation: "HCM Dist 1",
  shipToAddress: "123 Le Loi, HCM",
  shipToZipCode: "700000",
  shipToCity: "HCM",
  shipToCountry: "VN",
  bidNumber: "BID-XIAOMI-2026",
  endUserName: "Nguyen Van A",
  endUserAddress: "456 Tran Hung Dao, HCM",
  endUserCity: "HCM",
  endUserCountry: "VN",
  endUserZipCode: "700000",
  transactionNumber: "TRX-1001",
  transactionDate: "26/03/2026",
  unitOfMeasure: "Chiếc",
  transactionType: "SnS",
};

const tableData: TableRow[] = Array.from({ length: 15 }, (_, i) => ({
  id: `L-00${i + 1}`,
  ...mockCommonFields,
  reportInvoiceNumber: `${167285 + i}`,
  reportQty: String(10 + i),
}));

const importChangesMock: TableRow[] = tableData.map((row) => ({
  ...row,
  changeType: "update",
  originalData: {
    ...row,
    reportInvoiceDate: null,
    reportInvoiceNumber: null,
    reportCustomerId: null,
    reportCustomerName: null,
  } as any,
}));

interface InventoryProduct {
  id: string;
  itemCode: string;
  itemName: string;
  ps: string;
  unit: string;
  inventoryQty: number;
  exportQty: number;
  exportPrice: number;
  totalPrice: number;
  serialNumberExport: string;
  exportedQty: number;
  serialNumberImport: string;
  importedQty: number;
  storageQty: number;
}

interface InventoryReportData {
  id: string;
  invoiceDate: string;
  refInvoiceNumber: string;
  customerId: string;
  customerName: string;
  billToLocation: string;
  billToAddress: string;
  zipCode: string;
  city: string;
  country: string;
  shipToLocation: string;
  shipToAddress: string;
  shipToZipCode: string;
  shipToCity: string;
  shipToCountry: string;
  itemCode: string;
  itemName: string;
  ps: string;
  unit: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  serialNumber: string;
}

interface InventoryRequest {
  id: string;
  collapsed: boolean;
  type: string;
  formNumber: string;
  symbol: string;
  company: string;
  businessCenter: string;
  salesTeam: string;
  accountingDate: string;
  orgExport: string;
  warehouseExport: string;
  storekeeperExport: string;
  orgImport: string;
  warehouseImport: string;
  storekeeperImport: string;
  deliveryAddress: string;
  deliveryMethod: string;
  hasDelivery: boolean;
  receiver: string;
  phoneNumber: string;
  email: string;
  isDemo: boolean;
  demoTime: string;
  customer: string;
  isPickupFromCustomer: boolean;
  pickupAddress: string;
  description: string;
  note: string;
  isB2B: boolean;
  products: InventoryProduct[];
  reportData: InventoryReportData[];
}

export default function CreatePreReportDetail({
  category,
  mode: initialMode = "create",
  isApproveMode = false,
  onBack,
  onTypeChange,
  onCategoryChange,
  brandReports = [],
}: {
  category: "quantity" | "serial";
  mode?: "create" | "view";
  isApproveMode?: boolean;
  onBack: () => void;
  onTypeChange?: (type: "pre" | "post") => void;
  onCategoryChange?: (cat: "quantity" | "serial") => void;
  brandReports?: any[];
}) {
  const [localMode, setLocalMode] = useState(initialMode);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [reason, setReason] = useState("");
  const [reportDates, setReportDates] = useState({
    startDate: "",
    endDate: "",
  });
  const [inventoryRequests, setInventoryRequests] = useState<InventoryRequest[]>(
    initialMode === "view"
      ? [
          {
            id: "REQ_001",
            collapsed: false,
            type: "Xuất bán trả chậm",
            formNumber: "FORM_001",
            symbol: "SYM_001",
            company: "FDCHN",
            businessCenter: "FHO Other HN",
            salesTeam: "FHO Other",
            accountingDate: "2026-05-15",
            orgExport: "A77 - Kho ban HN",
            warehouseExport: "Kho hang ban - TSGX - HN",
            storekeeperExport: "haitp - Hai",
            orgImport: "A80 - Kho khac HN",
            warehouseImport: "Kho hang du an - HN",
            storekeeperImport: "haitp - Hai",
            deliveryAddress: "261 Cầu Giấy, Hà Nội",
            deliveryMethod: "Vận chuyển",
            hasDelivery: true,
            receiver: "Anh Ba",
            phoneNumber: "0987654321",
            email: "ba.anh@example.com",
            isDemo: false,
            demoTime: "",
            customer: "Công ty Đối tác X",
            isPickupFromCustomer: false,
            pickupAddress: "",
            description: "Đề nghị xuất hàng báo cáo hãng quý 2",
            note: "Hàng gấp cần giao sớm",
            isB2B: true,
            products: [
              {
                id: "P1",
                itemCode: "70281468",
                itemName: "Điện thoại di động Redmi Note 11 Pro Polar White 8GB RAM 128GB ROM (2201116TG)_MZB0ARHEU",
                ps: "SPXMI - SMART PHONE XIAOMI",
                unit: "Chiếc",
                inventoryQty: 100,
                exportQty: 5,
                exportPrice: 6200000,
                totalPrice: 31000000,
                serialNumberExport: "---",
                exportedQty: 0,
                serialNumberImport: "---",
                importedQty: 0,
                storageQty: 100,
              },
              {
                id: "P2",
                itemCode: "71055945",
                itemName: "Điện thoại di động Redmi Note 14 Mist Purple 8 RAM 256 ROM 24117RN76O_MZB0JMOEU",
                ps: "SPXMI - SMART PHONE XIAOMI",
                unit: "Chiếc",
                inventoryQty: 50,
                exportQty: 2,
                exportPrice: 8500000,
                totalPrice: 17000000,
                serialNumberExport: "---",
                exportedQty: 0,
                serialNumberImport: "---",
                importedQty: 0,
                storageQty: 50,
              },
              {
                id: "P3",
                itemCode: "70284599",
                itemName: "Điện thoại di động Redmi Note 11 Pro+ 5G Forest Green 8GB RAM 256GB ROM (21091116UG)_MZB0AGEEU",
                ps: "SPXMI - SMART PHONE XIAOMI",
                unit: "Chiếc",
                inventoryQty: 30,
                exportQty: 0,
                exportPrice: 9500000,
                totalPrice: 0,
                serialNumberExport: "---",
                exportedQty: 0,
                serialNumberImport: "---",
                importedQty: 0,
                storageQty: 30,
              },
              {
                id: "P4",
                itemCode: "71055948",
                itemName: "Điện thoại di động Redmi Note 14 pro Midnight Black 8G RAM 256G ROM 24116RACCG_MZB0ID4EU",
                ps: "SPXMI - SMART PHONE XIAOMI",
                unit: "Chiếc",
                inventoryQty: 45,
                exportQty: 0,
                exportPrice: 8900000,
                totalPrice: 0,
                serialNumberExport: "---",
                exportedQty: 0,
                serialNumberImport: "---",
                importedQty: 0,
                storageQty: 45,
              },
              {
                id: "P5",
                itemCode: "71055942",
                itemName: "Điện thoại di động Redmi Note 14 Lime Green 8 RAM 128 ROM 24117RN76O_MZB0J0XEU",
                ps: "SPXMI - SMART PHONE XIAOMI",
                unit: "Chiếc",
                inventoryQty: 60,
                exportQty: 0,
                exportPrice: 7200000,
                totalPrice: 0,
                serialNumberExport: "---",
                exportedQty: 0,
                serialNumberImport: "---",
                importedQty: 0,
                storageQty: 60,
              },
              {
                id: "P6",
                itemCode: "71055944",
                itemName: "Điện thoại di động Redmi Note 14 Midnight Black 8 RAM 256 ROM 24117RN76O_MZB0J11EU",
                ps: "SPXMI - SMART PHONE XIAOMI",
                unit: "Chiếc",
                inventoryQty: 40,
                exportQty: 0,
                exportPrice: 8500000,
                totalPrice: 0,
                serialNumberExport: "---",
                exportedQty: 0,
                serialNumberImport: "---",
                importedQty: 0,
                storageQty: 40,
              },
              {
                id: "P7",
                itemCode: "71063705",
                itemName: "Điện thoại di động Redmi Note 14 5G Lavender Purple 8G RAM 256G ROM (6932554431228)",
                ps: "SPXMV - SMART PHONE XIAOMI VN",
                unit: "Chiếc",
                inventoryQty: 25,
                exportQty: 0,
                exportPrice: 7900000,
                totalPrice: 0,
                serialNumberExport: "---",
                exportedQty: 0,
                serialNumberImport: "---",
                importedQty: 0,
                storageQty: 25,
              },
              {
                id: "P8",
                itemCode: "71029611",
                itemName: "Điện thoại di động Redmi Note 13 Pro+ 5G Midnight Black 8GB RAM 256GB ROM (23090RA98G)_MZB0FFHEU",
                ps: "SPXMI - SMART PHONE XIAOMI",
                unit: "Chiếc",
                inventoryQty: 15,
                exportQty: 0,
                exportPrice: 10500000,
                totalPrice: 0,
                serialNumberExport: "---",
                exportedQty: 0,
                serialNumberImport: "---",
                importedQty: 0,
                storageQty: 15,
              },
              {
                id: "P9",
                itemCode: "71084966",
                itemName: "Điện thoại di động Redmi Note 15 5G Mist Purple 6G RAM 128G ROM (6932554469641)",
                ps: "SPXMV - SMART PHONE XIAOMI VN",
                unit: "Chiếc",
                inventoryQty: 55,
                exportQty: 0,
                exportPrice: 6500000,
                totalPrice: 0,
                serialNumberExport: "---",
                exportedQty: 0,
                serialNumberImport: "---",
                importedQty: 0,
                storageQty: 55,
              },
              {
                id: "P10",
                itemCode: "71084965",
                itemName: "Điện thoại di động Redmi Note 15 5G Black 6G RAM 128G ROM (6932554469634)",
                ps: "SPXMV - SMART PHONE XIAOMI VN",
                unit: "Chiếc",
                inventoryQty: 80,
                exportQty: 0,
                exportPrice: 6500000,
                totalPrice: 0,
                serialNumberExport: "---",
                exportedQty: 0,
                serialNumberImport: "---",
                importedQty: 0,
                storageQty: 80,
              },
            ],
            reportData: [
              {
                id: "RD_1",
                invoiceDate: "10/05/2026",
                refInvoiceNumber: "INV_998877",
                customerId: "219748",
                customerName: "CÔNG TY TNHH CÔNG NGHỆ HÀ DUY",
                itemCode: "70281468",
                itemName: "Điện thoại di động Redmi Note 11 Pro Polar White 8GB RAM 128GB ROM (2201116TG)_MZB0ARHEU",
                ps: "SPXMI - SMART PHONE XIAOMI",
                unit: "Chiếc",
                qty: 5,
                unitPrice: 6200000,
                totalPrice: 31000000,
                serialNumber: "863451234567891, 863451234567892, 863451234567893, 863451234567894, 863451234567895",
              },
              {
                id: "RD_2",
                invoiceDate: "11/05/2026",
                refInvoiceNumber: "INV_998878",
                customerId: "219748",
                customerName: "CÔNG TY TNHH CÔNG NGHỆ HÀ DUY",
                itemCode: "71055945",
                itemName: "Điện thoại di động Redmi Note 14 Mist Purple 8 RAM 256 ROM 24117RN76O_MZB0JMOEU",
                ps: "SPXMI - SMART PHONE XIAOMI",
                unit: "Chiếc",
                qty: 2,
                unitPrice: 8500000,
                totalPrice: 17000000,
                serialNumber: "863451234567896, 863451234567897",
              },
            ],
          },
        ]
      : [
          {
            id: "REQ_001",
            collapsed: false,
            type: "",
            formNumber: "",
            symbol: "",
            company: "FDCHN",
            businessCenter: "FHO Other HN",
            salesTeam: "FHO Other",
            accountingDate: "2026-05-15",
            orgExport: "A77 - Kho ban HN",
            warehouseExport: "Kho hang ban - TSGX - HN",
            storekeeperExport: "haitp - Hai",
            orgImport: "A80 - Kho khac HN",
            warehouseImport: "Kho hang du an - HN",
            storekeeperImport: "haitp - Hai",
            deliveryAddress: "",
            deliveryMethod: "",
            hasDelivery: false,
            receiver: "",
            phoneNumber: "",
            email: "",
            isDemo: false,
            demoTime: "",
            customer: "",
            isPickupFromCustomer: false,
            pickupAddress: "",
            description: "",
            note: "",
            isB2B: false,
            products: [],
            reportData: [],
          },
        ]
  );

  const addRequest = () => {
    setInventoryRequests((prev) => [
      ...prev,
      {
        id: `REQ_${String(prev.length + 1).padStart(3, "0")}`,
        collapsed: false,
        type: "",
        formNumber: "",
        symbol: "",
        company: "FDCHN",
        businessCenter: "FHO Other HN",
        salesTeam: "FHO Other",
        accountingDate: "2026-05-15",
        orgExport: "A77 - Kho ban HN",
        warehouseExport: "Kho hang ban - TSGX - HN",
        storekeeperExport: "haitp - Hai",
        orgImport: "A80 - Kho khac HN",
        warehouseImport: "Kho hang du an - HN",
        storekeeperImport: "haitp - Hai",
        deliveryAddress: "",
        deliveryMethod: "",
        hasDelivery: false,
        receiver: "",
        phoneNumber: "",
        email: "",
        isDemo: false,
        demoTime: "",
        customer: "",
        isPickupFromCustomer: false,
        pickupAddress: "",
        description: "",
        note: "",
        isB2B: false,
        products: [],
        reportData: [],
      },
    ]);
  };

  const removeRequest = (id: string) => {
    if (inventoryRequests.length > 1) {
      setInventoryRequests((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const toggleCollapse = (id: string) => {
    setInventoryRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, collapsed: !r.collapsed } : r))
    );
  };

  const updateRequest = (id: string, updates: Partial<InventoryRequest>) => {
    setInventoryRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const [importConfig, setImportConfig] = useState<{
    requestId: string;
    section: "products" | "report";
  } | null>(null);

  const addProduct = (requestId: string) => {
    setInventoryRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          const newProduct: InventoryProduct = {
            id: `PROD_${Date.now()}`,
            itemCode: "",
            itemName: "",
            ps: "",
            unit: "Chiếc",
            inventoryQty: 0,
            exportQty: 0,
            exportPrice: 0,
            totalPrice: 0,
            serialNumberExport: "---",
            exportedQty: 0,
            serialNumberImport: "---",
            importedQty: 0,
            storageQty: 0,
          };
          return { ...r, products: [...r.products, newProduct] };
        }
        return r;
      })
    );
  };

  const updateProduct = (requestId: string, productId: string, updates: Partial<InventoryProduct>) => {
    setInventoryRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            products: r.products.map((p) =>
              p.id === productId ? { ...p, ...updates } : p
            ),
          };
        }
        return r;
      })
    );
  };

  const createReportData = (requestId: string) => {
    setInventoryRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          const newReportData: InventoryReportData[] = r.products.map((p) => ({
            id: `RD_${Date.now()}_${p.id}`,
            invoiceDate: "",
            refInvoiceNumber: "",
            customerId: "",
            customerName: r.customer,
            itemCode: p.itemCode,
            itemName: p.itemName,
            ps: p.ps,
            unit: p.unit,
            qty: p.exportQty,
            unitPrice: p.exportPrice,
            totalPrice: p.exportQty * p.exportPrice,
            serialNumber: p.serialNumberExport !== "---" ? p.serialNumberExport : "",
          }));
          return { ...r, reportData: newReportData };
        }
        return r;
      })
    );
    triggerToast("Đã tạo dữ liệu báo cáo từ sản phẩm xuất!");
  };

  const updateReportData = (requestId: string, rdId: string, updates: Partial<InventoryReportData>) => {
    setInventoryRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            reportData: r.reportData.map((rd) =>
              rd.id === rdId ? { ...rd, ...updates } : rd
            ),
          };
        }
        return r;
      })
    );
  };

  const removeReportData = (requestId: string, rdId: string) => {
    setInventoryRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            reportData: r.reportData.filter((rd) => rd.id !== rdId),
          };
        }
        return r;
      })
    );
  };

  const removeProduct = (requestId: string, productId: string) => {
    setInventoryRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return { ...r, products: r.products.filter((p) => p.id !== productId) };
        }
        return r;
      })
    );
  };

  const type = "pre" as string;
  const [activeTab, setActiveTab] = useState("ledger");
  const [showHighlight, setShowHighlight] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStatus, setImportStatus] = useState<
    "idle" | "uploading" | "error"
  >("idle");
  const [hasImportedData, setHasImportedData] = useState(initialMode === "view");
  const [didFreshImport, setDidFreshImport] = useState(false);

  // Advanced Filter State - Ledger
  const [isLedgerFilterOpen, setIsLedgerFilterOpen] = useState(false);
  const [ledgerSearchTerm, setLedgerSearchTerm] = useState("");
  const [ledgerFilters, setLedgerFilters] = useState({
    reportCustomerId: "",
    reportCustomerName: "",
    reportTaxId: "",
    reportInvoiceDate: "",
    reportInvoiceNumber: "",
    ps: "",
    itemCode: "",
    partNumber: "",
    itemName: "",
  });

  // Advanced Filter State - Import
  const [isImportFilterOpen, setIsImportFilterOpen] = useState(false);
  const [importSearchTerm, setImportSearchTerm] = useState("");
  const [importFilters, setImportFilters] = useState({
    reportCustomerId: "",
    reportCustomerName: "",
    reportTaxId: "",
    reportInvoiceDate: "",
    reportInvoiceNumber: "",
    ps: "",
    itemCode: "",
    partNumber: "",
    itemName: "",
  });

  // Serial Import Modal State
  const [showSerialModal, setShowSerialModal] = useState(false);
  const [currentImportingRow, setCurrentImportingRow] = useState<string | null>(
    null,
  );
  const [serialImportStatus, setSerialImportStatus] = useState<
    "idle" | "uploading" | "error"
  >("idle");
  const [importedSerials, setImportedSerials] = useState<string[]>([]);

  // Serial Detail Modal State
  const [showSerialDetailModal, setShowSerialDetailModal] = useState(false);
  const [currentSerialDetailRow, setCurrentSerialDetailRow] =
    useState<TableRow | null>(null);

  const startSerialSimulation = (result: "success" | "error") => {
    setSerialImportStatus("uploading");
    setTimeout(() => {
      if (result === "success") {
        setSerialImportStatus("idle");
        setShowSerialModal(false);
        if (currentImportingRow) {
          setImportedSerials((prev) => [...prev, currentImportingRow]);
        }
        triggerToast("Import danh sách Serial thành công!");
      } else {
        setSerialImportStatus("error");
      }
    }, 2000);
  };

  const resetLedgerFilters = () => {
    setLedgerSearchTerm("");
    setLedgerFilters({
      reportCustomerId: "",
      reportCustomerName: "",
      reportTaxId: "",
      reportInvoiceDate: "",
      reportInvoiceNumber: "",
      ps: "",
      itemCode: "",
      partNumber: "",
      itemName: "",
    });
  };

  const resetImportFilters = () => {
    setImportSearchTerm("");
    setImportFilters({
      reportCustomerId: "",
      reportCustomerName: "",
      reportTaxId: "",
      reportInvoiceDate: "",
      reportInvoiceNumber: "",
      ps: "",
      itemCode: "",
      partNumber: "",
      itemName: "",
    });
  };

  const applyFiltering = (data: TableRow[]) => {
    const searchTerm = activeTab === "ledger" ? ledgerSearchTerm : importSearchTerm;
    const filters = activeTab === "ledger" ? ledgerFilters : importFilters;

    return data.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reportInvoiceNumber
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.reportCustomerId
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.reportCustomerName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCustomerId =
        !filters.reportCustomerId ||
        item.reportCustomerId
          ?.toLowerCase()
          .includes(filters.reportCustomerId.toLowerCase());
      const matchesCustomerName =
        !filters.reportCustomerName ||
        item.reportCustomerName
          ?.toLowerCase()
          .includes(filters.reportCustomerName.toLowerCase());
      const matchesTaxId =
        !filters.reportTaxId ||
        item.reportTaxId
          ?.toLowerCase()
          .includes(filters.reportTaxId.toLowerCase());
      const matchesInvoiceDate =
        !filters.reportInvoiceDate ||
        item.reportInvoiceDate
          ?.toLowerCase()
          .includes(filters.reportInvoiceDate.toLowerCase());
      const matchesInvoiceNumber =
        !filters.reportInvoiceNumber ||
        item.reportInvoiceNumber
          ?.toLowerCase()
          .includes(filters.reportInvoiceNumber.toLowerCase());
      const matchesPs =
        !filters.ps ||
        item.ps.toLowerCase().includes(filters.ps.toLowerCase());
      const matchesItemCode =
        !filters.itemCode ||
        item.itemCode
          .toLowerCase()
          .includes(filters.itemCode.toLowerCase());
      const matchesPartNumber =
        !filters.partNumber ||
        item.partNumber
          .toLowerCase()
          .includes(filters.partNumber.toLowerCase());
      const matchesItemName =
        !filters.itemName ||
        item.itemName
          .toLowerCase()
          .includes(filters.itemName.toLowerCase());

      return (
        matchesSearch &&
        matchesCustomerId &&
        matchesCustomerName &&
        matchesTaxId &&
        matchesInvoiceDate &&
        matchesInvoiceNumber &&
        matchesPs &&
        matchesItemCode &&
        matchesPartNumber &&
        matchesItemName
      );
    });
  };

  const COLUMN_CONFIG = useMemo(() => {
    if (activeTab === "ledger") {
      return [
        { key: "itemCode", label: "Mã sản phẩm" },
        { key: "itemName", label: "Tên sản phẩm" },
        { key: "ps", label: "PS" },
        { key: "unitOfMeasure", label: "Đơn vị tính" },
        { key: "reportQty", label: "Số lượng" },
        { key: "unitPrice", label: "Đơn giá" },
        { key: "totalCost", label: "Thành tiền" },
        { key: "serialNumber", label: "Số SN/IMEI" },
      ] as { key: keyof TableRow; label: string }[];
    } else if (activeTab === "import") {
      return [
        { key: "reportInvoiceDate", label: "Ngày hóa đơn" },
        { key: "reportInvoiceNumber", label: "Số Hóa đơn tham chiếu" },
        { key: "reportCustomerId", label: "Mã Khách hàng" },
        { key: "reportCustomerName", label: "Tên Khách hàng" },
        { key: "itemCode", label: "Mã sản phẩm" },
        { key: "itemName", label: "Tên sản phẩm" },
        { key: "ps", label: "PS" },
        { key: "unitOfMeasure", label: "Đơn vị tính" },
        { key: "reportQty", label: "Số lượng" },
        { key: "unitPrice", label: "Đơn giá" },
        { key: "totalCost", label: "Thành tiền" },
        { key: "serialNumber", label: "Số SN/IMEI" },
      ] as { key: keyof TableRow; label: string }[];
    }

    // Fallback for summary or others
    if (category === "quantity") return COLUMN_CONFIG_BASE;

    const index = COLUMN_CONFIG_BASE.findIndex(
      (col) => col.key === "transactionNumber",
    );
    const extraCols: { key: keyof TableRow; label: string }[] = [
      { key: "serialNumber", label: "Số Serial / Imei" },
      { key: "importPONumber", label: "Số PO nhập" },
      { key: "importDate", label: "Ngày nhập kho" },
      { key: "vendorOrderNumber", label: "Order number của hãng" },
    ];

    const newConfig = [...COLUMN_CONFIG_BASE];
    newConfig.splice(index, 0, ...extraCols);
    return newConfig;
  }, [category, activeTab]);

  // Column Resizing State
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    () => {
      const initial: Record<string, number> = { id: 60 };
      COLUMN_CONFIG_BASE.forEach((col) => {
        const estimated = Math.max(120, col.label.length * 9 + 40);
        initial[col.key] = estimated;
      });
      // Add default widths for extra columns if serial
      initial["serialNumber"] = 180;
      initial["importPONumber"] = 150;
      initial["importDate"] = 140;
      initial["vendorOrderNumber"] = 180;
      initial["unitOfMeasure"] = 120;
      return initial;
    },
  );

  const resizingRef = useRef<{
    key: string;
    startX: number;
    startWidth: number;
  } | null>(null);

  const startResize = (key: string, e: MouseEvent) => {
    e.preventDefault();
    resizingRef.current = {
      key,
      startX: e.pageX,
      startWidth: columnWidths[key],
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResize);
    document.body.style.cursor = "col-resize";
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!resizingRef.current) return;
    const { key, startX, startWidth } = resizingRef.current;
    const diff = e.pageX - startX;
    const newWidth = Math.max(80, startWidth + diff);
    setColumnWidths((prev) => ({ ...prev, [key]: newWidth }));
  };

  const stopResize = () => {
    resizingRef.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResize);
    document.body.style.cursor = "default";
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopResize);
    };
  }, []);

  const historyData = [
    {
      user: "Quanna",
      time: "30/10/2025 17:54:16",
      action: "VAR đã xác nhận",
      detail: "Ok",
    },
    {
      user: "Quanna",
      time: "30/10/2025 17:54:16",
      action: "PM Head đã phê duyệt",
      detail: "Ok",
    },
    {
      user: "Quanna",
      time: "30/10/2025 17:54:16",
      action: "BD đã phê duyệt",
      detail: "Đầy đủ dữ liệu",
    },
    {
      user: "Quanna",
      time: "30/10/2025 17:54:16",
      action: "Gửi phê duyệt dữ liệu điều chỉnh",
      detail: "...",
    },
  ];

  const startSimulation = (status: "success" | "error") => {
    setImportStatus("uploading");
    setTimeout(() => {
      if (status === "success") {
        setImportStatus("idle");
        setShowImportModal(false);
        
        if (importConfig) {
          const { requestId, section } = importConfig;
          setInventoryRequests((prev) =>
            prev.map((r) => {
              if (r.id === requestId) {
                if (section === "products") {
                  const mockData = [
                    { itemCode: "70281468", itemName: "Điện thoại di động Redmi Note 11 Pro Polar White 8GB RAM 128GB ROM (2201116TG)_MZB0ARHEU", ps: "SPXMI - SMART PHONE XIAOMI", unit: "Chiếc", exportPrice: 6200000 },
                    { itemCode: "71055945", itemName: "Điện thoại di động Redmi Note 14 Mist Purple 8 RAM 256 ROM 24117RN76O_MZB0JMOEU", ps: "SPXMI - SMART PHONE XIAOMI", unit: "Chiếc", exportPrice: 8500000 },
                    { itemCode: "70284599", itemName: "Điện thoại di động Redmi Note 11 Pro+ 5G Forest Green 8GB RAM 256GB ROM (21091116UG)_MZB0AGEEU", ps: "SPXMI - SMART PHONE XIAOMI", unit: "Chiếc", exportPrice: 9500000 },
                  ];
                  const newProducts: InventoryProduct[] = mockData.map((m, idx) => ({
                    id: `PROD_IMPORT_${Date.now()}_${idx}`,
                    itemCode: m.itemCode,
                    itemName: m.itemName,
                    ps: m.ps,
                    unit: m.unit,
                    inventoryQty: 100,
                    exportQty: 5 + idx,
                    exportPrice: m.exportPrice,
                    totalPrice: (5 + idx) * m.exportPrice,
                    serialNumberExport: "---",
                    exportedQty: 0,
                    serialNumberImport: "---",
                    importedQty: 0,
                    storageQty: 0,
                  }));
                  return { ...r, products: [...r.products, ...newProducts] };
                } else if (section === "report") {
                  return {
                    ...r,
                    reportData: r.reportData.map((rd) => ({
                      ...rd,
                      invoiceDate: "17/05/2026",
                      refInvoiceNumber: "INV-998877",
                      customerId: "219748",
                      customerName: "CÔNG TY TNHH CÔNG NGHỆ HÀ DUY",
                      billToLocation: "LOC-HCM-01",
                      billToAddress: "123 Le Loi, HCM",
                      zipCode: "700000",
                      city: "HCM",
                      country: "VN",
                      shipToLocation: "LOC-HCM-01",
                      shipToAddress: "123 Le Loi, HCM",
                      shipToZipCode: "700000",
                      shipToCity: "HCM",
                      shipToCountry: "VN",
                      serialNumber: "863451234567891, 863451234567892, 863451234567893, 863451234567894, 863451234567895",
                    })),
                  };
                }
              }
              return r;
            })
          );
          setImportConfig(null);
        } else {
          setHasImportedData(true);
          setDidFreshImport(true);
          setActiveTab("import");
        }
        triggerToast("Import dữ liệu thành công!");
      } else {
        setImportStatus("error");
      }
    }, 2000);
  };

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleActionWithBack = (msg: string) => {
    triggerToast(msg);
    setTimeout(() => {
      onBack();
    }, 1500);
  };

  const InfoView = ({
    label,
    value,
    isLink = false,
  }: {
    label: string;
    value: string;
    isLink?: boolean;
  }) => (
    <div className="flex flex-col">
      <span className="text-[12px] text-gray-500 mb-1">{label}</span>
      {isLink ? (
        <a
          href="#"
          className="text-[13px] font-semibold text-[#00529C] hover:underline flex items-center gap-1 w-fit"
        >
          {value}
          <ExternalLink size={12} />
        </a>
      ) : (
        <span className="text-[13px] font-semibold text-[#002D56]">
          {value}
        </span>
      )}
    </div>
  );

  const getMergedData = () => {
    const deletedIds = importChangesMock
      .filter((i) => i.changeType === "delete")
      .map((i) => i.id);
    const updatedMap = new Map(
      importChangesMock
        .filter((i) => i.changeType === "update")
        .map((i) => [i.id, i]),
    );
    const newRows = importChangesMock.filter((i) => i.changeType === "add");

    return tableData
      .filter((r) => !deletedIds.includes(r.id))
      .map((r) => (updatedMap.has(r.id) ? updatedMap.get(r.id)! : r))
      .concat(newRows);
  };

  const currentTableData = useMemo(() => {
    let baseData: TableRow[] = tableData;
    if (activeTab === "import") {
      baseData = hasImportedData ? importChangesMock : [];
    }
    return applyFiltering(baseData);
  }, [
    activeTab,
    ledgerSearchTerm,
    ledgerFilters,
    importSearchTerm,
    importFilters,
    hasImportedData,
  ]);

  const renderCell = (row: TableRow, field: keyof TableRow) => {
    if (field === "reportQty" && category === "serial") {
      return "1";
    }

    if (
      field === "serialNumber" &&
      (activeTab === "ledger" || activeTab === "import")
    ) {
      return (
        <button
          onClick={() => {
            setCurrentSerialDetailRow(row);
            setShowSerialDetailModal(true);
          }}
          className="text-[#00529C] hover:underline whitespace-nowrap"
        >
          Xem SN/IMEI
        </button>
      );
    }

    const isChanged =
      row.changeType === "update" &&
      row.originalData &&
      field in row.originalData &&
      row.originalData[field] !== row[field];

    if (showHighlight && isChanged) {
      return (
        <div className="flex flex-col">
          <span className="text-gray-400 line-through text-[10px] decoration-red-300">
            {row.originalData![field] === null
              ? "null"
              : String(row.originalData![field])}
          </span>
          <span className="font-bold text-[#FD7E14]">{String(row[field])}</span>
        </div>
      );
    }
    return String(row[field]);
  };

  const statuses = [
    { id: "draft", label: "Dự thảo" },
    { id: "bd_pending", label: "Chờ BD duyệt" },
    { id: "pm_pending", label: "Chờ PM Head duyệt" },
    { id: "var_pending", label: "Chờ VAR xác nhận" },
    { id: "confirmed", label: "Đã xác nhận" },
  ];

  const currentStatus = localMode === "create" ? "draft" : "bd_pending";

  const FilterField = ({
    label,
    placeholder,
    value,
    onChange,
    options,
    isDate = false,
  }: any) => (
    <div className="flex flex-col gap-1.5 text-left">
      <label className="text-[12px] font-semibold text-[#4A5568]">
        {label}
      </label>
      <div className="relative">
        {isDate ? (
          <div className="relative group">
            <input
              type="date"
              value={value}
              readOnly={isView}
              onChange={(e) => onChange(e.target.value)}
              className={`w-full px-3 py-1.5 bg-white border border-gray-300 rounded text-[12px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C] appearance-none ${isView ? "bg-gray-50 cursor-not-allowed" : ""}`}
            />
            {!isView && (
              <Calendar
                size={14}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            )}
          </div>
        ) : options ? (
          <div className="relative group">
            <select
              value={value}
              disabled={isView}
              onChange={(e) => onChange(e.target.value)}
              className={`w-full px-3 py-1.5 bg-white border border-gray-300 rounded text-[12px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C] appearance-none ${!value ? "text-gray-400" : "text-gray-900"} ${isView ? "bg-gray-50 cursor-not-allowed" : ""}`}
            >
              <option value="">{placeholder}</option>
              {options.map((opt: any) => (
                <option key={opt.id || opt} value={opt.name || opt}>
                  {opt.name || opt}
                </option>
              ))}
            </select>
            {!isView && (
              <ChevronDown
                size={14}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            )}
          </div>
        ) : (
          <input
            type="text"
            value={value}
            readOnly={isView}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-1.5 bg-white border border-gray-300 rounded text-[12px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C] ${isView ? "bg-gray-50 cursor-not-allowed font-medium text-gray-700" : ""}`}
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );

  const isView = localMode === "view";

  const showActionColumn =
    localMode === "create" || (isApproveMode && didFreshImport);

  return (
    <div className="flex flex-col min-h-screen bg-[#F1F5F9]">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6 space-y-6">
          {/* Top Breadcrumb Status Stepper */}
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
            {statuses.map((s, idx) => (
              <div key={s.id} className="flex items-center gap-4 shrink-0">
                <span
                  className={`text-[13px] ${s.id === currentStatus ? "text-[#FD7E14] font-bold" : "text-[#94A3B8] font-medium"}`}
                >
                  {s.label}
                </span>
                {idx < statuses.length - 1 && (
                  <div className="w-[1px] h-4 bg-gray-200" />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-start pt-2">
            <div>
              <h1 className="text-[24px] font-bold text-[#002D56] font-sans tracking-tight leading-tight mb-4">
                Chi tiết đề nghị báo cáo (Báo cáo trước)
              </h1>
              
              <div className="space-y-1 mt-4 p-4 rounded bg-white">
                <div className="flex items-center gap-6">
                   <div className="text-[14px]">Người tạo: <span className="font-bold">trangntt299</span></div>
                   <div className="text-[14px]">Ngày tạo: <span className="font-bold">29/04/2026 08:56</span></div>
                </div>
                <div className="text-[14px]">Số đề nghị: <span className="font-bold">DNBC26_0123456</span></div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {localMode === "view" && isApproveMode && (
                <>
                  <button
                    onClick={() => setLocalMode("create")}
                    className="px-5 py-2.5 border border-[#00529C] text-[#00529C] rounded-lg text-[14px] font-bold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Edit2 size={16} />
                    Điều chỉnh
                  </button>
                  <button
                    onClick={() => setShowRejectConfirm(true)}
                    className="px-5 py-2.5 border border-red-500 text-red-500 rounded-lg text-[14px] font-bold hover:bg-red-50 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <XCircle size={16} />
                    Từ chối
                  </button>
                  <button
                    onClick={() => setShowApproveConfirm(true)}
                    className="px-8 py-2.5 bg-[#00529C] text-white rounded-lg text-[14px] font-bold hover:bg-[#00427D] transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <CheckCircle2 size={16} />
                    Phê duyệt
                  </button>
                </>
              )}

              {localMode !== "view" && (
                <>
                  <button
                    onClick={() =>
                      handleActionWithBack("Lưu dự thảo thành công!")
                    }
                    className="px-5 py-2.5 border border-[#00529C] text-[#00529C] rounded-lg text-[14px] font-bold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Save size={16} />
                    Lưu Dự thảo
                  </button>
                  <button
                    onClick={() =>
                      handleActionWithBack("Trình duyệt báo cáo thành công!")
                    }
                    className="px-8 py-2.5 bg-[#00529C] text-white rounded-lg text-[14px] font-bold hover:bg-[#00427D] transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <CheckCircle2 size={16} />
                    Trình duyệt
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-[#00529C] rounded-full" />
                <span className="text-[15px] font-bold text-[#002D56] uppercase tracking-wide">
                  Thông tin chung
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {!isView && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#4A5568]">
                    Hình thức báo cáo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <select
                      value="pre"
                      disabled={true}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-[13px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C] appearance-none cursor-not-allowed font-medium text-gray-700"
                    >
                      <option value="pre">Báo cáo trước</option>
                      <option value="post">Báo cáo sau</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#4A5568]">
                  Kỳ báo cáo (từ ngày) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    readOnly={isView}
                    value={reportDates.startDate || "2026-04-29"}
                    onChange={(e) => setReportDates(prev => ({ ...prev, startDate: e.target.value }))}
                    className={`w-full px-3 py-1.5 border border-gray-300 rounded text-[12px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C] appearance-none ${isView ? "bg-gray-50 cursor-not-allowed font-medium text-gray-700" : "bg-white"}`}
                  />
                  <Calendar
                    size={14}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#4A5568]">
                  Kỳ báo cáo (tới ngày) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    readOnly={isView}
                    value={reportDates.endDate || "2026-05-29"}
                    onChange={(e) => setReportDates(prev => ({ ...prev, endDate: e.target.value }))}
                    className={`w-full px-3 py-1.5 border border-gray-300 rounded text-[12px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C] appearance-none ${isView ? "bg-gray-50 cursor-not-allowed font-medium text-gray-700" : "bg-white"}`}
                  />
                  <Calendar
                    size={14}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#4A5568]">
                  Hãng <span className="text-red-500">*</span>
                </label>
                <span className="text-gray-700 font-medium text-[13px] px-3 py-2 bg-gray-50 border border-gray-100 rounded-md cursor-not-allowed">
                  XIAOMI
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mt-6">
              <label className="text-[13px] font-semibold text-[#4A5568]">
                Diễn giải
              </label>
              <textarea
                readOnly={isView}
                rows={2}
                placeholder="Nhập diễn giải báo cáo"
                value="Đề nghị xuất hàng báo cáo hãng quý 2"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md text-[13px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C] resize-none ${isView ? "bg-gray-50 cursor-not-allowed font-medium text-gray-700" : "bg-white"}`}
              />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <AnimatePresence>
            {inventoryRequests.map((req, idx) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Header of Section */}
                <div className="px-4 py-3 bg-[#FCFDFF] border-b border-gray-100 flex items-center justify-between group">
                  <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => toggleCollapse(req.id)}>
                    <div className="w-1 h-5 bg-[#00529C] rounded-full" />
                    <ChevronDown 
                      size={14} 
                      className={`text-[#00529C] transition-transform duration-200 ${req.collapsed ? "-rotate-90" : ""}`} 
                    />
                    <Package size={16} className="text-[#00529C]" />
                    <span className="text-[14px] font-bold text-[#002D56] font-sans uppercase tracking-wide">
                      Đề nghị xuất kho #{idx + 1}
                    </span>
                    {req.collapsed && (
                      <div className="flex items-center gap-6 ml-4 text-[11px] text-gray-500 border-l border-gray-200 pl-4">
                        <div className="flex gap-1.5"><span className="text-[#64748B]">Công ty:</span><span className="font-bold text-[#334155]">{req.company || "---"}</span></div>
                        <div className="flex gap-1.5"><span className="text-[#64748B]">TTKD:</span><span className="font-bold text-[#334155]">{req.businessCenter || "---"}</span></div>
                        <div className="flex gap-1.5"><span className="text-[#64748B]">Sale Team:</span><span className="font-bold text-[#334155]">{req.salesTeam || "---"}</span></div>
                        <div className="flex gap-1.5"><span className="text-[#64748B]">Org xuất:</span><span className="font-bold text-[#334155]">{req.orgExport || "---"}</span></div>
                        <div className="flex gap-1.5"><span className="text-[#64748B]">Org nhập:</span><span className="font-bold text-[#334155]">{req.orgImport || "---"}</span></div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!isApproveMode && inventoryRequests.length > 1 && (
                      <button
                        onClick={() => removeRequest(req.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="Xóa đề nghị"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {!req.collapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 space-y-8">
                        {/* Subsection: Thông tin chung */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <ChevronDown size={14} className="text-[#00529C]" />
                            <span className="text-[13px] font-bold text-[#002D56] uppercase">
                              Thông tin chung
                            </span>
                          </div>

                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <FilterField label="Ngày hạch toán *" isDate value={req.accountingDate} onChange={(v: string) => updateRequest(req.id, { accountingDate: v })} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <FilterField label="Công ty *" placeholder="Chọn công ty" value={req.company} onChange={(v: string) => updateRequest(req.id, { company: v })} options={["FDCHN", "FDC", "FTG"]} />
                              <FilterField label="Trung tâm kinh doanh *" placeholder="Chọn TTKD" value={req.businessCenter} onChange={(v: string) => updateRequest(req.id, { businessCenter: v })} options={["FHO Other HN", "FDC HN", "FDC HCM"]} />
                              <FilterField label="Salesteam *" placeholder="Chọn Sales Team" value={req.salesTeam} onChange={(v: string) => updateRequest(req.id, { salesTeam: v })} options={["FHO Other", "Team 1", "Team 2"]} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <FilterField label="Org xuất *" placeholder="Chọn org xuất" value={req.orgExport} onChange={(v: string) => updateRequest(req.id, { orgExport: v })} options={["A77 - Kho ban HN", "A80", "A77"]} />
                              <FilterField label="Kho xuất *" placeholder="Chọn kho xuất" value={req.warehouseExport} onChange={(v: string) => updateRequest(req.id, { warehouseExport: v })} options={["Kho hang ban - TSGX - HN", "Kho 1", "Kho 2"]} />
                              <FilterField label="Thủ kho xuất *" placeholder="Chọn thủ kho" value={req.storekeeperExport} onChange={(v: string) => updateRequest(req.id, { storekeeperExport: v })} options={["haitp - Hai", "Admin 1", "Admin 2"]} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <FilterField label="Org nhập *" placeholder="Chọn org nhập" value={req.orgImport} onChange={(v: string) => updateRequest(req.id, { orgImport: v })} options={["A80 - Kho khac HN", "A80", "A77"]} />
                              <FilterField label="Kho nhập *" placeholder="Chọn kho nhập" value={req.warehouseImport} onChange={(v: string) => updateRequest(req.id, { warehouseImport: v })} options={["Kho hang du an - HN", "Kho A", "Kho B"]} />
                              <FilterField label="Thủ kho nhập *" placeholder="Chọn thủ kho" value={req.storekeeperImport} onChange={(v: string) => updateRequest(req.id, { storekeeperImport: v })} options={["haitp - Hai", "Admin A", "Admin B"]} />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-6">
                            <div className="relative group">
                              <FilterField label="Địa chỉ giao hàng *" placeholder="Nhập địa chỉ giao hàng" value={req.deliveryAddress} onChange={(v: string) => updateRequest(req.id, { deliveryAddress: v })} />
                              <Edit2 size={12} className="absolute right-2 bottom-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5 text-left">
                              <label className="text-[12px] font-semibold text-[#4A5568]">Diễn giải *</label>
                              <textarea rows={2} value={req.description} readOnly={isView} onChange={(e) => updateRequest(req.id, { description: e.target.value })} className={`w-full px-3 py-2 bg-white border border-gray-300 rounded text-[12px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C] resize-none ${isView ? "bg-gray-50 cursor-not-allowed" : ""}`} placeholder="Nhập diễn giải" />
                            </div>
                            <div className="flex flex-col gap-1.5 text-left">
                              <label className="text-[12px] font-semibold text-[#4A5568]">Ghi chú</label>
                              <textarea rows={2} value={req.note} readOnly={isView} onChange={(e) => updateRequest(req.id, { note: e.target.value })} className={`w-full px-3 py-2 bg-white border border-gray-300 rounded text-[12px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C] resize-none ${isView ? "bg-gray-50 cursor-not-allowed" : ""}`} placeholder="Nhập ghi chú" />
                            </div>
                          </div>
                        </div>

                        {/* Subsection: Sản phẩm xuất */}
                        <div className="space-y-4 pt-6 border-t border-gray-100">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <ChevronDown size={14} className="text-[#00529C]" />
                              <span className="text-[13px] font-bold text-[#002D56] uppercase">
                                Sản phẩm xuất
                              </span>
                            </div>
                            {!isView && (
                              <div className="flex items-center gap-3">
                                <button onClick={() => createReportData(req.id)} className="flex items-center gap-1.5 text-[12px] font-bold text-[#00529C] px-3 py-1.5 border border-[#00529C] rounded hover:bg-blue-50">
                                  <RefreshCcw size={14} />
                                  Tạo dữ liệu báo cáo
                                </button>
                                <button onClick={() => { setImportConfig({ requestId: req.id, section: "products" }); setShowImportModal(true); }} className="flex items-center gap-1.5 text-[12px] font-bold text-[#00529C] px-3 py-1.5 border border-[#00529C] rounded hover:bg-blue-50">
                                  <FilePlus size={14} />
                                  Import
                                </button>
                              </div>
                            )}
                          </div>


                          <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-[400px]">
                            <table className="w-max min-w-full text-left border-collapse table-fixed">
                              <thead>
                                <tr className="bg-[#F8FAFC]">
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[50px]">No</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[120px]">Mã sản phẩm</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[250px]">Tên sản phẩm</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[150px]">PS</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[100px]">Đơn vị tính</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[120px]">Số lượng tồn</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[120px]">Số lượng xuất</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[120px]">Số SN/IMEI xuất</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[120px]">Số SN/IMEI nhập</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[120px]">Tác vụ</th>
                                </tr>
                              </thead>
                              <tbody>
                                {req.products.filter(p => !isView || p.exportQty > 0).length > 0 ? (
                                  req.products.filter(p => !isView || p.exportQty > 0).map((p, pIdx) => (
                                    <tr key={p.id} className="hover:bg-gray-50 border-b border-gray-100 group/row">
                                      <td className="px-4 py-3 text-[12px]">{String(pIdx + 1).padStart(2, '0')}</td>
                                      <td className="px-4 py-3 text-[12px] relative">
                                        <input type="text" value={p.itemCode} readOnly={isView} onChange={(e) => updateProduct(req.id, p.id, { itemCode: e.target.value })} className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 ${isView ? "cursor-default" : ""}`} placeholder="..." />
                                        {!isView && <Edit2 size={10} className="absolute right-2 top-4 text-gray-300 opacity-0 group-hover/row:opacity-100" />}
                                      </td>
                                      <td className="px-4 py-3 text-[12px] relative font-medium leading-relaxed">
                                        <div className="w-full whitespace-normal break-words">
                                          <input type="text" value={p.itemName} readOnly={isView} onChange={(e) => updateProduct(req.id, p.id, { itemName: e.target.value })} className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 ${isView ? "cursor-default" : ""}`} placeholder="..." />
                                        </div>
                                        {!isView && <Edit2 size={10} className="absolute right-1 top-4 text-gray-300 opacity-0 group-hover/row:opacity-100" />}
                                      </td>
                                      <td className="px-4 py-3 text-[12px] whitespace-normal break-words leading-relaxed">
                                        <input type="text" value={p.ps} readOnly={isView} onChange={(e) => updateProduct(req.id, p.id, { ps: e.target.value })} className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 ${isView ? "cursor-default" : ""}`} placeholder="..." />
                                      </td>
                                      <td className="px-4 py-3 text-[12px]">
                                        <input type="text" value={p.unit} readOnly={isView} onChange={(e) => updateProduct(req.id, p.id, { unit: e.target.value })} className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 ${isView ? "cursor-default" : ""}`} placeholder="..." />
                                      </td>
                                      <td className="px-4 py-3 text-[12px]">
                                        <input type="number" value={p.inventoryQty} readOnly={isView} onChange={(e) => updateProduct(req.id, p.id, { inventoryQty: Number(e.target.value) })} className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 ${isView ? "cursor-default" : ""}`} placeholder="0" />
                                      </td>
                                      <td className="px-4 py-3 text-[12px] relative font-bold text-[#00529C]">
                                        <input type="number" value={p.exportQty} readOnly={isView} onChange={(e) => updateProduct(req.id, p.id, { exportQty: Number(e.target.value), totalPrice: Number(e.target.value) * p.exportPrice })} className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 ${isView ? "cursor-default" : ""}`} placeholder="0" />
                                        {!isView && <Edit2 size={10} className="absolute right-2 top-4 text-gray-300 opacity-0 group-hover/row:opacity-100" />}
                                      </td>
                                      <td className="px-4 py-3 text-[12px] text-gray-400">{p.serialNumberExport}</td>
                                      <td className="px-4 py-3 text-[12px] text-gray-400">{p.serialNumberImport}</td>
                                      <td className="px-4 py-3 text-[12px]">
                                        <div className="flex items-center gap-3">
                                          {!isView && (
                                            <button onClick={() => removeProduct(req.id, p.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Xóa dòng">
                                              <Trash2 size={16} />
                                            </button>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={14} className="px-4 py-12 text-center text-gray-400 text-[12px]">
                                      <div className="flex flex-col items-center gap-2">
                                        <Package size={24} className="opacity-20" />
                                        <span>Chưa có dữ liệu sản phẩm trong đề nghị này.</span>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>

                          {!isView && (
                            <button 
                              onClick={() => addProduct(req.id)}
                              className="flex items-center gap-1 text-[12px] font-bold text-[#00529C] hover:underline"
                            >
                              <Plus size={14} /> Thêm sản phẩm
                            </button>
                          )}

                          <div className="flex flex-col gap-1 items-end mt-4 pt-4 border-t border-gray-100">
                             <div className="flex items-center gap-2 text-[12px]">
                               <span className="text-gray-500">Tổng số lượng</span>
                               <span className="font-bold text-[#002D56]">{req.products.reduce((acc, p) => acc + p.exportQty, 0)}</span>
                             </div>
                          </div>
                        </div>

                        {/* Subsection: Dữ liệu báo cáo */}
                        <div className="space-y-4 pt-6 border-t border-gray-100">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <ChevronDown size={14} className="text-[#00529C]" />
                              <span className="text-[13px] font-bold text-[#002D56] uppercase">
                                Dữ liệu báo cáo
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              {!isView && (
                                <button onClick={() => triggerToast("Export Dữ liệu báo cáo...")} className="flex items-center gap-1.5 text-[12px] font-bold text-[#00529C] px-3 py-1.5 border border-[#00529C] rounded hover:bg-blue-50">
                                  <Download size={14} />
                                  Export
                                </button>
                              )}
                              {!isView && (
                                <button onClick={() => { setImportConfig({ requestId: req.id, section: "report" }); setShowImportModal(true); }} className="flex items-center gap-1.5 text-[12px] font-bold text-[#00529C] px-3 py-1.5 border border-[#00529C] rounded hover:bg-blue-50">
                                  <FilePlus size={14} />
                                  Import
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-[400px]">
                            <table className="w-max min-w-full text-left border-collapse table-fixed">
                              <thead>
                                <tr className="bg-[#F8FAFC]">
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[50px]">No</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[120px]">Mã sản phẩm</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[250px]">Tên sản phẩm</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[150px]">PS</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[100px]">Đơn vị tính</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[100px]">Số lượng</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[120px] bg-orange-50 font-black">Ngày hóa đơn</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[150px] bg-orange-50 font-black">Số Hóa đơn tham chiếu</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[120px] bg-orange-50 font-black">Mã Khách hàng</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[150px] bg-orange-50 font-black">Tên Khách hàng</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[150px] bg-orange-50 font-black">Bill To Location</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[200px] bg-orange-50 font-black">Bill To Address</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[100px] bg-orange-50 font-black">ZIP Code (Bill)</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[120px] bg-orange-50 font-black">Tỉnh thành (Bill)</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[100px] bg-orange-50 font-black">Quốc gia (Bill)</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[150px] bg-orange-50 font-black">Ship To Location</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[200px] bg-orange-50 font-black">Ship To Address</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[100px] bg-orange-50 font-black">ZIP Code (Ship)</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[120px] bg-orange-50 font-black">Tỉnh thành (Ship)</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[100px] bg-orange-50 font-black">Quốc gia (Ship)</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-[#002B49] uppercase border-b border-gray-200 w-[150px] bg-orange-50 font-black">Số SN/IMEI</th>
                                </tr>
                              </thead>
                              <tbody>
                                {req.reportData.length > 0 ? (
                                  req.reportData.map((rd, rdIdx) => (
                                    <tr key={rd.id} className="hover:bg-gray-50 border-b border-gray-100 group/row">
                                      <td className="px-4 py-3 text-[12px] font-medium">{String(rdIdx + 1).padStart(2, '0')}</td>
                                      <td className="px-4 py-3 text-[12px]">{rd.itemCode}</td>
                                      <td className="px-4 py-3 text-[12px] whitespace-normal break-words leading-relaxed">{rd.itemName}</td>
                                      <td className="px-4 py-3 text-[12px] whitespace-normal break-words leading-relaxed">{rd.ps}</td>
                                      <td className="px-4 py-3 text-[12px]">{rd.unit}</td>
                                      <td className="px-4 py-3 text-[12px]">
                                        <input type="number" value={rd.qty || ""} readOnly={isView} onChange={(e) => updateReportData(req.id, rd.id, { qty: Number(e.target.value), totalPrice: Number(e.target.value) * rd.unitPrice })} className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 text-[#00529C] ${isView ? "cursor-default" : ""}`} placeholder="0" />
                                      </td>
                                      <td className={`px-4 py-3 text-[12px] bg-orange-50/50`}>
                                        <input type="text" value={rd.invoiceDate || ""} readOnly={isView} onChange={(e) => updateReportData(req.id, rd.id, { invoiceDate: e.target.value })} className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 text-[#00529C] ${isView ? "cursor-default" : ""}`} placeholder="DD/MM/YYYY" />
                                      </td>
                                      <td className={`px-4 py-3 text-[12px] bg-orange-50/50`}>
                                        <input type="text" value={rd.refInvoiceNumber || ""} readOnly={isView} onChange={(e) => updateReportData(req.id, rd.id, { refInvoiceNumber: e.target.value })} className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 text-[#00529C] ${isView ? "cursor-default" : ""}`} placeholder="Nhập số HĐ" />
                                      </td>
                                      <td className={`px-4 py-3 text-[12px] bg-orange-50/50`}>
                                        <input type="text" value={rd.customerId || ""} readOnly={isView} onChange={(e) => updateReportData(req.id, rd.id, { customerId: e.target.value })} className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 ${isView ? "cursor-default" : ""}`} placeholder="Nhập mã KH" />
                                      </td>
                                      <td className={`px-4 py-3 text-[12px] bg-orange-50/50`}>
                                        <input type="text" value={rd.customerName || ""} readOnly={isView} onChange={(e) => updateReportData(req.id, rd.id, { customerName: e.target.value })} className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 ${isView ? "cursor-default" : ""}`} placeholder="Nhập tên KH" />
                                      </td>
                                      <td className={`px-4 py-3 text-[12px] bg-orange-50/50`}>
                                        <input type="text" value={rd.billToLocation || ""} readOnly={isView} onChange={(e) => updateReportData(req.id, rd.id, { billToLocation: e.target.value })} className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 ${isView ? "cursor-default" : ""}`} placeholder="Nhập LOC" />
                                      </td>
                                      <td className={`px-4 py-3 text-[12px] bg-orange-50/50`}>
                                        <input type="text" value={rd.billToAddress || ""} readOnly={isView} onChange={(e) => updateReportData(req.id, rd.id, { billToAddress: e.target.value })} className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 ${isView ? "cursor-default" : ""}`} placeholder="Nhập Address" />
                                      </td>
                                      <td className={`px-4 py-3 text-[12px] bg-orange-50/50`}>
                                        <input type="text" value={rd.zipCode || ""} readOnly={isView} onChange={(e) => updateReportData(req.id, rd.id, { zipCode: e.target.value })} className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 ${isView ? "cursor-default" : ""}`} placeholder="ZIP" />
                                      </td>
                                      <td className={`px-4 py-3 text-[12px] bg-orange-50/50`}>
                                        <input type="text" value={rd.city || ""} readOnly={isView} onChange={(e) => updateReportData(req.id, rd.id, { city: e.target.value })} className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 ${isView ? "cursor-default" : ""}`} placeholder="Tỉnh thành" />
                                      </td>
                                      <td className={`px-4 py-3 text-[12px] bg-orange-50/50`}>
                                        <input type="text" value={rd.country || ""} readOnly={isView} onChange={(e) => updateReportData(req.id, rd.id, { country: e.target.value })} className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 ${isView ? "cursor-default" : ""}`} placeholder="Quốc gia" />
                                      </td>
                                      <td className={`px-4 py-3 text-[12px] bg-orange-50/50`}>
                                        <input type="text" value={rd.shipToLocation || ""} readOnly={isView} onChange={(e) => updateReportData(req.id, rd.id, { shipToLocation: e.target.value })} className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 ${isView ? "cursor-default" : ""}`} placeholder="Nhập Ship LOC" />
                                      </td>
                                      <td className={`px-4 py-3 text-[12px] bg-orange-50/50`}>
                                        <input type="text" value={rd.shipToAddress || ""} readOnly={isView} onChange={(e) => updateReportData(req.id, rd.id, { shipToAddress: e.target.value })} className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 ${isView ? "cursor-default" : ""}`} placeholder="Nhập Ship Address" />
                                      </td>
                                      <td className={`px-4 py-3 text-[12px] bg-orange-50/50`}>
                                        <input type="text" value={rd.shipToZipCode || ""} readOnly={isView} onChange={(e) => updateReportData(req.id, rd.id, { shipToZipCode: e.target.value })} className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 ${isView ? "cursor-default" : ""}`} placeholder="ZIP" />
                                      </td>
                                      <td className={`px-4 py-3 text-[12px] bg-orange-50/50`}>
                                        <input type="text" value={rd.shipToCity || ""} readOnly={isView} onChange={(e) => updateReportData(req.id, rd.id, { shipToCity: e.target.value })} className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 ${isView ? "cursor-default" : ""}`} placeholder="Tỉnh thành" />
                                      </td>
                                      <td className={`px-4 py-3 text-[12px] bg-orange-50/50`}>
                                        <input type="text" value={rd.shipToCountry || ""} readOnly={isView} onChange={(e) => updateReportData(req.id, rd.id, { shipToCountry: e.target.value })} className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 ${isView ? "cursor-default" : ""}`} placeholder="Quốc gia" />
                                      </td>
                                      <td className={`px-4 py-3 text-[12px] bg-orange-50/50`}>
                                        <input type="text" value={rd.serialNumber || ""} readOnly={isView} onChange={(e) => updateReportData(req.id, rd.id, { serialNumber: e.target.value })} className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 ${isView ? "cursor-default" : ""}`} placeholder="Nhập Serial" />
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={21} className="px-4 py-12 text-center text-gray-400 text-[12px]">
                                      <div className="flex flex-col items-center gap-2">
                                        <FileText size={24} className="opacity-20" />
                                        <span>Dữ liệu báo cáo chưa được khởi tạo. Nhấn "Tạo dữ liệu báo cáo" để bắt đầu.</span>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>

                          <div className="flex flex-col gap-1 items-end mt-4 pt-4 border-t border-gray-100">
                             <div className="flex items-center gap-2 text-[12px]">
                               <span className="text-gray-500">Tổng số lượng</span>
                               <span className="font-bold text-[#002D56]">{req.reportData.reduce((acc, rd) => acc + (rd.qty || 0), 0)}</span>
                             </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {localMode === "create" && (
            <button
              onClick={addRequest}
              className="w-full py-4 border-2 border-dashed border-[#00529C]/30 rounded-lg flex items-center justify-center gap-2 text-[#00529C] font-bold text-[14px] hover:bg-blue-50 transition-all hover:border-[#00529C]/50 bg-white shadow-sm"
            >
              <Plus size={18} />
              Thêm đề nghị xuất kho mới
            </button>
          )}
        </div>

          {/* Feedback Sections - Display in view mode */}
          {localMode === "view" && (
            <div className="space-y-6">
              {/* BD Feedback */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-[#FCFDFF] border-b border-gray-100 flex items-center gap-2 cursor-pointer">
                  <div className="w-5 h-5 rounded-full border border-[#00529C] flex items-center justify-center">
                    <ChevronDown size={12} className="text-[#00529C]" />
                  </div>
                  <span className="text-[14px] font-bold text-[#002D56] font-sans tracking-wide">
                    Thông tin phản hồi từ BD
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <label className="text-[13px] font-semibold text-gray-600 italic">
                    Lý do
                  </label>
                  <textarea
                    rows={4}
                    readOnly={!isApproveMode}
                    placeholder="Nhập lý do phản hồi..."
                    className="w-full p-4 bg-[#EDF2F7]/50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-[#00529C] resize-none text-gray-700"
                  ></textarea>
                </div>
              </div>

              {/* PM Head Feedback */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-[#FCFDFF] border-b border-gray-100 flex items-center gap-2 cursor-pointer">
                  <div className="w-5 h-5 rounded-full border border-[#00529C] flex items-center justify-center">
                    <ChevronDown size={12} className="text-[#00529C]" />
                  </div>
                  <span className="text-[14px] font-bold text-[#002D56] font-sans tracking-wide">
                    Thông tin phản hồi từ PM Head
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <label className="text-[13px] font-semibold text-gray-600 italic">
                    Lý do
                  </label>
                  <textarea
                    rows={4}
                    readOnly={!isApproveMode}
                    placeholder="Nhập lý do phản hồi..."
                    className="w-full p-4 bg-[#EDF2F7]/50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-[#00529C] resize-none text-gray-700"
                  ></textarea>
                </div>
              </div>

              {/* Adjustment History */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-8">
                <div className="px-4 py-3 bg-[#FCFDFF] border-b border-gray-100 flex items-center gap-2 cursor-pointer relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00529C]" />
                  <div className="w-5 h-5 rounded-full border border-[#00529C] flex items-center justify-center">
                    <ChevronDown size={12} className="text-[#00529C]" />
                  </div>
                  <span className="text-[14px] font-bold text-[#002D56] font-sans tracking-wide">
                    Lịch sử dữ liệu điều chỉnh
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-gray-100">
                        <th className="px-6 py-4 text-[13px] font-bold text-[#002D56] font-sans">
                          Người thực hiện
                        </th>
                        <th className="px-6 py-4 text-[13px] font-bold text-[#002D56] font-sans">
                          Thời gian thực hiện
                        </th>
                        <th className="px-6 py-4 text-[13px] font-bold text-[#002D56] font-sans">
                          Hành động
                        </th>
                        <th className="px-6 py-4 text-[13px] font-bold text-[#002D56] font-sans">
                          Chi tiết
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyData.map((h, i) => (
                        <tr
                          key={i}
                          className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#002D56] flex items-center justify-center text-white text-[12px] font-bold">
                              {h.user.charAt(0)}
                            </div>
                            <span className="text-[13px] font-semibold text-gray-700">
                              {h.user}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[13px] text-gray-500">
                            {h.time}
                          </td>
                          <td className="px-6 py-4 text-[13px] text-gray-700 font-medium">
                            {h.action}
                          </td>
                          <td className="px-6 py-4 text-[13px] text-gray-500 italic">
                            {h.detail}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Serial Import Modal */}
        <AnimatePresence>
          {showSerialModal && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSerialModal(false)}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-xl shadow-2xl z-20 w-full max-w-lg overflow-hidden border border-gray-100 relative"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[18px] font-bold text-[#002D56] font-sans flex items-center gap-2">
                      <FilePlus size={20} className="text-[#00529C]" />
                      Import danh sách Serial
                    </h2>
                    <button
                      onClick={() => setShowSerialModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {serialImportStatus === "idle" ? (
                      <>
                        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 text-[13px] text-blue-800">
                          <p className="font-semibold mb-1">
                            Dành cho line hàng: {currentImportingRow}
                          </p>
                          <p>
                            Vui lòng tải lên file Excel chứa danh sách
                            Serial/IMEI cho sản phẩm này.
                          </p>
                        </div>

                        <div
                          onClick={() => startSerialSimulation("error")}
                          className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center gap-4 bg-gray-50 transition-all hover:bg-gray-100 hover:border-[#00529C]/30 cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#00529C]">
                            <Upload size={24} />
                          </div>
                          <div className="text-center">
                            <p className="text-[14px] font-bold text-gray-700">
                              Tải lên danh sách Serial
                            </p>
                            <p className="text-[12px] text-gray-400 mt-1">
                              Kéo thả file hoặc click để thử nghiệm (Lỗi)
                            </p>
                          </div>
                        </div>

                        <div
                          onClick={() => startSerialSimulation("success")}
                          className="mt-2 border-2 border-dashed border-blue-200 rounded-xl p-8 flex flex-col items-center justify-center gap-4 bg-blue-50/20 transition-all hover:bg-blue-50/40 hover:border-[#00529C]/30 cursor-pointer text-center"
                        >
                          <p className="text-[13px] font-bold text-[#00529C]">
                            Dành cho kiểm thử: Click tại đây để Import Thành
                            công
                          </p>
                        </div>
                      </>
                    ) : serialImportStatus === "uploading" ? (
                      <div className="py-12 flex flex-col items-center justify-center">
                        <RefreshCcw
                          size={40}
                          className="text-[#00529C] animate-spin mb-4"
                        />
                        <p className="text-[14px] font-medium text-gray-600">
                          Đang kiểm tra danh sách serial...
                        </p>
                      </div>
                    ) : (
                      <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-center">
                        <X size={40} className="text-red-500 mx-auto mb-3" />
                        <h4 className="text-[15px] font-bold text-red-700 mb-2">
                          Lỗi danh mục Serial!
                        </h4>
                        <p className="text-[13px] text-red-600 mb-4">
                          Có 5 số Serial không tồn tại trong kho hoặc đã được
                          xuất bán. Vui lòng tải file lỗi để kiểm tra và upload
                          lại.
                        </p>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() =>
                              triggerToast("Đang tải tệp tin lỗi...")
                            }
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-[13px] font-bold hover:bg-red-200 transition-colors"
                          >
                            <Download size={14} />
                            Tải file Serial lỗi (serials_error.xlsx)
                          </button>
                          <button
                            onClick={() => setSerialImportStatus("idle")}
                            className="mt-2 text-[12px] text-gray-500 hover:text-gray-700 underline"
                          >
                            Thử tải lại file khác
                          </button>
                        </div>
                      </div>
                    )}

                    {serialImportStatus === "idle" && (
                      <div className="flex justify-center border-t border-gray-100 pt-6 gap-3">
                        <button
                          onClick={() => setShowSerialModal(false)}
                          className="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg text-[13px] font-bold hover:bg-gray-50 transition-all font-sans"
                        >
                          Hủy bỏ
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-[#002D56] text-white rounded-full shadow-2xl flex items-center gap-3 border border-blue-400/30 backdrop-blur-sm"
            >
              <CheckCircle2 size={18} className="text-green-400" />
              <span className="text-[14px] font-medium">{toastMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Import Modal */}
        <AnimatePresence>
          {showImportModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowImportModal(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-[800px] bg-white rounded-xl shadow-2xl overflow-hidden"
              >
                {/* Modal Header */}
                <div className="px-6 py-5 flex justify-between items-center border-b border-gray-100">
                  <h2 className="text-[20px] font-bold text-[#002D56] font-sans">
                    Import dữ liệu
                  </h2>
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-8">
                  {/* Modal Content */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-[15px] font-bold text-[#002D56] mb-1">
                        Tải lên file dữ liệu
                      </h3>
                      <p className="text-[13px] text-gray-500">
                        Nạp file dữ liệu. Hệ thống sẽ tự động đối soát và map
                        các giao dịch
                      </p>
                    </div>

                    {importStatus === "uploading" ? (
                      <div className="border-2 border-gray-100 rounded-xl bg-gray-50 py-16 flex flex-col items-center justify-center">
                        <RefreshCcw
                          size={40}
                          className="text-[#00529C] animate-spin mb-4"
                        />
                        <p className="text-[14px] font-medium text-gray-600">
                          Đang xử lý dữ liệu (45%)...
                        </p>
                      </div>
                    ) : importStatus === "error" ? (
                      <div className="border-2 border-red-100 rounded-xl bg-red-50 p-6 flex flex-col items-center justify-center text-center">
                        <X size={40} className="text-red-500 mb-2" />
                        <h4 className="text-[15px] font-bold text-red-700 mb-1">
                          Import thất bại!
                        </h4>
                        <p className="text-[13px] text-red-600 mb-4">
                          Các sản phẩm trong file không khớp với danh mục của
                          hãng. Vui lòng kiểm tra lại file lỗi.
                        </p>
                        <button
                          onClick={() =>
                            triggerToast("Đang tải file log lỗi...")
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-md text-[13px] font-bold hover:bg-red-200"
                        >
                          <Download size={14} />
                          Tải file lỗi hệ thống
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => startSimulation("success")}
                        className="border-2 border-dashed border-gray-200 rounded-xl bg-[#F8FAFC] py-12 flex flex-col items-center justify-center cursor-pointer hover:border-[#00529C] hover:bg-[#F1F5F9] transition-all group"
                      >
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <FilePlus
                              size={24}
                              className="text-gray-400 group-hover:text-[#00529C]"
                            />
                          </div>
                        </div>
                        <p className="text-[13px] text-gray-500 font-medium">
                          Bấm để{" "}
                          <span className="text-[#00529C] underline">
                            Upload thành công
                          </span>
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startSimulation("error");
                          }}
                          className="mt-4 text-[11px] text-red-400 hover:underline"
                        >
                          (Giả lập trường hợp lỗi tại đây)
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setImportStatus("idle");
                      setShowImportModal(false);
                    }}
                    className="px-6 py-2 border border-[#00529C] text-[#00529C] rounded-md text-[14px] font-bold hover:bg-white transition-all flex items-center gap-2"
                  >
                    Quay lại
                  </button>
                  <button
                    disabled={importStatus === "uploading"}
                    onClick={() => startSimulation("success")}
                    className={`px-6 py-2 rounded-md text-[14px] font-bold transition-all ${
                      importStatus === "uploading"
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#00529C] text-white hover:bg-[#00427D]"
                    }`}
                  >
                    Upload Dữ liệu
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        {/* Serial Detail Modal */}
        <AnimatePresence>
          {showSerialDetailModal && currentSerialDetailRow && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSerialDetailModal(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden m-4"
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#FCFDFF]">
                  <h2 className="text-[20px] font-bold text-[#002D56] font-sans">
                    Chi tiết sản phẩm
                  </h2>
                  <button
                    onClick={() => setShowSerialDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto">
                  <div className="border border-gray-200 rounded-xl p-5 mb-6 bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[18px] font-bold text-[#002D56]">
                        {currentSerialDetailRow.itemCode}
                      </span>
                      <span className="px-2 py-0.5 bg-[#F8FAFC] border border-gray-200 text-gray-500 text-[11px] rounded uppercase font-medium">
                        SN/IMEI
                      </span>
                    </div>
                    <p className="text-[14px] text-gray-700 mb-5">
                      {currentSerialDetailRow.itemName}
                    </p>
                    <div className="border-t border-dashed border-gray-200 pt-4 pb-1">
                      <span className="text-[13px] text-gray-600 font-medium tracking-wide">
                        SL đã import:{" "}
                      </span>
                      <span className="text-[16px] font-bold text-gray-900 ml-1">
                        {currentSerialDetailRow.reportQty}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-[15px] font-bold text-[#002D56] mb-4">
                    Danh sách SN/IMEI hàng lỗi
                  </h3>

                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-6 py-3.5 text-[13px] font-semibold text-[#002B49] w-[80px]">
                            No
                          </th>
                          <th className="px-6 py-3.5 text-[13px] font-semibold text-[#002B49]">
                            SN/IMEI
                          </th>
                          <th className="px-6 py-3.5 text-[13px] font-semibold text-[#002B49] w-[150px]">
                            Trạng thái
                          </th>
                          <th className="px-6 py-3.5 text-[13px] font-semibold text-[#002B49]">
                            Ghi chú tình trạng hàng
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({
                          length: Number(currentSerialDetailRow.reportQty) || 1,
                        }).map((_, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-100 last:border-b-0 hover:bg-[#F8FAFC]"
                          >
                            <td className="px-6 py-3.5 text-[13px] text-gray-600">
                              {String(index + 1).padStart(2, "0")}
                            </td>
                            <td className="px-6 py-3.5 text-[13px] text-gray-900 font-medium">
                              863234070596{String(987 + index)}
                            </td>
                            <td className="px-6 py-3.5 text-[13px] text-gray-600">
                              Tốt
                            </td>
                            <td className="px-6 py-3.5 text-[13px] text-gray-600">
                              ---
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-end bg-[#FCFDFF]">
                  <button
                    onClick={() => setShowSerialDetailModal(false)}
                    className="px-6 py-2 border border-[#00529C] text-[#00529C] font-bold rounded-md hover:bg-[#F0F7FF] transition-colors text-[14px]"
                  >
                    Đóng
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        {/* Action Confirmation Modals */}
        <AnimatePresence>
          {(showApproveConfirm || showRejectConfirm) && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              >
                <div className="p-6 text-center space-y-4">
                  <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${showRejectConfirm ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-[#00529C]'}`}>
                    {showRejectConfirm ? <XCircle size={32} /> : <CheckCircle2 size={32} />}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#002D56]">
                      {showRejectConfirm ? 'Xác nhận từ chối' : 'Xác nhận phê duyệt'}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {showRejectConfirm 
                        ? 'Bạn có chắc chắn muốn từ chối đề nghị báo cáo này không?' 
                        : 'Bạn có chắc chắn muốn phê duyệt đề nghị báo cáo này không?'}
                    </p>
                  </div>

                  {showRejectConfirm && (
                    <div className="mt-4 text-left space-y-2">
                      <label className="text-[13px] font-semibold text-gray-700">
                        Lý do từ chối <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Nhập lý do từ chối..."
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      />
                    </div>
                  )}
                </div>

                <div className="p-6 bg-gray-50 flex gap-3">
                  <button
                    onClick={() => {
                      setShowApproveConfirm(false);
                      setShowRejectConfirm(false);
                      setReason("");
                    }}
                    className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      if (showRejectConfirm) {
                        if (!reason.trim()) {
                          triggerToast("Vui lòng nhập lý do từ chối!");
                          return;
                        }
                        handleActionWithBack("Đã từ chối đề nghị báo cáo.");
                      } else {
                        handleActionWithBack("Phê duyệt đề nghị báo cáo thành công!");
                      }
                      setShowApproveConfirm(false);
                      setShowRejectConfirm(false);
                      setReason("");
                    }}
                    className={`flex-1 py-3 px-4 text-white rounded-xl font-bold text-sm transition-opacity ${showRejectConfirm ? 'bg-red-500 hover:bg-red-600' : 'bg-[#00529C] hover:bg-[#00427D]'}`}
                  >
                    Xác nhận
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
}
