import { useState, useMemo } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BRANDS, CATEGORIES_CS, PRODUCT_LINES_PS } from "../constants/mockData";

interface ReportRequest {
  id: string;
  code: string;
  period: string;
  method: string;
  brand: string;
  businessCenter: string;
  creator: string;
  status: "confirmed" | "bd_pending" | "pm_pending" | "draft" | "var_pending";
}

const statusMap = {
  confirmed: { label: "Đã xác nhận", bg: "bg-[#28A745]", text: "text-white" },
  bd_pending: { label: "Chờ BD duyệt", bg: "bg-[#FD7E14]", text: "text-white" },
  pm_pending: {
    label: "Chờ PM Head duyệt",
    bg: "bg-[#8E79F1]",
    text: "text-white",
  },
  draft: { label: "Dự thảo", bg: "bg-[#FFC107]", text: "text-gray-800" },
  var_pending: {
    label: "Chờ VAR xác nhận",
    bg: "bg-[#17A2B8]",
    text: "text-white",
  },
};

const mockRequests: ReportRequest[] = [
  {
    id: "1",
    code: "DNBC26_0000001",
    period: "01/03/2026 - 30/03/2026",
    method: "Báo cáo trước",
    brand: "APPLE",
    businessCenter: "FHO Other HN",
    creator: "Nguyễn Văn A",
    status: "confirmed",
  },
  {
    id: "2",
    code: "DNBC26_0000002",
    period: "01/04/2026 - 30/04/2026",
    method: "Báo cáo trước",
    brand: "SAMSUNG",
    businessCenter: "FHO Other HCM",
    creator: "Trần Xuân B",
    status: "bd_pending",
  },
  {
    id: "3",
    code: "DNBC25_0000123",
    period: "01/05/2025 - 30/05/2025",
    method: "Báo cáo trước",
    brand: "ASUS",
    businessCenter: "FHO Other HN",
    creator: "Nguyễn Văn A",
    status: "pm_pending",
  },
  {
    id: "4",
    code: "DNBC25_0000124",
    period: "01/06/2025 - 30/06/2025",
    method: "Báo cáo trước",
    brand: "DELL",
    businessCenter: "FHO Other HCM",
    creator: "Trần Xuân B",
    status: "draft",
  },
  {
    id: "5",
    code: "DNBC25_0000125",
    period: "01/07/2025 - 30/07/2025",
    method: "Báo cáo sau",
    brand: "HP",
    businessCenter: "FHO Other HN",
    creator: "Nguyễn Văn A",
    status: "var_pending",
  },
  {
    id: "6",
    code: "DNBC25_0000126",
    period: "01/08/2025 - 30/08/2025",
    method: "Báo cáo sau",
    brand: "LENOVO",
    businessCenter: "FHO Other HCM",
    creator: "Trần Xuân B",
    status: "bd_pending",
  },
  {
    id: "7",
    code: "DNBC25_0000127",
    period: "01/09/2025 - 30/09/2025",
    method: "Báo cáo sau",
    brand: "ACER",
    businessCenter: "FHO Other HN",
    creator: "Nguyễn Văn A",
    status: "confirmed",
  },
  {
    id: "8",
    code: "DNBC25_0000128",
    period: "01/10/2025 - 30/10/2025",
    method: "Báo cáo sau",
    brand: "AMD",
    businessCenter: "FHO Other HCM",
    creator: "Trần Xuân B",
    status: "bd_pending",
  },
  {
    id: "9",
    code: "DNBC25_0000129",
    period: "01/11/2025 - 30/11/2025",
    method: "Báo cáo sau",
    brand: "APPLE",
    businessCenter: "FHO Other HN",
    creator: "Nguyễn Văn A",
    status: "confirmed",
  },
  {
    id: "10",
    code: "DNBC25_0000130",
    period: "01/12/2025 - 30/12/2025",
    method: "Báo cáo sau",
    brand: "SAMSUNG",
    businessCenter: "FHO Other HCM",
    creator: "Trần Xuân B",
    status: "bd_pending",
  },
];

export default function ReportRequestsList({
  onCreateDetail,
  onViewDetail,
}: {
  onCreateDetail?: (
    type: "pre" | "post",
    category: "quantity" | "serial",
  ) => void;
  onViewDetail?: (
    type: "pre" | "post",
    category: "quantity" | "serial",
  ) => void;
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal form state
  const [form, setForm] = useState({
    brand: "",
    reportMethod: "",
    reportCategory: "",
    startDate: "",
    endDate: "",
    xknb: "",
  });

  const [filters, setFilters] = useState({
    code: "",
    brand: "",
    objective: "",
    creator: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const handleReset = () => {
    setSearchTerm("");
    setFilters({
      code: "",
      objective: "",
      creator: "",
      status: "",
      startDate: "",
      endDate: "",
    });
  };

  const resetForm = () => {
    setForm({
      brand: "",
      reportMethod: "",
      reportCategory: "",
      startDate: "",
      endDate: "",
      xknb: "",
    });
  };

  const filteredData = useMemo(() => {
    return mockRequests.filter((item) => {
      const matchesSearch = item.code
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCode =
        filters.code === "" ||
        item.code.toLowerCase().includes(filters.code.toLowerCase());
      const matchesObjective =
        filters.objective === "" || item.method === filters.objective;
      const matchesCreator =
        filters.creator === "" || item.creator === filters.creator;
      const matchesStatus =
        filters.status === "" || item.status === filters.status;

      return (
        matchesSearch &&
        matchesCode &&
        matchesObjective &&
        matchesCreator &&
        matchesStatus
      );
    });
  }, [searchTerm, filters]);

  const FilterField = ({
    label,
    placeholder,
    value,
    onChange,
    options,
    isDate = false,
    required = false,
    disabled = false,
  }: any) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-[#4A5568]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {isDate ? (
          <div className="relative">
            <input
              type="date"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md text-[13px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C] appearance-none ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white text-gray-900"}`}
              placeholder={placeholder}
            />
            <Calendar
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        ) : (
          <div className="relative group">
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md text-[13px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C] appearance-none ${!value && !disabled ? "text-gray-400" : ""} ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white text-gray-900"}`}
            >
              <option value="">{placeholder}</option>
              {options?.map((opt: any) => (
                <option key={opt.id || opt} value={opt.name || opt}>
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

  const isCreateFormValid =
    form.reportMethod === "Báo cáo trước"
      ? !!form.reportMethod
      : !!(form.reportMethod === "Báo cáo sau" && form.startDate && form.endDate);

  return (
    <div className="p-6 flex-1 bg-[#F5F7F9] relative min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[22px] font-semibold text-[#002D56] font-sans">
          Danh sách đề nghị báo cáo
        </h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-[#00529C] hover:bg-[#00427D] text-white px-4 py-2 rounded-md flex items-center gap-2 text-[13px] font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          Tạo mới
        </button>
      </div>

      {/* Modal Backdrop */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[1px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-full max-w-2xl overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-[20px] font-bold text-[#002D56] font-sans">
                    Tạo mới đề nghị báo cáo
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                  <div className="col-span-2">
                    <FilterField
                      label="Hình thức báo cáo"
                      placeholder="Chọn hình thức báo cáo"
                      value={form.reportMethod}
                      onChange={(val: string) =>
                        setForm({ ...form, reportMethod: val })
                      }
                      options={["Báo cáo trước", "Báo cáo sau"]}
                      required
                    />
                  </div>

                  <AnimatePresence>
                    {form.reportMethod !== "Báo cáo trước" && (
                      <>
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="col-span-1 overflow-hidden"
                        >
                          <FilterField
                            label="Thời gian giao dịch (Từ ngày)"
                            placeholder="DD/MM/YYYY"
                            value={form.startDate}
                            onChange={(val: string) =>
                              setForm({ ...form, startDate: val })
                            }
                            isDate
                            required
                          />
                        </motion.div>
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="col-span-1 overflow-hidden"
                        >
                          <FilterField
                            label="Thời gian giao dịch (Đến ngày)"
                            placeholder="DD/MM/YYYY"
                            value={form.endDate}
                            onChange={(val: string) =>
                              setForm({ ...form, endDate: val })
                            }
                            isDate
                            required
                          />
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>

                  {/* Conditional Field: Show when "Báo cáo sau" is selected AND maybe other conditions?
                      The user wants to REMOVE xknb for "Báo cáo trước".
                      Current logic showed it ONLY for "Báo cáo trước".
                      We will now hide it if "Báo cáo trước" is selected.
                  */}
                  <AnimatePresence>
                    {form.reportMethod === "Báo cáo sau" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 0 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        className="col-span-2 overflow-hidden"
                      >
                        <FilterField
                          label="Chọn đề nghị XKNB"
                          placeholder={
                            !form.startDate || !form.endDate
                              ? "Vui lòng chọn Từ ngày & Đến ngày trước"
                              : "Chọn đề nghị XKNB"
                          }
                          value={form.xknb}
                          onChange={(val: string) =>
                            setForm({ ...form, xknb: val })
                          }
                          options={
                            !form.startDate || !form.endDate
                              ? []
                              : ["XK25_0014767", "XK25_0014768", "XK25_0014769"]
                          }
                          disabled={!form.startDate || !form.endDate}
                          required
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex justify-end gap-4 mt-10">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 border border-[#00529C] text-[#00529C] font-medium rounded-lg hover:bg-blue-50 transition-colors text-[14px] min-w-[100px]"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      if (!isCreateFormValid) return;
                      setIsModalOpen(false);
                      if (onCreateDetail) {
                        onCreateDetail(
                          form.reportMethod === "Báo cáo trước"
                            ? "pre"
                            : "post",
                          "quantity", // defaults to quantity
                        );
                      }
                    }}
                    disabled={!isCreateFormValid}
                    className={`px-6 py-2 bg-[#00529C] text-white font-medium rounded-lg hover:bg-[#00427D] transition-colors text-[14px] min-w-[100px] ${!isCreateFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Tạo mới
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
                placeholder="Tìm kiếm theo mã đề nghị báo cáo, hãng báo cáo..."
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
                className={isFilterOpen ? "rotate-180" : ""}
              />
            </button>
          </div>
        </div>

        {/* Expandable Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden border-t border-gray-100"
            >
              <div className="p-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-[#4A5568]">
                      Mã đề nghị
                    </label>
                    <input
                      type="text"
                      value={filters.code}
                      onChange={(e) =>
                        setFilters({ ...filters, code: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-[13px] focus:outline-none focus:ring-1 focus:ring-[#00529C] focus:border-[#00529C]"
                      placeholder="Nhập mã đề nghị"
                    />
                  </div>
                  <FilterField
                    label="Hình thức báo cáo"
                    placeholder="Chọn hình thức báo cáo"
                    value={filters.objective}
                    onChange={(val: string) =>
                      setFilters({ ...filters, objective: val })
                    }
                    options={["Báo cáo trước", "Báo cáo sau"]}
                  />
                  <FilterField
                    label="Người tạo"
                    placeholder="Chọn người tạo"
                    value={filters.creator}
                    onChange={(val: string) =>
                      setFilters({ ...filters, creator: val })
                    }
                    options={["Nguyễn Văn A", "Trần Xuân B", "Phạm Văn D"]}
                  />
                  <FilterField
                    label="Trạng thái"
                    placeholder="Chọn trạng thái"
                    value={filters.status}
                    onChange={(val: string) =>
                      setFilters({ ...filters, status: val })
                    }
                    options={Object.entries(statusMap).map(([id, info]) => ({
                      id,
                      name: info.label,
                    }))}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FilterField
                      label="Từ ngày"
                      placeholder="DD/MM/YYYY"
                      value={filters.startDate}
                      onChange={(val: string) =>
                        setFilters({ ...filters, startDate: val })
                      }
                      isDate
                    />
                    <FilterField
                      label="Đến ngày"
                      placeholder="DD/MM/YYYY"
                      value={filters.endDate}
                      onChange={(val: string) =>
                        setFilters({ ...filters, endDate: val })
                      }
                      isDate
                    />
                  </div>
                </div>

                <div className="flex justify-center gap-4 mt-10">
                  <button
                    onClick={handleReset}
                    className="px-10 py-2 border border-[#00529C] text-[#00529C] font-medium rounded-md hover:bg-blue-50 transition-colors text-[14px]"
                  >
                    Reset
                  </button>
                  <button className="px-10 py-2 bg-[#00529C] text-white font-medium rounded-md hover:bg-[#00427D] transition-colors text-[14px]">
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
                <th className="px-4 py-4 text-[13px] font-semibold text-[#002D56] w-16 font-sans tracking-tight">
                  No
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-[#002D56] w-40 font-sans tracking-tight whitespace-nowrap">
                  Mã đề nghị
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-[#002D56] w-64 whitespace-nowrap font-sans tracking-tight">
                  Từ ngày - Đến ngày
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-[#002D56] font-sans tracking-tight whitespace-nowrap text-nowrap">
                  Hình thức báo cáo
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-[#002D56] w-40 font-sans tracking-tight whitespace-nowrap">
                  Hãng
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-[#002D56] w-48 font-sans tracking-tight whitespace-nowrap">
                  Trung tâm kinh doanh
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-[#002D56] w-56 font-sans tracking-tight whitespace-nowrap">
                  Người tạo
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-[#002B49] w-44 font-sans tracking-tight whitespace-nowrap">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((req, index) => (
                  <tr
                    key={req.id}
                    className={`border-b border-gray-50 hover:bg-[#F1F5F9]/50 transition-colors ${index % 2 === 1 ? "bg-[#FCFDFF]" : "bg-white"}`}
                  >
                    <td className="px-4 py-3.5 text-[13px] text-gray-700 font-medium">
                      {(index + 1).toString().padStart(2, "0")}
                    </td>
                    <td
                      onClick={() => {
                        if (onViewDetail) {
                          onViewDetail(
                            req.method === "Báo cáo trước" ? "pre" : "post",
                            "quantity",
                          );
                        }
                      }}
                      className="px-4 py-3.5 text-[13px] text-[#007BFF] font-semibold cursor-pointer hover:underline"
                    >
                      {req.code}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-700 font-medium">
                      {req.period}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-700 font-medium whitespace-nowrap">
                      {req.method}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-700 font-medium">
                      <span className="px-2 py-0.5 bg-blue-50 text-[#00529C] rounded border border-blue-100 font-bold text-[11px]">
                        {req.brand}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-700 font-medium whitespace-nowrap">
                      {req.businessCenter}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-700 font-medium">
                      {req.creator}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold shadow-sm ${statusMap[req.status].bg} ${statusMap[req.status].text}`}
                      >
                        {statusMap[req.status].label}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
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
            Tổng {filteredData.length} bản ghi
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <button className="p-1 px-2 text-gray-400 hover:text-gray-600 rounded-md border border-gray-200 mr-2 hover:bg-gray-50 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[#00529C] text-white text-[13px] font-medium shadow-sm">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 text-[13px] transition-colors">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 text-[13px] transition-colors">
                3
              </button>
              <span className="px-2 text-gray-400">...</span>
              <button className="w-10 h-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 text-[13px] transition-colors">
                123
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
    </div>
  );
}
