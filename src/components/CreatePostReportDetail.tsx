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
  Loader2,
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
  uom: string;
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
  transactionType: string;
  changeType?: "add" | "update" | "delete";
  originalData?: Partial<TableRow>;
}

const NEW_COLUMNS: { key: keyof TableRow; label: string }[] = [
  { key: "itemCode", label: "Mã sản phẩm" },
  { key: "itemName", label: "Tên sản phẩm" },
  { key: "ps", label: "PS" },
  { key: "uom", label: "Đơn vị tính" },
  { key: "reportQty", label: "Số lượng" },
  { key: "reportInvoiceDate", label: "Ngày hóa đơn" },
  { key: "reportInvoiceNumber", label: "Mã hóa đơn" },
  { key: "reportCustomerId", label: "Mã khách hàng" },
  { key: "reportCustomerName", label: "Tên khách hàng" },
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
  { key: "transactionType", label: "Transaction Type" },
  { key: "serialNumber", label: "Số SN/IMEI" },
];

const LEDGER_COLUMNS: { key: keyof TableRow; label: string }[] = [
  { key: "itemCode", label: "Mã sản phẩm" },
  { key: "partNumber", label: "Part Number" },
  { key: "itemName", label: "Tên sản phẩm" },
  { key: "brand", label: "Hãng" },
  { key: "ps", label: "PS" },
  { key: "uom", label: "Đơn vị tính" },
  { key: "reportQty", label: "Số lượng" },
  { key: "reportInvoiceDate", label: "Ngày hóa đơn" },
  { key: "reportInvoiceNumber", label: "Mã hóa đơn" },
  { key: "reportCustomerId", label: "Mã khách hàng" },
  { key: "reportCustomerName", label: "Tên khách hàng" },
  { key: "serialNumber", label: "Số SN/IMEI" },
];

const MOCK_OPTIONS = {
  companies: ["FDCHN", "FDCHCM", "FDCĐN", "FDCTH"],
  brands: ["APPLE", "SAMSUNG", "XIAOMI", "DELL", "HP", "LENOVO"],
  ps: ["SMARTPHONE", "LAPTOP", "TABLET", "ACCESSORIES"],
  products: ["iPhone 13", "iPhone 14", "Galaxy S22", "Redmi Note 11"],
  partNumbers: ["MZB0ARHEU", "PART-001", "PART-002"],
  customers: ["HÀ DUY", "ĐIỆN MÁY XANH", "THẾ GIỚI DI ĐỘNG"],
  cpuBrands: ["Intel", "AMD", "Apple Silicon", "MediaTek"],
  osTypes: ["Windows", "Mac OS", "Linux", "Android", "iOS"],
  warehouseTypes: ["Kho báo cáo", "Kho không báo cáo"],
  businessCenters: ["FHO Other HN", "FHO Other HCM", "FHO HN", "FHO HCM"]
};

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
  ps: "SPXMI - SMART PHONE XIAOMI",
  itemCode: "70281468",
  partNumber: "MZB0ARHEU",
  itemName: "Điện thoại di động Redmi Note 11 Pro Polar White 8GB RAM 128GB ROM (2201116TG)_MZB0ARHEU",
  model: "Redmi Note 11 Pro",
  uom: "Cái",
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
  transactionType: "SnS",
};

const tableData: TableRow[] = Array.from({ length: 15 }, (_, i) => ({
  id: `L-00${i + 1}`,
  ...mockCommonFields,
  reportInvoiceNumber: `${167285 + i}`,
  reportQty: String(10 + i),
}));

const importChangesMock: TableRow[] = [
  {
    id: "L-001",
    ...mockCommonFields,
    reportCustomerId: "219748",
    reportCustomerName: "CÔNG TY TNHH CÔNG NGHỆ HÀ DUY",
    reportTaxId: "0402226769",
    changeType: "update",
    originalData: {
      reportCustomerId: "219747",
      reportCustomerName: "CÔNG TY TNHH ĐIỆN MÁY XANH",
      reportTaxId: "0402226768",
    },
  },
  {
    id: "L-005",
    ...mockCommonFields,
    reportInvoiceDate: "25/07/2026",
    reportInvoiceNumber: "INV-DELAY-001",
    changeType: "delete", // We'll interpret delete as "red" in highlighting if needed, or use a new type
  },
  {
    id: "L-006",
    ...mockCommonFields,
    reportInvoiceDate: "25/08/2026",
    reportInvoiceNumber: "INV-DELAY-002",
    changeType: "delete",
  },
  {
    id: "L-NEW-001",
    ...mockCommonFields,
    reportInvoiceNumber: "INV-NEW-001",
    changeType: "add",
  },
  {
    id: "L-NEW-002",
    ...mockCommonFields,
    reportInvoiceNumber: "INV-NEW-002",
    changeType: "add",
  },
  {
    id: "L-NEW-003",
    ...mockCommonFields,
    reportInvoiceNumber: "INV-NEW-003",
    changeType: "add",
  },
];

export default function CreatePostReportDetail({
  category,
  onBack,
  onTypeChange,
  onCategoryChange,
}: {
  category: "quantity" | "serial";
  onBack: () => void;
  onTypeChange?: (type: "pre" | "post") => void;
  onCategoryChange?: (cat: "quantity" | "serial") => void;
}) {
  const [reportDates, setReportDates] = useState({
    startDate: "",
    endDate: "",
  });
  
  const [generalFilters, setGeneralFilters] = useState({
    reportType: "post",
    company: [] as string[],
    businessCenter: [] as string[],
    brand: [] as string[],
    ps: [] as string[],
    product: [] as string[],
    partNumber: [] as string[],
    customer: [] as string[],
    invoiceNumber: "",
    warehouseType: "",
    cpuBrand: [] as string[],
    osType: [] as string[],
  });
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showSnModal, setShowSnModal] = useState(false);
  const [selectedSnRow, setSelectedSnRow] = useState<TableRow | null>(null);

  const validateGeneralInfo = () => {
    const errors: Record<string, string> = {};
    if (!generalFilters.reportType) errors.reportType = "Vui lòng chọn hình thức báo cáo";
    if (!reportDates.startDate) errors.startDate = "Vui lòng chọn ngày bắt đầu";
    if (!reportDates.endDate) errors.endDate = "Vui lòng chọn ngày kết thúc";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const type = "post" as string;
  const mode = "create" as string;
  const isApproveMode = false;
  const [activeTab, setActiveTab] = useState("ledger");
  const [showHighlight, setShowHighlight] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStatus, setImportStatus] = useState<
    "idle" | "uploading" | "error"
  >("idle");
  const [hasImportedData, setHasImportedData] = useState(mode === "view");
  const [didFreshImport, setDidFreshImport] = useState(false);
  const [importType, setImportType] = useState<"success" | "error" | "idle">("idle");

  // Stateful data for editing
  const [rows, setRows] = useState<TableRow[]>(() => {
    if (mode === "create") {
      return tableData.map((r, idx) => {
        const newRow = { ...r };
        // Generate mock data for invoice fields if they are empty
        newRow.reportInvoiceDate = `1${idx + 1}/05/2026`;
        newRow.reportInvoiceNumber = `INV-2026-${1000 + idx}`;
        newRow.reportCustomerId = `CUST-${2000 + idx}`;
        newRow.reportCustomerName = `Khách hàng ${idx + 1}`;
        newRow.serialNumber = "SN123456789";

        NEW_COLUMNS.slice(5).forEach(col => {
          if (!["reportInvoiceDate", "reportInvoiceNumber", "reportCustomerId", "reportCustomerName", "serialNumber"].includes(col.key)) {
            (newRow as any)[col.key] = "";
          }
        });
        return newRow;
      });
    }
    return tableData;
  });

  // Advanced Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tableSearchTerm, setTableSearchTerm] = useState("");
  const [showImportFormModal, setShowImportFormModal] = useState(false);

  const [importSimulationState, setImportSimulationState] = useState<{
    status: "idle" | "uploading" | "success" | "error";
    progress: number;
  }>({ status: "idle", progress: 0 });

  const startImportSimulation = (type: "success" | "error") => {
    setImportSimulationState({ status: "uploading", progress: 0 });
    const interval = setInterval(() => {
      setImportSimulationState(prev => {
        if (prev.progress >= 100) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, progress: prev.progress + 10 };
      });
    }, 200);

    setTimeout(() => {
      if (type === "success") {
        setImportSimulationState({ status: "success", progress: 100 });
        setTimeout(() => {
          setHasImportedData(true);
          setDidFreshImport(true);
          setShowImportFormModal(false);
          setActiveTab("import");
          triggerToast("Import dữ liệu thành công!");
        }, 500);
      } else {
        setImportSimulationState({ status: "error", progress: 80 });
      }
    }, 2500);
  };
  const [tableFilters, setTableFilters] = useState({
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

  const resetTableFilters = () => {
    setTableSearchTerm("");
    setTableFilters({
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
    if (!data) return [];
    return data.filter((item) => {
      const matchesSearch =
        !tableSearchTerm ||
        (item.itemCode || "").toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        (item.itemName || "").toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        (item.reportInvoiceNumber || "")
          .toLowerCase()
          .includes(tableSearchTerm.toLowerCase()) ||
        (item.reportCustomerId || "")
          .toLowerCase()
          .includes(tableSearchTerm.toLowerCase()) ||
        (item.reportCustomerName || "")
          .toLowerCase()
          .includes(tableSearchTerm.toLowerCase());

      const matchesCustomerId =
        !tableFilters.reportCustomerId ||
        (item.reportCustomerId || "")
          .toLowerCase()
          .includes(tableFilters.reportCustomerId.toLowerCase());
      const matchesCustomerName =
        !tableFilters.reportCustomerName ||
        (item.reportCustomerName || "")
          .toLowerCase()
          .includes(tableFilters.reportCustomerName.toLowerCase());
      const matchesTaxId =
        !tableFilters.reportTaxId ||
        (item.reportTaxId || "")
          .toLowerCase()
          .includes(tableFilters.reportTaxId.toLowerCase());
      const matchesInvoiceDate =
        !tableFilters.reportInvoiceDate ||
        (item.reportInvoiceDate || "")
          .toLowerCase()
          .includes(tableFilters.reportInvoiceDate.toLowerCase());
      const matchesInvoiceNumber =
        !tableFilters.reportInvoiceNumber ||
        (item.reportInvoiceNumber || "")
          .toLowerCase()
          .includes(tableFilters.reportInvoiceNumber.toLowerCase());
      const matchesPs =
        !tableFilters.ps ||
        (item.ps || "").toLowerCase().includes(tableFilters.ps.toLowerCase());
      const matchesItemCode =
        !tableFilters.itemCode ||
        (item.itemCode || "")
          .toLowerCase()
          .includes(tableFilters.itemCode.toLowerCase());
      const matchesPartNumber =
        !tableFilters.partNumber ||
        (item.partNumber || "")
          .toLowerCase()
          .includes(tableFilters.partNumber.toLowerCase());
      const matchesItemName =
        !tableFilters.itemName ||
        (item.itemName || "")
          .toLowerCase()
          .includes(tableFilters.itemName.toLowerCase());

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
    if (activeTab === "ledger") return LEDGER_COLUMNS;
    return NEW_COLUMNS;
  }, [activeTab]);

  // Column Resizing State
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    () => {
      const initial: Record<string, number> = { no: 60 };
      const allPossibleCols = [...NEW_COLUMNS, ...LEDGER_COLUMNS];
      allPossibleCols.forEach((col) => {
        if (!initial[col.key]) {
          let baseWidth = col.key === "itemName" ? 250 : 120;
          const label = col.label || "";
          const estimated = Math.max(baseWidth, label.length * 9 + 40);
          initial[col.key] = estimated;
        }
      });
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
        setHasImportedData(true);
        setDidFreshImport(true);
        setActiveTab("import");
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
    if (!isApplied) return [];
    let baseData: TableRow[] = [];
    if (activeTab === "ledger") {
      baseData = rows;
    } else if (activeTab === "import") {
      baseData = hasImportedData
        ? showHighlight
          ? importChangesMock
          : importChangesMock.filter((i) => i.changeType !== "delete")
        : [];
    } else {
      baseData = hasImportedData ? getMergedData() : rows;
    }
    return applyFiltering(baseData);
  }, [
    activeTab,
    rows,
    isApplied,
    importChangesMock,
    hasImportedData,
    showHighlight,
    tableSearchTerm,
    tableFilters,
  ]);

  const updateRow = (id: string, field: keyof TableRow, value: string) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const renderCell = (row: TableRow, field: keyof TableRow) => {
    if (field === "serialNumber") {
      return (
        <button 
          onClick={() => {
            setSelectedSnRow(row);
            setShowSnModal(true);
          }}
          className="text-[#00529C] hover:underline flex items-center gap-1 font-medium"
        >
          Xem thông tin
          <ExternalLink size={12} />
        </button>
      );
    }

    if (field === "reportQty" && category === "serial") {
      return "1";
    }

    const colIdx = COLUMN_CONFIG.findIndex(c => c.key === field);
    if (mode === "create" && colIdx > 4) {
      return (
        <input
          type="text"
          value={String(row[field] || "")}
          placeholder={`Nhập ${COLUMN_CONFIG[colIdx].label}`}
          onChange={(e) => updateRow(row.id, field, e.target.value)}
          className="w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 text-[#00529C] placeholder-gray-300 italic"
        />
      );
    }

    const isChanged =
      row.changeType === "update" &&
      row.originalData &&
      row.originalData[field] !== undefined;

    if (showHighlight && isChanged) {
      return (
        <div className="flex flex-col">
          <span className="text-gray-400 line-through text-[10px] decoration-red-300">
            {row.originalData![field]}
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

  const currentStatus = mode === "create" ? "draft" : "bd_pending";

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
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded text-[12px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C] appearance-none"
            />
            <Calendar
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        ) : options ? (
          <div className="relative group">
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={`w-full px-3 py-1.5 bg-white border border-gray-300 rounded text-[12px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C] appearance-none ${!value ? "text-gray-400" : "text-gray-900"}`}
            >
              <option value="">{placeholder}</option>
              {options.map((opt: any) => (
                <option key={opt.id || opt} value={opt.name || opt}>
                  {opt.name || opt}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded text-[12px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C]"
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );

  const MultiSelectCustom = ({ 
    label, 
    options, 
    selected, 
    onChange, 
    placeholder = "Chọn...",
    required = false
  }: { 
    label: string; 
    options: string[]; 
    selected: string[]; 
    onChange: (vals: string[]) => void;
    placeholder?: string;
    required?: boolean;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside as any);
      return () => document.removeEventListener("mousedown", handleClickOutside as any);
    }, []);

    const toggleOption = (option: string) => {
      if (selected.includes(option)) {
        onChange(selected.filter(i => i !== option));
      } else {
        onChange([...selected, option]);
      }
    };

    return (
      <div className="flex flex-col gap-1.5 relative" ref={containerRef}>
        <label className="text-[13px] font-semibold text-[#4A5568]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3 py-2 bg-white border ${isOpen ? "border-[#00529C] ring-1 ring-[#00529C]" : "border-gray-300"} rounded-md text-[13px] focus:outline-none cursor-pointer flex justify-between items-center min-h-[38px] transition-all`}
        >
          <span className={selected.length === 0 ? "text-gray-400" : "text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap"}>
            {selected.length === 0 ? placeholder : selected.join(", ")}
          </span>
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[100] max-h-60 overflow-y-auto"
            >
              <div className="p-1">
                {options.map(opt => (
                  <div 
                    key={opt}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(opt);
                    }}
                    className="px-3 py-2 hover:bg-blue-50 flex items-center gap-2 cursor-pointer text-[13px] rounded transition-colors"
                  >
                    <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${selected.includes(opt) ? "bg-[#00529C] border-[#00529C]" : "border-gray-300 bg-white"}`}>
                      {selected.includes(opt) && <Check size={12} className="text-white" />}
                    </div>
                    <span className={selected.includes(opt) ? "font-semibold text-[#00529C]" : "text-gray-700"}>{opt}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const SNPopup = () => (
    <AnimatePresence>
      {showSnModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSnModal(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 bg-[#F8FAFC] border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#00529C]">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#002D56]">Thông tin số SN/IMEI</h3>
                  <p className="text-[12px] text-gray-500">Mã sản phẩm: {selectedSnRow?.itemCode}</p>
                </div>
              </div>
              <button onClick={() => setShowSnModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[12px] text-gray-500 block mb-1">Số SN/IMEI</span>
                  <span className="text-[14px] font-bold text-[#002D56]">{selectedSnRow?.serialNumber || "N/A"}</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[12px] text-gray-500 block mb-1">Mã hóa đơn</span>
                  <span className="text-[14px] font-bold text-[#002D56]">{selectedSnRow?.reportInvoiceNumber || "N/A"}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[13px] font-bold text-gray-700 flex items-center gap-2">
                  <History size={14} className="text-[#00529C]" />
                  Chi tiết thiết bị
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: "Tên sản phẩm", value: selectedSnRow?.itemName },
                    { label: "Hãng", value: selectedSnRow?.brand },
                    { label: "PS", value: selectedSnRow?.ps },
                    { label: "Đơn vị tính", value: selectedSnRow?.uom },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <span className="text-[13px] text-gray-500">{item.label}</span>
                      <span className="text-[13px] font-medium text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setShowSnModal(false)}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-[13px] font-bold hover:bg-gray-50 transition-all shadow-sm"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const ImportFormPopup = () => (
    <AnimatePresence>
      {showImportFormModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (importSimulationState.status !== "uploading") setShowImportFormModal(false);
            }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden"
          >
            <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-[#002D56]">Import dữ liệu báo cáo</h3>
              <button 
                onClick={() => setShowImportFormModal(false)}
                disabled={importSimulationState.status === "uploading"}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            <div className="p-6">
              {importSimulationState.status === "idle" || importSimulationState.status === "error" ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-blue-50/50 p-4 rounded-lg border border-blue-100/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-[#00529C] flex items-center justify-center text-white">
                        <Download size={20} />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-[#002D56]">Tải file mẫu</p>
                        <p className="text-[11px] text-gray-500">Sử dụng file excel mẫu của hệ thống</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => triggerToast("Đang tải file mẫu...")}
                      className="text-[12px] font-bold text-[#00529C] hover:underline"
                    >
                      Bấm để tải về
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[13px] font-bold text-[#002D56]">Chọn file từ máy tính <span className="text-red-500">*</span></label>
                    <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative group">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-400 mb-3 border border-gray-100 shadow-sm group-hover:text-[#00529C] transition-colors">
                        <Upload size={24} />
                      </div>
                      <span className="text-[13px] text-gray-600 font-medium">Click hoặc kéo thả file để tải lên</span>
                      <span className="text-[11px] text-gray-400 mt-1 italic">Hỗ trợ định dạng .xlsx, .xls</span>
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>

                  {importSimulationState.status === "error" && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
                      <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                      <p className="text-[12px] text-red-700">Dữ liệu trong file không hợp lệ. Vui lòng kiểm tra lại.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 space-y-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="60"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-100"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="60"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={376.99}
                        strokeDashoffset={376.99 * (1 - importSimulationState.progress / 100)}
                        fill="transparent"
                        className="text-[#00529C] transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[24px] font-bold text-[#002D56]">{importSimulationState.progress}%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[16px] font-bold text-[#002D56]">Đang tải lên dữ liệu...</p>
                    <p className="text-[12px] text-gray-500 mt-1">Vui lòng không đóng cửa sổ này</p>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setShowImportFormModal(false)}
                disabled={importSimulationState.status === "uploading"}
                className="px-6 py-2 border border-gray-300 text-gray-600 rounded text-[13px] font-bold hover:bg-gray-100 transition-all disabled:opacity-50"
              >
                Bỏ qua
              </button>
              <button 
                onClick={() => startImportSimulation("success")}
                disabled={importSimulationState.status === "uploading"}
                className="px-8 py-2 bg-[#00529C] text-white rounded text-[13px] font-bold hover:bg-[#00427D] transition-all shadow-md disabled:bg-gray-400"
              >
                {importSimulationState.status === "uploading" ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Đang xử lý
                  </div>
                ) : (
                  "Tải lên"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const showActionColumn = false;

  return (
    <div className="flex flex-col min-h-screen bg-[#F1F5F9]">
      <SNPopup />
      <ImportFormPopup />
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

          <div className="flex justify-between items-center pt-2">
            <h1 className="text-[24px] font-bold text-[#002D56] font-sans tracking-tight leading-tight">
              {mode === "create" ? "Tạo mới" : "Chi tiết"} đề nghị báo cáo{" "}
              {type === "pre" ? "(Báo cáo trước)" : "(Báo cáo sau)"}
            </h1>

            <div className="flex items-center gap-3">
              {mode === "create" && (
                <>
                  <button
                    onClick={() =>
                      handleActionWithBack("Lưu dự thảo thành công!")
                    }
                    className="px-4 py-2.5 border border-[#00529C] text-[#00529C] rounded-lg text-[13px] font-bold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Save size={16} />
                    Lưu Dự thảo
                  </button>
                  <button
                    onClick={() =>
                      handleActionWithBack("Trình duyệt báo cáo thành công!")
                    }
                    className="px-6 py-2.5 bg-[#00529C] text-white rounded-lg text-[13px] font-bold hover:bg-[#00427D] transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <CheckCircle2 size={16} />
                    Trình duyệt
                  </button>
                </>
              )}
            </div>
          </div>

          {mode === "create" ? (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <div className="w-1 h-5 bg-[#00529C] rounded-full" />
                <span className="text-[15px] font-bold text-[#002D56] uppercase tracking-wide">
                  Thông tin chung
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#4A5568]">
                    Hình thức báo cáo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <select
                      value={generalFilters.reportType}
                      onChange={(e) => {
                        setGeneralFilters(prev => ({ ...prev, reportType: e.target.value }));
                        if (onTypeChange) {
                          onTypeChange(e.target.value as "pre" | "post");
                        }
                      }}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-[13px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C] appearance-none"
                    >
                      <option value="pre">Báo cáo trước</option>
                      <option value="post">Báo cáo sau</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#00529C]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#4A5568]">
                    Kỳ báo cáo (từ ngày) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={reportDates.startDate}
                      onChange={(e) => {
                        setReportDates((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }));
                        if (e.target.value) setFormErrors(prev => ({ ...prev, startDate: "" }));
                      }}
                      className={`w-full px-3 py-1.5 bg-white border ${formErrors.startDate ? "border-red-500" : "border-gray-300"} rounded text-[12px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C] appearance-none`}
                    />
                    <Calendar
                      size={14}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                  {formErrors.startDate && <span className="text-red-500 text-[11px] mt-1">{formErrors.startDate}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#4A5568]">
                    Kỳ báo cáo (tới ngày) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={reportDates.endDate}
                      onChange={(e) => {
                        setReportDates((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }));
                        if (e.target.value) setFormErrors(prev => ({ ...prev, endDate: "" }));
                      }}
                      className={`w-full px-3 py-1.5 bg-white border ${formErrors.endDate ? "border-red-500" : "border-gray-300"} rounded text-[12px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C] appearance-none`}
                    />
                    <Calendar
                      size={14}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                  {formErrors.endDate && <span className="text-red-500 text-[11px] mt-1">{formErrors.endDate}</span>}
                </div>

                <MultiSelectCustom
                  label="Công ty"
                  options={MOCK_OPTIONS.companies}
                  selected={generalFilters.company}
                  onChange={(vals) => setGeneralFilters(prev => ({ ...prev, company: vals }))}
                  placeholder="Chọn công ty"
                />

                <MultiSelectCustom
                  label="Trung tâm kinh doanh"
                  options={MOCK_OPTIONS.businessCenters}
                  selected={generalFilters.businessCenter}
                  onChange={(vals) => setGeneralFilters(prev => ({ ...prev, businessCenter: vals }))}
                  placeholder="Chọn trung tâm kinh doanh"
                />

                <MultiSelectCustom
                  label="Hãng"
                  options={MOCK_OPTIONS.brands}
                  selected={generalFilters.brand}
                  onChange={(vals) => {
                    setGeneralFilters(prev => ({ ...prev, brand: vals }));
                  }}
                  placeholder="Chọn hãng"
                />

                <MultiSelectCustom
                  label="PS"
                  options={MOCK_OPTIONS.ps}
                  selected={generalFilters.ps}
                  onChange={(vals) => setGeneralFilters(prev => ({ ...prev, ps: vals }))}
                  placeholder="Chọn PS"
                />

                <MultiSelectCustom
                  label="Sản phẩm"
                  options={MOCK_OPTIONS.products}
                  selected={generalFilters.product}
                  onChange={(vals) => setGeneralFilters(prev => ({ ...prev, product: vals }))}
                  placeholder="Chọn sản phẩm"
                />

                <MultiSelectCustom
                  label="Part Number"
                  options={MOCK_OPTIONS.partNumbers}
                  selected={generalFilters.partNumber}
                  onChange={(vals) => setGeneralFilters(prev => ({ ...prev, partNumber: vals }))}
                  placeholder="Chọn Part Number"
                />

                <MultiSelectCustom
                  label="Khách hàng"
                  options={MOCK_OPTIONS.customers}
                  selected={generalFilters.customer}
                  onChange={(vals) => setGeneralFilters(prev => ({ ...prev, customer: vals }))}
                  placeholder="Chọn khách hàng"
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#4A5568]">Số hoá đơn bán</label>
                  <input
                    type="text"
                    value={generalFilters.invoiceNumber}
                    placeholder="Nhập số hoá đơn"
                    onChange={(e) => setGeneralFilters(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-[13px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#4A5568]">Loại Kho</label>
                  <div className="relative group">
                    <select
                      value={generalFilters.warehouseType}
                      onChange={(e) => setGeneralFilters(prev => ({ ...prev, warehouseType: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-[13px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C] appearance-none"
                    >
                      <option value="">Chọn loại kho</option>
                      {MOCK_OPTIONS.warehouseTypes.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#00529C]" />
                  </div>
                </div>

                <MultiSelectCustom
                  label="CPU Brand"
                  options={MOCK_OPTIONS.cpuBrands}
                  selected={generalFilters.cpuBrand}
                  onChange={(vals) => setGeneralFilters(prev => ({ ...prev, cpuBrand: vals }))}
                  placeholder="Chọn CPU Brand"
                />

                <MultiSelectCustom
                  label="Loại hệ điều hành"
                  options={MOCK_OPTIONS.osTypes}
                  selected={generalFilters.osType}
                  onChange={(vals) => setGeneralFilters(prev => ({ ...prev, osType: vals }))}
                  placeholder="Chọn loại HĐH"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#4A5568]">
                  Diễn giải
                </label>
                <textarea 
                  rows={2}
                  placeholder="Nhập diễn giải báo cáo"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-[13px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setGeneralFilters({
                      reportType: "post",
                      company: [],
                      brand: [],
                      ps: [],
                      product: [],
                      partNumber: [],
                      customer: [],
                      invoiceNumber: "",
                      warehouseType: "",
                      cpuBrand: [],
                      osType: [],
                    });
                    setReportDates({ startDate: "", endDate: "" });
                    setIsApplied(false);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-[13px] font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    if (!validateGeneralInfo()) {
                      triggerToast("Vui lòng nhập đầy đủ các trường bắt buộc!");
                      return;
                    }
                    setIsLoading(true);
                    setIsApplied(false);
                    setTimeout(() => {
                      setIsApplied(true);
                      setIsLoading(false);
                      triggerToast("Dữ liệu đã được tải thành công!");
                    }, 1000);
                  }}
                  disabled={isLoading}
                  className="px-8 py-2 bg-[#00529C] text-white rounded-lg text-[13px] font-bold hover:bg-[#00427D] transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Áp dụng"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-end">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[15px]">
                  <span className="text-[#64748B]">
                    Số phiếu đề nghị báo cáo
                  </span>
                  <span className="text-[#00529C] font-bold text-[16px]">
                    {mode === "create"
                      ? "DNBC26_0000001"
                      : "DNBC26_0123456"}
                  </span>
                </div>

                <div className="flex items-center gap-12 text-[15px]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#64748B]">Người tạo đơn</span>
                    <span className="font-bold text-[#334155]">admin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#64748B]">Trung tâm kinh doanh</span>
                    <span className="font-bold text-[#334155]">
                      FHO Other HN
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#64748B]">Ngày tạo</span>
                    <span className="font-bold text-[#334155]">23/04/2026</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isApproveMode ? (
                  <>
                    <button
                      onClick={() => setShowImportModal(true)}
                      className="px-5 py-2.5 border border-[#00529C] text-[#00529C] rounded-lg text-[14px] font-bold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                      <RefreshCcw size={16} />
                      Import dữ liệu
                    </button>
                    <button
                      onClick={() =>
                        handleActionWithBack("Đã từ chối đề nghị báo cáo.")
                      }
                      className="px-6 py-2.5 bg-white border border-red-500 text-red-500 rounded-lg text-[14px] font-bold hover:bg-red-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                      <XCircle size={18} />
                      Từ chối
                    </button>
                    <button
                      onClick={() =>
                        handleActionWithBack(
                          "Phê duyệt đề nghị báo cáo thành công!",
                        )
                      }
                      className="px-8 py-2.5 bg-[#00529C] text-white rounded-lg text-[14px] font-bold hover:bg-[#00427D] transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <CheckCircle2 size={18} />
                      Phê duyệt
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() =>
                      triggerToast(
                        "Đang khởi tạo tệp tin xuất dữ liệu đề nghị...",
                      )
                    }
                    className="px-8 py-2.5 bg-[#00529C] text-white rounded-lg text-[14px] font-bold hover:bg-[#00427D] transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Download size={16} />
                    Export dữ liệu đề nghị
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* General Info Card */}
          {mode !== "create" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-[#FCFDFF] border-b border-gray-100 flex items-center gap-2 cursor-pointer group">
                <div className="w-1 h-5 bg-[#00529C] rounded-full" />
                <ChevronDown size={14} className="text-[#00529C]" />
                <span className="text-[14px] font-bold text-[#002D56] font-sans uppercase tracking-wide">
                  Thông tin chung
                </span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-x-12 gap-y-6">
                  <InfoView 
                    label="Hình thức báo cáo" 
                    value={type === "pre" ? "Báo cáo trước" : "Báo cáo sau"} 
                  />
                  <InfoView label="Kỳ báo cáo (từ ngày)" value="01/04/2026" />
                  <InfoView label="Kỳ báo cáo (tới ngày)" value="30/04/2026" />
                  <InfoView label="Công ty" value="FDCHN" />
                  <InfoView label="Trung tâm kinh doanh" value="FHO Other HN" />
                  <InfoView label="Hãng" value="XIAOMI" />
                  <InfoView label="PS" value="SMARTPHONE" />
                  <InfoView label="Sản phẩm" value="Redmi Note 11 Pro" />
                  <InfoView label="Part Number" value="MZB0ARHEU" />
                  <InfoView label="Khách hàng" value="CÔNG TY TNHH CÔNG NGHỆ HÀ DUY" />
                  <InfoView label="Số hoá đơn bán" value="INV-2026-001" />
                  <InfoView label="Loại Kho" value="Kho báo cáo" />
                  <InfoView label="CPU Brand" value="MediaTek" />
                  <InfoView label="Loại hệ điều hành" value="Android" />
                </div>
                <div className="mt-6">
                  <InfoView label="Diễn giải" value="Đề nghị xuất hàng báo cáo hãng quý 2 năm 2026, đối chiếu dữ liệu kinh doanh thực tế tại trung tâm HN." />
                </div>
              </div>
            </div>
          )}

          {/* Report List Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-[#FCFDFF] border-b border-gray-100 flex items-center gap-2 cursor-pointer">
              <div className="w-1 h-5 bg-[#00529C] rounded-full" />
              <ChevronDown size={14} className="text-[#00529C]" />
              <span className="text-[14px] font-bold text-[#002D56] font-sans uppercase tracking-wide">
                Thông tin dữ liệu trong kỳ
              </span>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("ledger")}
                    className={`px-6 py-1.5 rounded-t-lg text-[13px] font-medium transition-all relative ${activeTab === "ledger" ? "text-[#00529C] bg-white border-x border-t border-gray-200 -mb-[1px] z-10" : "text-gray-500 bg-gray-50 hover:bg-gray-100"}`}
                  >
                    Dữ liệu giao dịch
                    {activeTab === "ledger" && (
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-[#00529C]" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("import")}
                    className={`px-6 py-1.5 rounded-t-lg text-[13px] font-medium transition-all relative ${activeTab === "import" ? "text-[#00529C] bg-white border-x border-t border-gray-200 -mb-[1px] z-10" : "text-gray-500 bg-gray-50 hover:bg-gray-100"}`}
                  >
                    Dữ liệu import
                    {activeTab === "import" && (
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-[#00529C]" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("summary")}
                    className={`px-6 py-1.5 rounded-t-lg text-[13px] font-medium transition-all relative ${activeTab === "summary" ? "text-[#00529C] bg-white border-x border-t border-gray-200 -mb-[1px] z-10" : "text-gray-500 bg-gray-50 hover:bg-gray-100"}`}
                  >
                    Tổng hợp
                    {activeTab === "summary" && (
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-[#00529C]" />
                    )}
                  </button>
                </div>

                {(activeTab === "import" || activeTab === "summary") &&
                  hasImportedData && (
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-1 rounded-full border border-gray-100 shadow-inner">
                      <span className="text-[12px] font-semibold text-gray-600 tracking-tight">
                        Highlight
                      </span>
                      <button
                        onClick={() => setShowHighlight(!showHighlight)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${showHighlight ? "bg-[#28A745]" : "bg-gray-300"}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showHighlight ? "translate-x-6" : "translate-x-1"}`}
                        />
                      </button>
                    </div>
                  )}
              </div>

              {/* Table Filters - Now inside the content area for each tab */}
              <div className="mb-6 space-y-4">
                {activeTab === "import" && (
                  <div className="flex items-center gap-2 mb-4">
                    <button 
                       onClick={() => triggerToast("Đang chuẩn bị tệp tin export...")}
                       className="flex items-center gap-2 text-[13px] font-bold px-4 py-2.5 rounded-md transition-all border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                    >
                      <Download size={16} />
                      Export
                    </button>
                    <button 
                       onClick={() => setShowImportFormModal(true)}
                       className="flex items-center gap-2 text-[13px] font-bold px-4 py-2.5 rounded-md transition-all bg-[#00529C] text-white hover:bg-[#00427D] shadow-md"
                    >
                      <Upload size={16} />
                      Import
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                      <Search size={18} />
                    </span>
                    <input
                      type="text"
                      value={tableSearchTerm}
                      onChange={(e) => setTableSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-4 py-2.5 bg-[#F7FAFC] border border-gray-200 rounded-md text-[13px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00529C]/10 focus:border-[#00529C] transition-all"
                      placeholder={`Tìm kiếm nhanh trong ${activeTab === "ledger" ? "Dữ liệu giao dịch" : activeTab === "import" ? "Dữ liệu import" : "Tổng hợp"}...`}
                    />
                    {tableSearchTerm && (
                      <button
                        onClick={() => setTableSearchTerm("")}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 text-[13px] font-medium px-4 py-2.5 rounded-md transition-colors border ${isFilterOpen ? "text-[#00529C] bg-blue-50 border-blue-100" : "text-gray-600 bg-white border-gray-200 hover:bg-gray-50"}`}
                  >
                    <SlidersHorizontal size={16} />
                    Bộ lọc nâng cao
                  </button>
                </div>

                <AnimatePresence>
                  {isFilterOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-[#F8FAFC]/50 border border-gray-100 rounded-lg"
                    >
                      <div className="p-4 text-left">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          <FilterField
                            label="Invoice Date"
                            placeholder="Chọn ngày"
                            value={tableFilters.reportInvoiceDate}
                            onChange={(v: string) =>
                              setTableFilters({
                                ...tableFilters,
                                reportInvoiceDate: v,
                              })
                            }
                            isDate
                          />
                          <FilterField
                            label="Invoice Number"
                            placeholder="Nhập số hóa đơn"
                            value={tableFilters.reportInvoiceNumber}
                            onChange={(v: string) =>
                              setTableFilters({
                                ...tableFilters,
                                reportInvoiceNumber: v,
                              })
                            }
                          />
                          <FilterField
                            label="Mã khách hàng"
                            placeholder="Nhập mã KH"
                            value={tableFilters.reportCustomerId}
                            onChange={(v: string) =>
                              setTableFilters({
                                ...tableFilters,
                                reportCustomerId: v,
                              })
                            }
                          />
                          <FilterField
                            label="Tên khách hàng"
                            placeholder="Nhập tên KH"
                            value={tableFilters.reportCustomerName}
                            onChange={(v: string) =>
                              setTableFilters({
                                ...tableFilters,
                                reportCustomerName: v,
                              })
                            }
                          />
                          <FilterField
                            label="Mã sản phẩm"
                            placeholder="Nhập mã SP"
                            value={tableFilters.itemCode}
                            onChange={(v: string) =>
                              setTableFilters({ ...tableFilters, itemCode: v })
                            }
                          />
                          <FilterField
                            label="Tên sản phẩm"
                            placeholder="Nhập tên SP"
                            value={tableFilters.itemName}
                            onChange={(v: string) =>
                              setTableFilters({ ...tableFilters, itemName: v })
                            }
                          />
                          <FilterField
                            label="Dòng sản phẩm (ps)"
                            placeholder="Nhập dòng SP"
                            value={tableFilters.ps}
                            onChange={(v: string) =>
                              setTableFilters({ ...tableFilters, ps: v })
                            }
                          />
                        </div>
                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                          <button
                            onClick={resetTableFilters}
                            className="px-4 py-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-700"
                          >
                            Xóa bộ lọc
                          </button>
                          <button
                            onClick={() => setIsFilterOpen(false)}
                            className="px-6 py-1.5 bg-[#00529C] text-white text-[12px] font-medium rounded-md hover:bg-[#00427D]"
                          >
                            Áp dụng
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-[600px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <table className="w-max min-w-full text-left border-separate border-spacing-0 table-fixed">
                  <thead className="sticky top-0 z-20">
                    <tr className="bg-[#F8FAFC]">
                    <th
                        style={{ width: columnWidths.no }}
                        className="px-6 py-4 text-[12px] font-bold text-[#002B49] uppercase font-sans border-b border-gray-200 relative group bg-[#F8FAFC]"
                      >
                        NO
                        <div
                          onMouseDown={(e) => startResize("no", e)}
                          className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-[#00529C] transition-colors z-40 opacity-0 group-hover:opacity-100"
                        />
                      </th>
                      {COLUMN_CONFIG.map((col, cIdx) => (
                        <th
                          key={col.key}
                          style={{ width: columnWidths[col.key] }}
                          className={`px-6 py-4 text-[12px] font-bold text-[#002B49] uppercase font-sans border-b border-gray-200 whitespace-nowrap relative group ${activeTab !== "ledger" && cIdx > 4 ? "bg-orange-50 font-black" : "bg-[#F8FAFC]"}`}
                        >
                          {col.label}
                          <div
                            onMouseDown={(e) => startResize(col.key, e)}
                            className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-[#00529C] transition-colors z-40 opacity-0 group-hover:opacity-100"
                          />
                        </th>
                      ))}
                      {activeTab === "import" && (
                        <>
                          <th className="px-6 py-4 text-[12px] font-bold text-[#002B49] uppercase font-sans bg-[#F8FAFC] border-b border-gray-200 w-32 whitespace-nowrap">
                            Trạng thái
                          </th>
                          {showActionColumn && (
                            <th className="px-6 py-4 text-[12px] font-bold text-[#002B49] uppercase font-sans bg-[#F8FAFC] border-b border-gray-200 w-40 whitespace-nowrap sticky right-0 z-30 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                              Thao tác
                            </th>
                          )}
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={COLUMN_CONFIG.length + (activeTab === "import" ? (showActionColumn ? 3 : 2) : 1)}
                          className="px-6 py-20 text-center"
                        >
                          <div className="flex flex-col items-center gap-3">
                            <RefreshCcw size={40} className="text-[#00529C] animate-spin" />
                            <span className="text-gray-500 font-medium italic">Đang tải dữ liệu, vui lòng đợi...</span>
                          </div>
                        </td>
                      </tr>
                    ) : !isApplied ? (
                      <tr>
                        <td
                          colSpan={COLUMN_CONFIG.length + (activeTab === "import" ? (showActionColumn ? 3 : 2) : 1)}
                          className="px-6 py-20 text-center text-gray-400 text-[14px]"
                        >
                          Vui lòng áp dụng bộ lọc để xem dữ liệu.
                        </td>
                      </tr>
                    ) : activeTab === "ledger" ? (
                      currentTableData.map((row, idx) => (
                        <tr
                          key={row.id}
                          className="group hover:bg-gray-50 transition-colors bg-white"
                        >
                          <td
                            style={{ width: columnWidths.no }}
                            className="px-6 py-4 text-[12px] text-gray-700 font-medium bg-white border-b border-gray-100 group-hover:bg-gray-50 overflow-hidden text-ellipsis whitespace-nowrap"
                          >
                            {(idx + 1).toString().padStart(2, "0")}
                          </td>
                          {COLUMN_CONFIG.map((col, cIdx) => (
                            <td
                              key={col.key}
                              style={{ width: columnWidths[col.key] }}
                              className={`px-6 py-4 text-[12px] text-gray-700 border-b border-gray-50 ${(col.key === "itemName" || col.key === "ps") ? "whitespace-normal break-words leading-relaxed" : "whitespace-nowrap overflow-hidden text-ellipsis"} ${activeTab !== "ledger" && cIdx > 4 ? "bg-orange-50/50" : ""}`}
                            >
                              {renderCell(row, col.key)}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : activeTab === "import" ? (
                      hasImportedData ? (
                        currentTableData.map((row) => (
                           <tr
                             key={row.id}
                             className={`group transition-colors ${
                               showHighlight
                                 ? row.changeType === "add"
                                   ? "bg-green-50/40 hover:bg-green-100/60"
                                   : row.changeType === "update"
                                     ? "bg-orange-50/40 hover:bg-orange-100/60"
                                     : "bg-red-50/40 hover:bg-red-100/60"
                                 : "bg-white hover:bg-gray-50"
                             }`}
                           >
                             <td
                               style={{ width: columnWidths.no }}
                               className={`px-6 py-4 text-[12px] text-gray-700 font-bold italic group-hover:opacity-90 overflow-hidden text-ellipsis whitespace-nowrap ${
                                 showHighlight
                                   ? row.changeType === "add"
                                     ? "bg-green-100 border-green-200 border-r"
                                     : row.changeType === "update"
                                       ? "bg-orange-100 border-orange-200 border-r"
                                       : "bg-red-100 border-red-200 border-r"
                                   : "bg-white border-gray-100 group-hover:bg-gray-50 border-r"
                               }`}
                             >
                               {(currentTableData.indexOf(row) + 1).toString().padStart(2, "0")}
                             </td>
                             {COLUMN_CONFIG.map((col) => (
                               <td
                                 key={col.key}
                                 style={{ width: columnWidths[col.key] }}
                                 className={`px-6 py-4 text-[12px] text-gray-700 overflow-hidden ${(col.key === "itemName" || col.key === "ps") ? "whitespace-normal break-words leading-relaxed" : "whitespace-nowrap text-ellipsis"} ${
                                   showHighlight
                                     ? row.changeType === "add"
                                       ? "border-green-100"
                                       : row.changeType === "update"
                                         ? "border-orange-100"
                                         : "border-red-100"
                                     : "border-gray-50"
                                 }`}
                               >
                                 {renderCell(row, col.key)}
                               </td>
                             ))}
                             <td className="px-6 py-4 text-[11px] whitespace-nowrap font-bold uppercase">
                               {row.changeType === "add" ? (
                                 <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                                   NEW
                                 </span>
                               ) : row.changeType === "update" ? (
                                 <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                                   EDITED
                                 </span>
                               ) : (
                                 <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                                   DELAYED
                                 </span>
                               )}
                             </td>
                            {showActionColumn && (
                              <td className="px-6 py-4 text-[12px] whitespace-nowrap sticky right-0 z-10 bg-white group-hover:bg-gray-50 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                                {row.changeType === "add" &&
                                !importedSerials.includes(row.id) ? (
                                  <button
                                    onClick={() => {
                                      setCurrentImportingRow(row.id);
                                      setSerialImportStatus("idle");
                                      setShowSerialModal(true);
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1 bg-green-600 text-white rounded text-[11px] font-bold hover:bg-green-700 transition-colors shadow-sm"
                                  >
                                    <Upload size={12} />
                                    Import Serial
                                  </button>
                                ) : (
                                  <span className="text-gray-400 italic text-[11px]"></span>
                                )}
                              </td>
                            )}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={
                              COLUMN_CONFIG.length + (showActionColumn ? 3 : 2)
                            }
                            className="px-6 py-20 text-center text-gray-400 text-[14px]"
                          >
                            Không có dữ liệu hiển thị. Hãy import file để so
                            sánh dữ liệu.
                          </td>
                        </tr>
                      )
                    ) : (
                      /* Dữ liệu tổng hợp: Render Dynamic Columns */
                      currentTableData.map((row) => (
                        <tr
                          key={row.id}
                          className={`group transition-colors ${
                            showHighlight && row.changeType === "add"
                              ? "bg-green-50/40 hover:bg-green-100/60"
                              : showHighlight && row.changeType === "update"
                                ? "bg-orange-50/40 hover:bg-orange-100/60"
                                : "bg-white hover:bg-gray-50"
                          }`}
                        >
                          <td
                            style={{ width: columnWidths.no }}
                            className={`px-6 py-4 text-[12px] text-gray-700 font-medium italic border-b group-hover:opacity-90 overflow-hidden text-ellipsis whitespace-nowrap ${
                              showHighlight && row.changeType === "add"
                                ? "bg-green-100 border-green-200 text-green-800"
                                : showHighlight && row.changeType === "update"
                                  ? "bg-orange-100 border-orange-200 text-orange-800"
                                  : "bg-white border-gray-100 group-hover:bg-gray-50"
                            }`}
                          >
                            {(currentTableData.indexOf(row) + 1).toString().padStart(2, "0")}
                          </td>
                          {COLUMN_CONFIG.map((col) => (
                            <td
                              key={col.key}
                              style={{ width: columnWidths[col.key] }}
                              className={`px-6 py-4 text-[12px] text-gray-700 whitespace-nowrap border-b overflow-hidden text-ellipsis ${
                                showHighlight && row.changeType === "add"
                                  ? "border-green-100"
                                  : showHighlight && row.changeType === "update"
                                    ? "border-orange-100"
                                    : "border-gray-50"
                              }`}
                            >
                              {renderCell(row, col.key)}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="mt-4 flex items-center justify-between pb-2">
                <div className="flex flex-col gap-1">
                  <div className="text-[12px] text-gray-500">
                    Tổng {currentTableData.length} bản ghi
                  </div>
                  <div className="text-[12px] text-gray-500 flex items-center gap-2">
                    <span>Tổng số lượng:</span>
                    <span className="font-bold text-[#002B49]">
                      {currentTableData.reduce((acc, row) => acc + (Number(row.reportQty) || 0), 0)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <button className="p-1 px-2 text-gray-400 hover:text-gray-600 rounded-md border border-gray-200 mr-2">
                      <ChevronLeft size={16} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[#00529C] text-white text-[12px] font-medium shadow-sm">
                      1
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 text-[12px]">
                      2
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 text-[12px]">
                      3
                    </button>
                    <span className="px-2 text-gray-400">...</span>
                    <button className="w-10 h-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 text-[12px]">
                      123
                    </button>
                    <button className="p-1 px-2 text-gray-400 hover:text-gray-600 rounded-md border border-gray-200 ml-2">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-[12px] text-gray-700 cursor-pointer hover:border-gray-400 transition-all select-none">
                    <span>15 bản ghi/trang</span>
                    <ChevronsUpDown size={14} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Sections - Display in view mode */}
          {mode === "view" && (
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
      </div>
    </div>
  );
}
