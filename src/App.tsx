import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ReportContent from "./components/ReportContent";
import ReportRequestsList from "./components/ReportRequestsList";
import PendingReportRequestsList from "./components/PendingReportRequestsList";
import PostReportDetail from "./components/PostReportDetail";
import CreatePreReportDetail from "./components/CreatePreReportDetail";
import CreatePostReportDetail from "./components/CreatePostReportDetail";
import { INITIAL_BRAND_REPORTS, ExportRecord } from "./constants/mockData";

export default function App() {
  const [currentView, setCurrentView] = useState<
    "export" | "list" | "pending" | "create_detail" | "view_detail"
  >("export");
  const [prevView, setPrevView] = useState<"list" | "pending">("list");
  const [reportType, setReportType] = useState<"pre" | "post">("post");
  const [reportCategory, setReportCategory] = useState<"quantity" | "serial">(
    "quantity",
  );

  // Shared state for brand reports
  const [brandReports, setBrandReports] = useState<ExportRecord[]>(
    INITIAL_BRAND_REPORTS,
  );

  const handleViewDetail = (
    type: "pre" | "post",
    category: "quantity" | "serial",
    from: "list" | "pending",
  ) => {
    setReportType(type);
    setReportCategory(category);
    setPrevView(from);
    setCurrentView("view_detail");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans selection:bg-white-100 text-gray-900">
      <Navbar />
      <div className="flex h-[calc(100vh-48px)] overflow-hidden">
        <Sidebar activeView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {currentView === "export" ? (
                <ReportContent
                  brandReports={brandReports}
                  setBrandReports={setBrandReports}
                />
              ) : currentView === "list" ? (
                <ReportRequestsList
                  onCreateDetail={(type, category) => {
                    setReportType(type);
                    setReportCategory(category);
                    setCurrentView("create_detail");
                  }}
                  onViewDetail={(type, category) =>
                    handleViewDetail(type, category, "list")
                  }
                />
              ) : currentView === "pending" ? (
                <PendingReportRequestsList
                  onViewDetail={(type, category) =>
                    handleViewDetail(type, category, "pending")
                  }
                />
              ) : currentView === "create_detail" ? (
                reportType === "pre" ? (
                  <CreatePreReportDetail
                    category={reportCategory}
                    onBack={() => setCurrentView("list")}
                    onTypeChange={(type) => setReportType(type)}
                    onCategoryChange={(cat) => setReportCategory(cat)}
                  />
                ) : (
                  <CreatePostReportDetail
                    category={reportCategory}
                    onBack={() => setCurrentView("list")}
                    onTypeChange={(type) => setReportType(type)}
                    onCategoryChange={(cat) => setReportCategory(cat)}
                  />
                )
              ) : reportType === "pre" ? (
                <CreatePreReportDetail
                  category={reportCategory}
                  mode="view"
                  isApproveMode={prevView === "pending"}
                  onBack={() => setCurrentView(prevView)}
                  brandReports={brandReports}
                />
              ) : (
                <PostReportDetail
                  type="post"
                  category={reportCategory}
                  isApproveMode={prevView === "pending"}
                  onBack={() => setCurrentView(prevView)}
                  brandReports={brandReports}
                  onAddBrandReport={(report: ExportRecord) =>
                    setBrandReports((prev) => [report, ...prev])
                  }
                  onUpdateBrandReport={(
                    id: string,
                    updates: Partial<ExportRecord>,
                  ) =>
                    setBrandReports((prev) =>
                      prev.map((r) => (r.id === id ? { ...r, ...updates } : r)),
                    )
                  }
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
