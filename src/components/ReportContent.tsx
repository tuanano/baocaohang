import { useState, useMemo } from "react";
import React from "react";
import {
  Search,
  SlidersHorizontal,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronDown,
  Calendar,
  X,
  Download,
  Loader2,
  MoreHorizontal,
  Info,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ListRestart,
  RefreshCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  BRANDS,
  REPORT_TYPES,
  CATEGORIES_CS,
  PRODUCT_LINES_PS,
  PERIODS,
  ExportRecord,
} from "../constants/mockData";

const statusStyles = {
  success: { label: "Thành công", bg: "bg-[#28A745]", text: "text-white" },
  processing: {
    label: "Đang xử lý",
    bg: "bg-[#00529C]",
    text: "text-white",
    icon: true,
  },
  failed: { label: "Thất bại", bg: "bg-[#DC3545]", text: "text-white" },
};

interface ReportContentProps {
  brandReports: ExportRecord[];
  setBrandReports: React.Dispatch<React.SetStateAction<ExportRecord[]>>;
}

export default function ReportContent({ brandReports, setBrandReports }: ReportContentProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter States
  const [filters, setFilters] = useState({
    reportCode: "",
    fromDate: "",
    toDate: "",
    company: [] as string[],
    org: [] as string[],
    brand: [] as string[],
    reportType: "",
    tag: "",
    warehouseType: "",
    exporter: "",
    status: "",
  });

  // Form State for Modal
  const initialForm = {
    fromDate: "",
    toDate: "",
    reportType: "",
    tag: "",
    warehouseType: "Kho báo cáo",
    company: [] as string[],
    org: [] as string[],
    brand: [] as string[],
    productLine: [] as string[],
    productCode: [] as string[],
    productName: [] as string[],
    partNumber: [] as string[],
    cpuBrand: [] as string[],
    osType: [] as string[],
    poNumber: [] as string[],
  };
  const [form, setForm] = useState(initialForm);
  const [isExporting, setIsExporting] = useState(false);

  const [progressModal, setProgressModal] = useState<{
    isOpen: boolean;
    recordId: string | null;
  }>({ isOpen: false, recordId: null });
  const [paramsModal, setParamsModal] = useState<{
    isOpen: boolean;
    recordId: string | null;
  }>({ isOpen: false, recordId: null });
  const [lastSyncTime, setLastSyncTime] = useState("24/04/2026 07:15");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilters({
      reportCode: "",
      fromDate: "",
      toDate: "",
      company: [] as string[],
      org: [] as string[],
      brand: [] as string[],
      reportType: "",
      tag: "",
      warehouseType: "",
      exporter: "",
      status: "",
    });
  };

  const handleResetForm = () => setForm(initialForm);

  const handleExport = () => {
    if (
      !form.reportType ||
      !form.tag ||
      !form.fromDate ||
      !form.toDate ||
      !form.warehouseType
    )
      return;

    setIsExporting(true);
    const newId = Math.random().toString(36).substr(2, 9);

    const firstBrandId = form.brand[0] || "All";
    const brandName = firstBrandId !== "All" 
      ? BRANDS.find((b) => b.id === firstBrandId)?.name || firstBrandId 
      : "Tất cả";

    // Add processing record immediately
    const processingRecord: ExportRecord = {
      id: newId,
      reportCode: `BC_EXP_${newId.substring(0, 4).toUpperCase()}`,
      brand: form.brand.length > 1 ? `${brandName} (+${form.brand.length - 1})` : brandName,
      reportType: form.reportType,
      tag: form.tag,
      period: `${form.fromDate} - ${form.toDate}`,
      exporter: "thaohh5",
      exportDate: new Date().toLocaleString("vi-VN"),
      status: "processing",
      parameters: {
        fromDate: form.fromDate,
        toDate: form.toDate,
        reportType: form.reportType,
        tag: form.tag,
        warehouseType: form.warehouseType,
        company: form.company,
        org: form.org,
        brand: form.brand,
        productLine: form.productLine,
        productCode: form.productCode,
        productName: form.productName,
        partNumber: form.partNumber,
        cpuBrand: form.cpuBrand,
        osType: form.osType,
        poNumber: form.poNumber,
      }
    };

    setBrandReports((prev) => [processingRecord, ...prev]);
    setIsModalOpen(false);

    // Simulate process completion
    setTimeout(() => {
      setBrandReports((prev) =>
        prev.map((item) =>
          item.id === newId
            ? { ...item, status: "success", downloadUrl: "#" }
            : item,
        ),
      );
      setIsExporting(false);
      handleResetForm();
    }, 3000); // 3 seconds processing
  };

  const handleSyncData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleString("vi-VN"));
    }, 1500);
  };

  const filteredHistory = useMemo(() => {
    return brandReports.filter((item) => {
      const matchesSearch =
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reportType.toLowerCase().includes(searchTerm.toLowerCase());

      // Match brand name or ID
      const matchesBrand =
        !filters.brand?.length ||
        filters.brand.some((b: string) => {
          const brandName = BRANDS.find((brandItem: any) => brandItem.id === b)?.name.toLowerCase() || b.toLowerCase();
          return item.brand.toLowerCase().includes(brandName);
        });

      const matchesOrg = 
        !filters.org?.length ||
        (item.parameters?.org && filters.org.some(org => item.parameters?.org.includes(org)));

      const matchesCompany = 
        !filters.company?.length ||
        (item.parameters?.company && filters.company.some(company => item.parameters?.company.includes(company)));

      const matchesStatus = !filters.status || item.status === filters.status;
      const matchesReportType =
        !filters.reportType || item.reportType === filters.reportType;
      const matchesExporter =
        !filters.exporter ||
        item.exporter.toLowerCase().includes(filters.exporter.toLowerCase());
      const matchesReportCode =
        !filters.reportCode ||
        item.reportCode.toLowerCase().includes(filters.reportCode.toLowerCase());
      const matchesWarehouseType =
        !filters.warehouseType ||
        item.parameters?.warehouseType === filters.warehouseType;
      const matchesTag =
        !filters.tag || item.tag === filters.tag;

      // Date filtering
      let matchesDate = true;
      if (filters.fromDate || filters.toDate) {
        // Parse "23/04/2026 08:30" to Date object
        const [dateStr] = item.exportDate.split(" ");
        const [d, m, y] = dateStr.split("/").map(Number);
        const itemTime = new Date(y, m - 1, d).getTime();

        if (filters.fromDate) {
          const start = new Date(filters.fromDate).setHours(0, 0, 0, 0);
          if (itemTime < start) matchesDate = false;
        }
        if (filters.toDate) {
          const end = new Date(filters.toDate).setHours(23, 59, 59, 999);
          if (itemTime > end) matchesDate = false;
        }
      }

      return (
        matchesSearch &&
        matchesBrand &&
        matchesOrg &&
        matchesCompany &&
        matchesStatus &&
        matchesReportType &&
        matchesExporter &&
        matchesReportCode &&
        matchesWarehouseType &&
        matchesTag &&
        matchesDate
      );
    });
  }, [brandReports, searchTerm, filters]);

  const MultiSelectDropdown = ({ value, onChange, options, placeholder }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleToggle = (optValue: string) => {
      if (value.includes(optValue)) {
        onChange(value.filter((v: string) => v !== optValue));
      } else {
        onChange([...value, optValue]);
      }
    };
    
    const displayValue = value.length > 0 ? `${value.length} đã chọn` : placeholder;

    return (
      <div className="relative w-full">
         <div 
           onClick={() => setIsOpen(!isOpen)}
           className="w-full min-h-[40px] px-3 py-2 bg-white border border-gray-300 rounded-md text-[13px] flex items-center justify-between cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C]"
         >
           <span className={value.length ? "text-gray-900" : "text-gray-400"}>{displayValue}</span>
           <ChevronDown size={16} className="text-gray-400" />
         </div>
         {isOpen && (
           <>
           <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
           <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
             {options?.map((opt: any) => {
               const val = opt.id || opt.name || opt;
               const label = opt.name || opt;
               const isSelected = value.includes(val);
               return (
                 <div 
                   key={val} 
                   onClick={() => handleToggle(val)}
                   className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer text-[13px]"
                 >
                   <input type="checkbox" checked={isSelected} readOnly className="mr-2 rounded border-gray-300 text-[#00529C] focus:ring-[#00529C]" />
                   <span className="text-gray-700">{label}</span>
                 </div>
               );
             })}
             {(!options || options.length === 0) && (
               <div className="px-3 py-2 text-gray-500 text-[13px] italic">Không có tùy chọn</div>
             )}
           </div>
           </>
         )}
      </div>
    );
  };

  const FilterField = ({
    label,
    placeholder,
    value,
    onChange,
    options,
    isDate = false,
    required = false,
    type = "select",
  }: any) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-[#4A5568]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {isDate || type === "date" ? (
          <div className="relative">
            <input
              type="date"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-[13px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C] appearance-none"
              placeholder={placeholder}
            />
            <Calendar
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        ) : type === "text" ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-[13px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C]"
            placeholder={placeholder}
          />
        ) : type === "multiselect" ? (
          <MultiSelectDropdown value={value || []} onChange={onChange} options={options} placeholder={placeholder} />
        ) : (
          <div className="relative group">
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={`w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-[13px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C] appearance-none ${!value ? "text-gray-400" : "text-gray-900"}`}
            >
              <option value="">{placeholder}</option>
              {options?.map((opt: any) => (
                <option key={opt.id || opt} value={opt.id || opt.name || opt}>
                  {opt.name || opt}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#00529C]"
            />
          </div>
        )}
      </div>
    </div>
  );

  const isExportFormValid =
    form.brand && form.reportType && form.tag && form.fromDate && form.toDate;

  return (
    <div className="p-6 flex-1 bg-[#F5F7F9] relative min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[22px] font-semibold text-[#002B49] font-sans">
          Export Báo cáo Hãng
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[12px] text-gray-500 mr-2">
            <span>
              Đồng bộ lần cuối:{" "}
              <span className="font-medium text-gray-700">{lastSyncTime}</span>
            </span>
            <button
              onClick={handleSyncData}
              disabled={isSyncing}
              className="p-1 text-[#00529C] hover:bg-blue-50 rounded bg-white border border-blue-100 transition-colors shadow-sm disabled:opacity-50"
              title="Đồng bộ dữ liệu"
            >
              <RefreshCcw
                size={14}
                className={isSyncing ? "animate-spin" : ""}
              />
            </button>
          </div>
          <button
            onClick={() => {
              handleResetForm();
              setIsModalOpen(true);
            }}
            className="bg-[#00529C] hover:bg-[#00427D] text-white px-4 py-2 rounded-md flex items-center gap-2 text-[13px] font-bold transition-all shadow-sm active:scale-95"
          >
            <Plus size={18} />
            Export Báo cáo
          </button>
        </div>
      </div>

      {/* Modal Backdrop */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-[1px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-xl shadow-2xl z-50 w-full max-w-[1100px] border border-gray-100 my-8"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-[20px] font-bold text-[#002D56] font-sans">
                    Tham số Export Báo cáo
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5 pb-4">
                  <FilterField
                    label="Ngày giao dịch (từ ngày)"
                    placeholder="DD/MM/YYYY"
                    value={form.fromDate}
                    onChange={(val: string) =>
                      setForm({ ...form, fromDate: val })
                    }
                    isDate
                    required
                  />
                  <FilterField
                    label="Ngày giao dịch (đến ngày)"
                    placeholder="DD/MM/YYYY"
                    value={form.toDate}
                    onChange={(val: string) =>
                      setForm({ ...form, toDate: val })
                    }
                    isDate
                    required
                  />

                  <FilterField
                    label="Loại báo cáo"
                    placeholder="Chọn loại báo cáo"
                    value={form.reportType}
                    onChange={(val: string) =>
                      setForm({ ...form, reportType: val })
                    }
                    options={REPORT_TYPES}
                    required
                  />
                  <FilterField
                    label="Thẻ báo cáo"
                    placeholder="Chọn thẻ báo cáo"
                    value={form.tag}
                    onChange={(val: string) => setForm({ ...form, tag: val })}
                    options={["Báo cáo 1", "Báo cáo 2"]}
                    required
                  />
                  <FilterField
                    label="Loại kho"
                    placeholder="Chọn loại kho"
                    value={form.warehouseType}
                    onChange={(val: string) => setForm({ ...form, warehouseType: val })}
                    options={["Kho báo cáo", "Kho không báo cáo"]}
                    required
                  />
                  <FilterField
                    label="Công ty"
                    placeholder="Chọn công ty"
                    value={form.company}
                    onChange={(val: string[]) => setForm({ ...form, company: val })}
                    type="multiselect"
                    options={["Công ty A", "Công ty B", "Công ty C"]}
                  />
                  <FilterField
                    label="ORG"
                    placeholder="Chọn ORG"
                    value={form.org}
                    onChange={(val: string[]) => setForm({ ...form, org: val })}
                    type="multiselect"
                    options={["A80", "A77", "A82"]}
                  />
                  <FilterField
                    label="Hãng"
                    placeholder="Chọn hãng"
                    value={form.brand}
                    onChange={(val: string[]) => setForm({ ...form, brand: val })}
                    type="multiselect"
                    options={BRANDS}
                  />
                  <FilterField
                    label="Dòng sản phẩm (PS)"
                    placeholder="Chọn dòng sản phẩm (ps)"
                    value={form.productLine}
                    onChange={(val: string[]) =>
                      setForm({ ...form, productLine: val })
                    }
                    type="multiselect"
                    options={PRODUCT_LINES_PS}
                  />
                  <FilterField
                    label="Mã Hàng Hóa"
                    placeholder="Chọn mã hàng hóa"
                    value={form.productCode}
                    onChange={(val: string[]) =>
                      setForm({ ...form, productCode: val })
                    }
                    type="multiselect"
                    options={["MH001", "MH002", "MH003"]}
                  />
                  <FilterField
                    label="Tên Hàng Hóa"
                    placeholder="Chọn tên hàng hóa"
                    value={form.productName}
                    onChange={(val: string[]) =>
                      setForm({ ...form, productName: val })
                    }
                    type="multiselect"
                    options={["Tên Sản phẩm A", "Tên Sản phẩm B"]}
                  />
                  <FilterField
                    label="Part Number"
                    placeholder="Chọn Part Number"
                    value={form.partNumber}
                    onChange={(val: string[]) =>
                      setForm({ ...form, partNumber: val })
                    }
                    type="multiselect"
                    options={["PN-1001", "PN-1002"]}
                  />
                  <FilterField
                    label="CPU Brand"
                    placeholder="Chọn CPU Brand"
                    value={form.cpuBrand}
                    onChange={(val: string[]) =>
                      setForm({ ...form, cpuBrand: val })
                    }
                    type="multiselect"
                    options={["Intel", "AMD", "Apple", "Qualcomm"]}
                  />
                  <FilterField
                    label="Loại hệ điều hành"
                    placeholder="Chọn HĐH"
                    value={form.osType}
                    onChange={(val: string[]) =>
                      setForm({ ...form, osType: val })
                    }
                    type="multiselect"
                    options={["Windows", "MacOS", "Linux", "None"]}
                  />
                  <FilterField
                    label="Số PO"
                    placeholder="Chọn Số PO"
                    value={form.poNumber}
                    onChange={(val: string[]) =>
                      setForm({ ...form, poNumber: val })
                    }
                    type="multiselect"
                    options={["PO-001", "PO-002"]}
                  />
                </div>

                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={handleResetForm}
                    className="px-8 py-2.5 border border-[#00529C] text-[#00529C] font-medium rounded-lg hover:bg-blue-50 transition-colors text-[14px] min-w-[120px]"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleExport}
                    disabled={isExporting || !isExportFormValid}
                    className={`px-8 py-2.5 bg-[#00529C] text-white font-medium rounded-lg hover:bg-[#00427D] transition-colors text-[14px] min-w-[140px] flex items-center justify-center gap-2 ${
                      isExporting || !isExportFormValid
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isExporting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Download size={18} />
                    )}
                    Xác nhận Export
                  </button>
                </div>
              </div>
            </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        {/* Search bar and Filter toggle */}
        <div className="p-4 bg-[#EDF2F7]/30">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                <Search size={18} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 bg-[#F7FAFC] border border-gray-200 rounded-md text-[13px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00529C]/10 focus:border-[#00529C] transition-all"
                placeholder="Tìm kiếm theo hãng, loại báo cáo..."
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 text-[13px] font-medium text-[#00529C] hover:bg-blue-50 px-4 py-2.5 rounded-md transition-colors border border-transparent hover:border-blue-100"
            >
              {isFilterOpen ? "Ẩn bộ lọc" : "Bộ lọc"}
              <SlidersHorizontal
                size={16}
                className={
                  isFilterOpen
                    ? "rotate-180 transition-transform"
                    : "transition-transform"
                }
              />
            </button>
          </div>
        </div>

        {/* Expandable Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, overflow: "hidden" }}
              animate={{ height: "auto", opacity: 1, transitionEnd: { overflow: "visible" } }}
              exit={{ height: 0, opacity: 0, overflow: "hidden" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="border-t border-gray-100"
            >
              <div className="p-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-6">
                  <FilterField
                    label="Mã báo cáo"
                    placeholder="Nhập mã báo cáo"
                    value={filters.reportCode}
                    onChange={(val: string) =>
                      setFilters({ ...filters, reportCode: val })
                    }
                    type="text"
                  />
                  <div className="grid grid-cols-2 gap-2 col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2">
                    <FilterField
                      label="Ngày xuất (Từ ngày)"
                      placeholder="DD/MM/YYYY"
                      value={filters.fromDate}
                      onChange={(val: string) =>
                        setFilters({ ...filters, fromDate: val })
                      }
                      isDate
                    />
                    <FilterField
                      label="Ngày xuất (Đến ngày)"
                      placeholder="DD/MM/YYYY"
                      value={filters.toDate}
                      onChange={(val: string) =>
                        setFilters({ ...filters, toDate: val })
                      }
                      isDate
                    />
                  </div>
                  <FilterField
                    label="Công ty"
                    placeholder="Tất cả công ty"
                    value={filters.company}
                    onChange={(val: string[]) =>
                      setFilters({ ...filters, company: val })
                    }
                    type="multiselect"
                    options={["Công ty A", "Công ty B", "Công ty C"]}
                  />
                  <FilterField
                    label="ORG"
                    placeholder="Tất cả ORG"
                    value={filters.org}
                    onChange={(val: string[]) =>
                      setFilters({ ...filters, org: val })
                    }
                    type="multiselect"
                    options={["A80", "A77", "A82"]}
                  />
                  <FilterField
                    label="Hãng"
                    placeholder="Tất cả hãng"
                    value={filters.brand}
                    onChange={(val: string[]) =>
                      setFilters({ ...filters, brand: val })
                    }
                    type="multiselect"
                    options={BRANDS}
                  />
                  <FilterField
                    label="Loại báo cáo"
                    placeholder="Tất cả loại báo cáo"
                    value={filters.reportType}
                    onChange={(val: string) =>
                      setFilters({ ...filters, reportType: val })
                    }
                    options={REPORT_TYPES}
                  />
                  <FilterField
                    label="Thẻ báo cáo"
                    placeholder="Tất cả thẻ báo cáo"
                    value={filters.tag}
                    onChange={(val: string) =>
                      setFilters({ ...filters, tag: val })
                    }
                    options={["Báo cáo 1", "Báo cáo 2"]}
                  />
                  <FilterField
                    label="Loại kho"
                    placeholder="Tất cả loại kho"
                    value={filters.warehouseType}
                    onChange={(val: string) =>
                      setFilters({ ...filters, warehouseType: val })
                    }
                    options={["Kho báo cáo", "Kho không báo cáo"]}
                  />
                  <FilterField
                    label="Người xuất"
                    placeholder="Nhập người xuất"
                    value={filters.exporter}
                    onChange={(val: string) =>
                      setFilters({ ...filters, exporter: val })
                    }
                    type="text"
                  />
                  <FilterField
                    label="Trạng thái"
                    placeholder="Tất cả trạng thái"
                    value={filters.status}
                    onChange={(val: string) =>
                      setFilters({ ...filters, status: val })
                    }
                    options={[
                      { id: "success", name: "Thành công" },
                      { id: "processing", name: "Đang xử lý" },
                      { id: "failed", name: "Thất bại" },
                    ]}
                  />
                </div>

                <div className="flex justify-center gap-4 mt-8">
                  <button
                    onClick={handleResetFilters}
                    className="px-10 py-2 border border-[#00529C] text-[#00529C] font-medium rounded-md hover:bg-blue-50 transition-colors text-[14px]"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="px-10 py-2 bg-[#00529C] text-white font-medium rounded-md hover:bg-[#00427D] transition-colors text-[14px]"
                  >
                    Tìm kiếm
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-gray-200">
                <th className="px-4 py-4 text-[13px] font-semibold text-[#002D56] w-16 text-center font-sans tracking-tight whitespace-nowrap">
                  STT
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-[#002B49] font-sans tracking-tight whitespace-nowrap">
                  Mã báo cáo
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-[#002D56] font-sans tracking-tight whitespace-nowrap">
                  Kỳ báo cáo
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-[#002B49] font-sans tracking-tight whitespace-nowrap">
                  Hãng
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-[#002D56] font-sans tracking-tight whitespace-nowrap">
                  Loại báo cáo
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-[#002B49] font-sans tracking-tight whitespace-nowrap">
                  Thẻ báo cáo
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-[#002D56] font-sans tracking-tight whitespace-nowrap">
                  Loại kho
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-[#002D56] font-sans tracking-tight whitespace-nowrap">
                  Người xuất
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-[#002D56] font-sans whitespace-nowrap tracking-tight">
                  Ngày xuất báo cáo
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-[#002D56] font-sans tracking-tight whitespace-nowrap">
                  Trạng thái
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-[#002D56] w-24 text-center font-sans tracking-tight whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item, index) => {
                  const style = statusStyles[item.status];
                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-50 hover:bg-[#F1F5F9]/50 transition-colors ${index % 2 === 1 ? "bg-[#FCFDFF]" : "bg-white"}`}
                    >
                      <td className="px-4 py-3.5 text-[13px] text-gray-500 text-center font-medium">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3.5 text-[13px] font-mono text-gray-600">
                        {item.reportCode}
                      </td>
                      <td className="px-4 py-3.5 text-[13px] text-gray-600 font-medium whitespace-nowrap">
                        {item.period}
                      </td>
                      <td className="px-4 py-3.5 text-[13px]">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium bg-gray-100 text-gray-800 whitespace-nowrap">
                          {item.brand}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[13px] text-gray-700">
                        {item.reportType}
                      </td>
                      <td className="px-4 py-3.5 text-[13px] font-medium text-[#00529C]">
                        {item.tag && (
                          <span className="px-2 py-1 bg-[#F0F7FF] border border-[#CCE0F5] rounded text-[11px] whitespace-nowrap">
                            {item.tag}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-[13px] text-gray-700">
                        {item.parameters?.warehouseType || 'Kho báo cáo'}
                      </td>
                      <td className="px-4 py-3.5 text-[13px] text-gray-700 font-medium whitespace-nowrap">
                        {item.exporter}
                      </td>
                      <td className="px-4 py-3.5 text-[13px] text-gray-500">
                        {item.exportDate}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold whitespace-nowrap shadow-sm ${style.bg} ${style.text}`}
                        >
                          {item.status === "processing" && (
                            <Loader2 size={12} className="animate-spin" />
                          )}
                          {style.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex justify-end items-center gap-2">
                          {item.status === "success" && (
                            <button
                              className="p-1.5 text-[#00529C] hover:bg-blue-50 rounded-md transition-all border border-transparent hover:border-blue-100"
                              title="Tải về"
                            >
                              <Download size={16} />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              setParamsModal({
                                isOpen: true,
                                recordId: item.id,
                              })
                            }
                            className="p-1.5 text-gray-500 hover:text-[#00529C] hover:bg-blue-50 rounded-md transition-all border border-transparent hover:border-blue-100"
                            title="Xem tham số"
                          >
                            <SlidersHorizontal size={16} />
                          </button>
                          <button
                            onClick={() =>
                              setProgressModal({
                                isOpen: true,
                                recordId: item.id,
                              })
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F0F7FF] text-[#00529C] hover:bg-[#E1EFFF] rounded-md transition-all border border-[#CCE0F5] hover:border-[#99C2EB] shadow-sm font-medium text-[12px] whitespace-nowrap"
                            title="Tiến trình xử lý"
                          >
                            <Info size={14} />
                            Tiến trình
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-10 text-center text-gray-500 text-[14px]"
                  >
                    Không tìm thấy dữ liệu phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 flex items-center justify-between bg-white border-t border-gray-100">
          <div className="text-[13px] text-gray-500">
            Tổng {filteredHistory.length} bản ghi
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <button className="p-1 px-2 text-gray-400 hover:text-gray-600 rounded-md border border-gray-200 mr-2 hover:bg-gray-50 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[#00529C] text-white text-[13px] font-medium shadow-sm">
                1
              </button>
              <button className="p-1 px-2 text-gray-400 hover:text-gray-600 rounded-md border border-gray-200 ml-2 hover:bg-gray-50 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-[13px] text-gray-700 cursor-pointer hover:border-gray-400 transition-all select-none">
              <span>15 bản ghi/trang</span>
              <ChevronsUpDown size={14} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Detail Modal */}
      <AnimatePresence>
        {progressModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setProgressModal({ isOpen: false, recordId: null })
              }
              className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-xl shadow-2xl z-50 w-full max-w-2xl overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-[20px] font-bold text-[#002D56] font-sans flex items-center gap-2">
                    <Info size={24} className="text-[#00529C]" />
                    Tiến trình xử lý Export
                  </h2>
                  <button
                    onClick={() =>
                      setProgressModal({ isOpen: false, recordId: null })
                    }
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    <X size={24} />
                  </button>
                </div>

                {(() => {
                  const record = brandReports.find(
                    (h) => h.id === progressModal.recordId,
                  );
                  if (!record) return null;

                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                        <div>
                          <p className="text-[12px] text-gray-500 mb-1">
                            Mã tham chiếu
                          </p>
                          <p className="text-[13px] font-semibold text-gray-900">
                            {record.reportCode}
                          </p>
                        </div>
                        <div>
                          <p className="text-[12px] text-gray-500 mb-1">Hãng</p>
                          <p className="text-[13px] font-bold text-[#002D56]">
                            {record.brand}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[12px] text-gray-500 mb-1">
                            Loại báo cáo
                          </p>
                          <p className="text-[13px] font-medium text-gray-900">
                            {record.reportType}
                          </p>
                        </div>
                      </div>

                      {record.status === "processing" ? (
                        <div className="border border-blue-100 rounded-lg p-5 bg-blue-50/30">
                          <div className="flex items-center gap-3 mb-4">
                            <Loader2
                              className="animate-spin text-[#00529C]"
                              size={20}
                            />
                            <span className="text-[14px] font-semibold text-[#00529C]">
                              Đang xử lý xuất dữ liệu...
                            </span>
                          </div>

                          <div className="relative pt-1">
                            <div className="overflow-hidden h-1.5 mb-2 text-xs flex rounded bg-blue-100">
                              <motion.div
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#00529C] w-1/3 rounded-full"
                                animate={{ x: ["-100%", "300%"] }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 1.5,
                                  ease: "linear",
                                }}
                              />
                            </div>
                            <div className="text-center text-[11px] text-[#00529C] font-medium mt-2">
                              <span>
                                Hệ thống đang xử lý. Quá trình này có thể mất
                                vài phút...
                              </span>
                            </div>
                          </div>

                          <div className="mt-6 space-y-4">
                            <div className="flex gap-3">
                              <div className="mt-0.5">
                                <CheckCircle2
                                  size={16}
                                  className="text-green-500"
                                />
                              </div>
                              <div>
                                <p className="text-[13px] font-medium text-gray-900">
                                  Tiếp nhận yêu cầu
                                </p>
                                <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                                  <Clock size={10} /> 08:45:12 - Hoàn tất
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <div className="mt-0.5">
                                <CheckCircle2
                                  size={16}
                                  className="text-green-500"
                                />
                              </div>
                              <div>
                                <p className="text-[13px] font-medium text-gray-900">
                                  Xác thực tham số
                                </p>
                                <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                                  <Clock size={10} /> 08:45:15 - Hoàn tất
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : record.status === "success" ? (
                        <div className="border border-green-200 rounded-lg p-5 bg-green-50/50">
                          <div className="flex items-center gap-3 mb-4">
                            <CheckCircle2
                              className="text-green-600"
                              size={24}
                            />
                            <span className="text-[15px] font-bold text-green-700">
                              Xuất báo cáo thành công
                            </span>
                          </div>

                          <div className="mt-6 space-y-4">
                            <div className="flex gap-3">
                              <div className="mt-0.5">
                                <CheckCircle2
                                  size={16}
                                  className="text-green-500"
                                />
                              </div>
                              <div>
                                <p className="text-[13px] font-medium text-gray-900">
                                  Tiếp nhận yêu cầu
                                </p>
                                <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                                  <Clock size={10} /> 08:45:12 - Hoàn tất
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <div className="mt-0.5">
                                <CheckCircle2
                                  size={16}
                                  className="text-green-500"
                                />
                              </div>
                              <div>
                                <p className="text-[13px] font-medium text-gray-900">
                                  Xác thực tham số
                                </p>
                                <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                                  <Clock size={10} /> 08:45:15 - Hoàn tất
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <div className="mt-0.5">
                                <CheckCircle2
                                  size={16}
                                  className="text-green-500"
                                />
                              </div>
                              <div>
                                <p className="text-[13px] font-medium text-gray-900">
                                  Thực thi truy vấn dữ liệu từ DB
                                </p>
                                <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                                  <Clock size={10} /> 08:45:16 - 08:45:25 (Hoàn
                                  tất)
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <div className="mt-0.5">
                                <CheckCircle2
                                  size={16}
                                  className="text-green-500"
                                />
                              </div>
                              <div>
                                <p className="text-[13px] font-medium text-gray-900">
                                  Định dạng file Excel
                                </p>
                                <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                                  <Clock size={10} /> 08:45:25 - 08:45:28 (Hoàn
                                  tất)
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 flex justify-end">
                            <button
                              className="px-6 py-2.5 bg-[#00529C] hover:bg-[#00427D] text-white font-medium rounded-lg transition-colors text-[14px] flex items-center gap-2"
                              onClick={() => {
                                setProgressModal({
                                  isOpen: false,
                                  recordId: null,
                                });
                              }}
                            >
                              <Download size={18} />
                              Tải xuống file
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="border border-red-200 rounded-lg p-5 bg-red-50/50">
                          <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="text-red-500" size={24} />
                            <span className="text-[15px] font-bold text-red-700">
                              Xuất báo cáo thất bại
                            </span>
                          </div>

                          <div className="mt-6 space-y-4 mb-6">
                            <div className="flex gap-3">
                              <div className="mt-0.5">
                                <CheckCircle2
                                  size={16}
                                  className="text-green-500"
                                />
                              </div>
                              <div>
                                <p className="text-[13px] font-medium text-gray-900">
                                  Tiếp nhận yêu cầu
                                </p>
                                <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                                  <Clock size={10} /> 08:45:12 - Hoàn tất
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <div className="mt-0.5">
                                <CheckCircle2
                                  size={16}
                                  className="text-green-500"
                                />
                              </div>
                              <div>
                                <p className="text-[13px] font-medium text-gray-900">
                                  Xác thực tham số
                                </p>
                                <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                                  <Clock size={10} /> 08:45:15 - Hoàn tất
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <div className="mt-0.5">
                                <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                </div>
                              </div>
                              <div>
                                <p className="text-[13px] font-bold text-red-700">
                                  Thực thi truy vấn dữ liệu từ DB
                                </p>
                                <p className="text-[11px] text-red-600/80 flex items-center gap-1 mt-0.5">
                                  <Clock size={10} /> 08:45:16 - Có lỗi xảy ra
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white border text-red-600 border-red-100 rounded p-4 font-mono text-[12px] overflow-x-auto">
                            <p className="font-bold mb-2 text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-[10px]">
                                ERR_TIMEOUT
                              </span>
                              Chi tiết Exception
                            </p>
                            <p>
                              Caused by: java.sql.SQLTimeoutException:
                              ORA-01013: user requested cancel of current
                              operation
                            </p>
                          </div>

                          <div className="mt-6 flex justify-end">
                            <button
                              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-[14px] flex items-center gap-2"
                              onClick={() => {
                                setProgressModal({
                                  isOpen: false,
                                  recordId: null,
                                });
                                setIsModalOpen(true);
                              }}
                            >
                              <ListRestart size={18} />
                              Chạy lại báo cáo
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {paramsModal.isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setParamsModal({ isOpen: false, recordId: null })}
              className="fixed inset-0 bg-black/40 backdrop-blur-[1px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-xl shadow-2xl z-50 w-full max-w-3xl overflow-hidden border border-gray-100 my-8"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-[20px] font-bold text-[#002D56] font-sans flex items-center gap-2">
                    <SlidersHorizontal size={24} className="text-[#00529C]" />
                    Xem tham số lệnh xuất
                  </h2>
                  <button
                    onClick={() => setParamsModal({ isOpen: false, recordId: null })}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                {(() => {
                  const record = brandReports.find(
                    (h) => h.id === paramsModal.recordId,
                  );
                  if (!record) return null;
                  const p = record.parameters;

                  return (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                       <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                         
                         {/* Default info */}
                         <div>
                           <label className="text-[12px] text-gray-500">Mã báo cáo</label>
                           <p className="text-[13px] font-bold text-[#00529C] mt-0.5 bg-blue-50 px-2 py-1 rounded border border-blue-100 inline-block">{record.reportCode}</p>
                         </div>
                         <div>
                           <label className="text-[12px] text-gray-500">Người xuất</label>
                           <p className="text-[13px] font-medium text-gray-900 mt-0.5">{record.exporter}</p>
                         </div>
                         <div className="col-span-2 border-b border-gray-100 pb-2"></div>

                         {/* Parameters */}
                         {!p ? (
                           <div className="col-span-2 text-gray-500 text-[13px] italic p-4 text-center">
                               Không có dữ liệu tham số lưu trữ cho lệnh này.
                           </div>
                         ) : (
                           <>
                              <div>
                                <label className="text-[12px] text-gray-500">Ngày giao dịch từ</label>
                                <p className="text-[13px] font-medium text-gray-900 mt-0.5">{p.fromDate || '--'}</p>
                              </div>
                              <div>
                                <label className="text-[12px] text-gray-500">Ngày giao dịch đến</label>
                                <p className="text-[13px] font-medium text-gray-900 mt-0.5">{p.toDate || '--'}</p>
                              </div>
                              <div className="col-span-2">
                                <label className="text-[12px] text-gray-500">Loại tham số báo cáo</label>
                                <p className="text-[13px] font-medium text-gray-900 mt-0.5 p-2 bg-gray-50 rounded border border-gray-100">{p.reportType || '--'}</p>
                              </div>
                              <div>
                                <label className="text-[12px] text-gray-500">Thẻ báo cáo</label>
                                <p className="text-[13px] font-medium text-gray-900 mt-0.5">{p.tag || '--'}</p>
                              </div>
                              <div>
                                <label className="text-[12px] text-gray-500">Loại kho</label>
                                <p className="text-[13px] font-medium text-gray-900 mt-0.5">{p.warehouseType || '--'}</p>
                              </div>
                              <div className="col-span-2">
                                <label className="text-[12px] text-gray-500">Công ty</label>
                                <p className="text-[13px] font-medium text-gray-900 mt-0.5">{p.company?.length ? p.company.join(', ') : 'Tất cả'}</p>
                              </div>
                              <div>
                                <label className="text-[12px] text-gray-500">ORG</label>
                                <p className="text-[13px] font-medium text-gray-900 mt-0.5">{p.org?.length ? p.org.join(', ') : 'Tất cả'}</p>
                              </div>
                              <div>
                                <label className="text-[12px] text-gray-500">Hãng</label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {p.brand?.length ? p.brand.map(id => (
                                    <span key={id} className="px-2 py-0.5 bg-blue-100 text-[#00529C] text-[11px] font-bold rounded border border-blue-200">
                                      {BRANDS.find(b => b.id === id)?.name || id}
                                    </span>
                                  )) : <span className="text-[13px] text-gray-500">Tất cả</span>}
                                </div>
                              </div>
                              <div className="col-span-2">
                                <label className="text-[12px] text-gray-500">Dòng sản phẩm (PS)</label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {p.productLine?.length ? p.productLine.map(id => (
                                    <span key={id} className="px-2 py-0.5 bg-orange-50 text-orange-700 text-[11px] font-bold rounded border border-orange-100">
                                      {PRODUCT_LINES_PS.find(pl => pl.id === id)?.name || id}
                                    </span>
                                  )) : <span className="text-[13px] text-gray-500">Tất cả</span>}
                                </div>
                              </div>
                              <div>
                                <label className="text-[12px] text-gray-500">Mã hàng hóa</label>
                                <p className="text-[13px] font-medium text-gray-900 mt-0.5">{p.productCode?.length ? p.productCode.join(', ') : 'Tất cả'}</p>
                              </div>
                              <div>
                                <label className="text-[12px] text-gray-500">Tên hàng hóa</label>
                                <p className="text-[13px] font-medium text-gray-900 mt-0.5">{p.productName?.length ? p.productName.join(', ') : 'Tất cả'}</p>
                              </div>
                              <div>
                                <label className="text-[12px] text-gray-500">Part Number</label>
                                <p className="text-[13px] font-medium text-gray-900 mt-0.5">{p.partNumber?.length ? p.partNumber.join(', ') : 'Tất cả'}</p>
                              </div>
                              <div>
                                <label className="text-[12px] text-gray-500">CPU Brand</label>
                                <p className="text-[13px] font-medium text-gray-900 mt-0.5">{p.cpuBrand?.length ? p.cpuBrand.join(', ') : 'Tất cả'}</p>
                              </div>
                              <div>
                                <label className="text-[12px] text-gray-500">Loại hệ điều hành</label>
                                <p className="text-[13px] font-medium text-gray-900 mt-0.5">{p.osType?.length ? p.osType.join(', ') : 'Tất cả'}</p>
                              </div>
                              <div>
                                <label className="text-[12px] text-gray-500">Số PO</label>
                                <p className="text-[13px] font-medium text-gray-900 mt-0.5">{p.poNumber?.length ? p.poNumber.join(', ') : 'Tất cả'}</p>
                              </div>
                           </>
                         )}
                       </div>
                    </div>
                  );
                })()}

                <div className="mt-8 flex justify-end">
                  <button
                    className="px-6 py-2 border border-[#00529C] text-[#00529C] hover:bg-blue-50 font-medium rounded-lg transition-colors text-[14px]"
                    onClick={() => setParamsModal({ isOpen: false, recordId: null })}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
