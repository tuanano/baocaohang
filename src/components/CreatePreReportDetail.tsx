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
  { key: "poNumber", label: "PO number" },
  { key: "poUnitCost", label: "PO Unit cost" },
  { key: "currencyCode", label: "Currency Code" },
  { key: "unitCost", label: "Unit cost" },
  { key: "totalCost", label: "Total Cost" },
  { key: "unitPrice", label: "Đơn giá bán" },
  { key: "revenue", label: "Doanh thu" },
  { key: "billToLocationId", label: "Bill To Location_ID" },
  { key: "billToLocation", label: "Bill To Location" },
  { key: "billToAddress", label: "Bill To Address" },
  { key: "zipCode", label: "ZIP Code" },
  { key: "city", label: "Tỉnh thành" },
  { key: "country", label: "Quốc gia" },
  { key: "shipToLocationId", label: "Ship To Location_ID" },
  { key: "shipToLocation", label: "Ship To Location" },
  { key: "shipToAddress", label: "Ship To Address" },
  { key: "shipToZipCode", label: "ZIP Code" },
  { key: "shipToCity", label: "Tỉnh thành" },
  { key: "shipToCountry", label: "Quốc gia" },
  { key: "bidNumber", label: "Số BID (báo cáo dữ liệu tổng hợp)" },
  { key: "endUserName", label: "Tên_ End user" },
  { key: "endUserAddress", label: "Địa chỉ_ End user" },
  { key: "endUserCity", label: "Tỉnh thành_ End user" },
  { key: "endUserCountry", label: "Quốc gia_ End user" },
  { key: "endUserZipCode", label: "Zip_code_End_user" },
  // Dynamic columns will be inserted here
  { key: "transactionNumber", label: "Số giao dịch" },
  { key: "transactionDate", label: "Ngày giao dịch" },
  { key: "transactionType", label: "Transaction Type" },
];

const mockCommonFields = {
  brandVendor: "Apple",
  comName: "FDCHN",
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
  brand: "APPLE",
  ps: "SMART PHONE",
  itemCode: "71084507",
  partNumber: "MG6L4ZP/A",
  itemName: "Điện thoại iPhone 17 256GB Xanh Lam Khói MG6L4ZP/A",
  model: "iPhone 17",
  color: "Blue Titanium",
  cpuBrand: "APPLE",
  cpuModel: "A17 Pro",
  osType: "iOS",
  reportInvoiceDate: "25/03/2026",
  reportInvoiceNumber: "167285",
  reportQty: "10",
  poNumber: "PO-ADG-2026-001",
  poUnitCost: "28,000,000",
  currencyCode: "VND",
  unitCost: "29,000,000",
  totalCost: "290,000,000",
  unitPrice: "34,990,000",
  revenue: "349,900,000",
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
  bidNumber: "BID-APPLE-2026",
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

export default function CreatePreReportDetail({
  category,
  onBack,
}: {
  category: "quantity" | "serial";
  onBack: () => void;
}) {
  const type = "pre" as string;
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

  const showActionColumn =
    mode === "create" || (isApproveMode && didFreshImport);

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
            <div className="space-y-6">
              <h1 className="text-[28px] font-bold text-[#002D56] font-sans tracking-tight leading-tight">
                {mode === "create" ? "Tạo mới" : "Chi tiết"} đề nghị báo cáo{" "}
                {type === "pre" ? "(trước)" : "(sau)"}
              </h1>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[15px]">
                  <span className="text-[#64748B]">
                    Số phiếu đề nghị báo cáo
                  </span>
                  <span className="text-[#00529C] font-bold text-[16px]">
                    {mode === "create"
                      ? "DRAFT_2026_0423_001"
                      : "DNBC_2026_0006789"}
                  </span>
                </div>

                <div className="flex items-center gap-12 text-[15px]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#64748B]">Người tạo đơn</span>
                    <span className="font-bold text-[#334155]">
                      {mode === "create" ? "admin" : "thaohh5"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#64748B]">Ngày tạo</span>
                    <span className="font-bold text-[#334155]">23/04/2026</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-6">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-400 hover:text-[#00529C] transition-colors w-fit group"
              >
                <ChevronLeft
                  size={18}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                <span className="text-[13px] font-medium">
                  Quay lại danh sách
                </span>
              </button>

              <div className="flex items-center gap-3">
                {mode === "create" ? (
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
                        triggerToast("Đang khởi tạo tệp tin xuất liệu...")
                      }
                      className="px-5 py-2.5 border border-[#00529C] text-[#00529C] rounded-lg text-[14px] font-bold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                      <Download size={16} />
                      Export dữ liệu
                    </button>
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
                ) : isApproveMode ? (
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
                        triggerToast("Đang khởi tạo tệp tin xuất liệu...")
                      }
                      className="px-5 py-2.5 border border-[#00529C] text-[#00529C] rounded-lg text-[14px] font-bold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                      <Download size={16} />
                      Export dữ liệu
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
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* General Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-[#FCFDFF] border-b border-gray-100 flex items-center gap-2 cursor-pointer group">
              <div className="w-1 h-5 bg-[#00529C] rounded-full" />
              <ChevronDown size={14} className="text-[#00529C]" />
              <span className="text-[14px] font-bold text-[#002D56] font-sans uppercase tracking-wide">
                Thông tin chung
              </span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6">
                <InfoView label="Hãng" value="Apple" />
                <InfoView label="Hình thức báo cáo" value="Báo cáo trước" />
                <InfoView
                  label="Phiếu đề nghị XKNB"
                  value="XK25_0014767"
                  isLink
                />
                <InfoView label="Ngày hạch toán" value="04/07/2025" />

                <InfoView label="Org xuất" value="A77 - Kho ban HN" />
                <InfoView label="Kho xuất" value="Kho ban KQK - HN" />
                <InfoView label="Org nhập" value="A77 - Kho ban HN" />
                <InfoView label="Kho nhập" value="Kho hang ban - TSGX - HN" />

                <div className="md:col-span-4">
                  <InfoView
                    label="Diễn giải"
                    value="phutb3 Chuyển sang kho bán hàng xin hàng xin nhập trước xuất trước cho MBW số HĐ 128429 còn dư."
                  />
                </div>
              </div>
              <div className="flex gap-x-12 mt-6 pt-6 border-t border-gray-100">
                <div className="flex gap-2 items-baseline">
                  <span className="text-[13px] font-medium text-gray-500">
                    Tổng SL mã:
                  </span>
                  <span className="text-[16px] font-bold text-[#002D56]">
                    15
                  </span>
                </div>
                <div className="flex gap-2 items-baseline">
                  <span className="text-[13px] font-medium text-gray-500">
                    Tổng số sản phẩm:
                  </span>
                  <span className="text-[16px] font-bold text-[#002D56]">
                    129
                  </span>
                </div>
              </div>
            </div>
          </div>

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
              <div className="flex items-center justify-between mb-4 border-b border-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("ledger")}
                    className={`px-6 py-2.5 rounded-t-lg text-[13px] font-medium transition-all relative ${activeTab === "ledger" ? "text-[#00529C] bg-white border-x border-t border-gray-200 z-10" : "text-gray-500 bg-gray-50 hover:bg-gray-100"}`}
                  >
                    Thông tin line hàng
                    {activeTab === "ledger" && (
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-[#00529C]" />
                    )}
                    {activeTab === "ledger" && (
                      <div className="absolute -bottom-px left-0 w-full h-px bg-white" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("import")}
                    className={`px-6 py-2.5 rounded-t-lg text-[13px] font-medium transition-all relative ${activeTab === "import" ? "text-[#00529C] bg-white border-x border-t border-gray-200 z-10" : "text-gray-500 bg-gray-50 hover:bg-gray-100"}`}
                  >
                    Dữ liệu import
                    {activeTab === "import" && (
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-[#00529C]" />
                    )}
                    {activeTab === "import" && (
                      <div className="absolute -bottom-px left-0 w-full h-px bg-white" />
                    )}
                  </button>
                </div>
              </div>

              {/* Table Filters for Ledger Tab */}
              {activeTab === "ledger" && (
                <div className="mb-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                        <Search size={18} />
                      </span>
                      <input
                        type="text"
                        value={ledgerSearchTerm}
                        onChange={(e) => setLedgerSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-md text-[13px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00529C]/10 focus:border-[#00529C] transition-all"
                        placeholder="Tìm kiếm mã sản phẩm, tên sản phẩm..."
                      />
                      {ledgerSearchTerm && (
                        <button
                          onClick={() => setLedgerSearchTerm("")}
                          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => setIsLedgerFilterOpen(!isLedgerFilterOpen)}
                      className={`flex items-center gap-2 text-[13px] font-medium px-4 py-2.5 rounded-md transition-colors border ${isLedgerFilterOpen ? "text-[#00529C] bg-blue-50 border-blue-100" : "text-gray-600 bg-white border-gray-200 hover:bg-gray-50"}`}
                    >
                      <SlidersHorizontal size={16} />
                      Bộ lọc nâng cao
                    </button>
                  </div>

                  <AnimatePresence>
                    {isLedgerFilterOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-[#F8FAFC]/50 border border-gray-100 rounded-lg"
                      >
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <FilterField
                              label="Mã sản phẩm"
                              placeholder="Nhập mã SP"
                              value={ledgerFilters.itemCode}
                              onChange={(v: string) =>
                                setLedgerFilters({ ...ledgerFilters, itemCode: v })
                              }
                            />
                            <FilterField
                              label="Tên sản phẩm"
                              placeholder="Nhập tên SP"
                              value={ledgerFilters.itemName}
                              onChange={(v: string) =>
                                setLedgerFilters({ ...ledgerFilters, itemName: v })
                              }
                            />
                            <FilterField
                              label="Dòng sản phẩm (PS)"
                              placeholder="Nhập dòng SP"
                              value={ledgerFilters.ps}
                              onChange={(v: string) =>
                                setLedgerFilters({ ...ledgerFilters, ps: v })
                              }
                            />
                            <FilterField
                              label="Part Number"
                              placeholder="Nhập Part No"
                              value={ledgerFilters.partNumber}
                              onChange={(v: string) =>
                                setLedgerFilters({ ...ledgerFilters, partNumber: v })
                              }
                            />
                          </div>
                          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                            <button
                              onClick={resetLedgerFilters}
                              className="px-4 py-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-700"
                            >
                              Xóa bộ lọc
                            </button>
                            <button
                              onClick={() => setIsLedgerFilterOpen(false)}
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
              )}

              {/* Table Filters for Import Tab */}
              {activeTab === "import" && (
                <div className="mb-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                        <Search size={18} />
                      </span>
                      <input
                        type="text"
                        value={importSearchTerm}
                        onChange={(e) => setImportSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-md text-[13px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00529C]/10 focus:border-[#00529C] transition-all"
                        placeholder="Tìm kiếm nhanh khách hàng, hóa đơn, sản phẩm..."
                      />
                      {importSearchTerm && (
                        <button
                          onClick={() => setImportSearchTerm("")}
                          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => setIsImportFilterOpen(!isImportFilterOpen)}
                      className={`flex items-center gap-2 text-[13px] font-medium px-4 py-2.5 rounded-md transition-colors border ${isImportFilterOpen ? "text-[#00529C] bg-blue-50 border-blue-100" : "text-gray-600 bg-white border-gray-200 hover:bg-gray-50"}`}
                    >
                      <SlidersHorizontal size={16} />
                      Bộ lọc nâng cao
                    </button>
                  </div>

                  <AnimatePresence>
                    {isImportFilterOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-[#F8FAFC]/50 border border-gray-100 rounded-lg"
                      >
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <FilterField
                              label="Mã khách hàng"
                              placeholder="Nhập mã KH"
                              value={importFilters.reportCustomerId}
                              onChange={(v: string) =>
                                setImportFilters({
                                  ...importFilters,
                                  reportCustomerId: v,
                                })
                              }
                            />
                            <FilterField
                              label="Tên khách hàng"
                              placeholder="Nhập tên KH"
                              value={importFilters.reportCustomerName}
                              onChange={(v: string) =>
                                setImportFilters({
                                  ...importFilters,
                                  reportCustomerName: v,
                                })
                              }
                            />
                            <FilterField
                              label="Invoice Date"
                              placeholder="Chọn ngày"
                              value={importFilters.reportInvoiceDate}
                              onChange={(v: string) =>
                                setImportFilters({
                                  ...importFilters,
                                  reportInvoiceDate: v,
                                })
                              }
                              isDate
                            />
                            <FilterField
                              label="Invoice Number"
                              placeholder="Nhập số hóa đơn"
                              value={importFilters.reportInvoiceNumber}
                              onChange={(v: string) =>
                                setImportFilters({
                                  ...importFilters,
                                  reportInvoiceNumber: v,
                                })
                              }
                            />
                            <FilterField
                              label="Mã sản phẩm"
                              placeholder="Nhập mã SP"
                              value={importFilters.itemCode}
                              onChange={(v: string) =>
                                setImportFilters({ ...importFilters, itemCode: v })
                              }
                            />
                            <FilterField
                              label="Tên sản phẩm"
                              placeholder="Nhập tên SP"
                              value={importFilters.itemName}
                              onChange={(v: string) =>
                                setImportFilters({ ...importFilters, itemName: v })
                              }
                            />
                            <FilterField
                              label="Dòng sản phẩm (PS)"
                              placeholder="Nhập dòng SP"
                              value={importFilters.ps}
                              onChange={(v: string) =>
                                setImportFilters({ ...importFilters, ps: v })
                              }
                            />
                          </div>
                          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                            <button
                              onClick={resetImportFilters}
                              className="px-4 py-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-700"
                            >
                              Xóa bộ lọc
                            </button>
                            <button
                              onClick={() => setIsImportFilterOpen(false)}
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
              )}

              <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-[600px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <table className="w-max min-w-full text-left border-separate border-spacing-0 table-fixed">
                  <thead className="sticky top-0 z-20">
                    <tr className="bg-[#F8FAFC]">
                      <th
                        style={{ width: columnWidths.id }}
                        className="px-6 py-4 text-[12px] font-bold text-[#002B49] uppercase font-sans border-b border-gray-200 relative group bg-[#F8FAFC]"
                      >
                        No
                        <div
                          onMouseDown={(e) => startResize("id", e)}
                          className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-[#00529C] transition-colors z-40 opacity-0 group-hover:opacity-100"
                        />
                      </th>
                      {COLUMN_CONFIG.map((col) => (
                        <th
                          key={col.key}
                          style={{ width: columnWidths[col.key] }}
                          className="px-6 py-4 text-[12px] font-bold text-[#002B49] uppercase font-sans bg-[#F8FAFC] border-b border-gray-200 whitespace-nowrap relative group"
                        >
                          {col.label}
                          <div
                            onMouseDown={(e) => startResize(col.key, e)}
                            className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-[#00529C] transition-colors z-40 opacity-0 group-hover:opacity-100"
                          />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentTableData.length > 0 ? (
                      currentTableData.map((row) => (
                        <tr
                          key={row.id}
                          className="group hover:bg-gray-50 transition-colors bg-white"
                        >
                          <td
                            style={{ width: columnWidths.id }}
                            className="px-6 py-4 text-[12px] text-gray-700 font-medium bg-white border-b border-gray-100 group-hover:bg-gray-50 overflow-hidden text-ellipsis whitespace-nowrap"
                          >
                            {row.id}
                          </td>
                          {COLUMN_CONFIG.map((col) => (
                            <td
                              key={col.key}
                              style={{ width: columnWidths[col.key] }}
                              className="px-6 py-4 text-[12px] text-gray-700 whitespace-nowrap border-b border-gray-50 overflow-hidden text-ellipsis"
                            >
                              {renderCell(row, col.key)}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={COLUMN_CONFIG.length + 1}
                          className="px-6 py-20 text-center text-gray-400 text-[14px]"
                        >
                          Không có dữ liệu hiển thị.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="mt-4 flex items-center justify-between pb-2">
                <div className="text-[12px] text-gray-500">
                  Tổng {currentTableData.length} bản ghi
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
      </div>
    </div>
  );
}
