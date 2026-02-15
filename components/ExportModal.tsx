"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileText, FileSpreadsheet, Database, Table, Check, Download, Calendar, ChevronDown, X, Sparkles, CheckCircle2, ArrowDownToLine, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getExportData } from "@/actions/export";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type ExportFormat = "PDF" | "CSV" | "JSON" | "XLSX";
type DateRange = "7" | "30" | "90" | "ALL";

interface ExportModalProps {
    trigger?: React.ReactNode;
}

// ─── Custom Checkbox ────────────────────────────────────────────
function GlassCheckbox({
    checked,
    onChange,
    icon,
    label,
    description,
    color = "teal",
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    icon: string;
    label: string;
    description: string;
    color?: "teal" | "blue";
}) {
    return (
        <motion.button
            type="button"
            onClick={() => onChange(!checked)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
                "flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 w-full text-left group cursor-pointer",
                checked
                    ? color === "teal"
                        ? "bg-teal-500/10 border-teal-500/30 shadow-[0_0_20px_-8px_rgba(45,212,191,0.2)]"
                        : "bg-blue-500/10 border-blue-500/30 shadow-[0_0_20px_-8px_rgba(59,130,246,0.2)]"
                    : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1]"
            )}
        >
            {/* Icon */}
            <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-300 shrink-0",
                checked
                    ? color === "teal"
                        ? "bg-teal-500/15 shadow-[0_0_10px_-3px_rgba(45,212,191,0.3)]"
                        : "bg-blue-500/15 shadow-[0_0_10px_-3px_rgba(59,130,246,0.3)]"
                    : "bg-white/[0.05]"
            )}>
                {icon}
            </div>

            {/* Label */}
            <div className="flex-1 min-w-0">
                <div className={cn(
                    "text-sm font-semibold transition-colors",
                    checked ? "text-white" : "text-slate-400"
                )}>{label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{description}</div>
            </div>

            {/* Custom Check */}
            <div className={cn(
                "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 shrink-0",
                checked
                    ? color === "teal"
                        ? "bg-teal-500 border-teal-500 shadow-[0_0_10px_-2px_rgba(45,212,191,0.5)]"
                        : "bg-blue-500 border-blue-500 shadow-[0_0_10px_-2px_rgba(59,130,246,0.5)]"
                    : "border-white/20 bg-white/[0.03] group-hover:border-white/30"
            )}>
                <AnimatePresence mode="wait">
                    {checked && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        >
                            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.button>
    );
}

// ─── Export Modal ────────────────────────────────────────────────
export function ExportModal({ trigger }: ExportModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [format, setFormat] = useState<ExportFormat>("PDF");
    const [dateRange, setDateRange] = useState<DateRange>("30");
    const [includeTransactions, setIncludeTransactions] = useState(true);
    const [includeGoals, setIncludeGoals] = useState(true);
    const [isDateOpen, setIsDateOpen] = useState(false);

    const dateOptions = [
        { value: "7", label: "Last 7 Days" },
        { value: "30", label: "Last 30 Days" },
        { value: "90", label: "Last 3 Months" },
        { value: "ALL", label: "All Time" },
    ];

    const handleExport = async () => {
        setLoading(true);
        try {
            let startDate: Date | undefined;
            const endDate = new Date();

            if (dateRange !== "ALL") {
                const days = parseInt(dateRange);
                startDate = new Date();
                startDate.setDate(endDate.getDate() - days);
            }

            const { success, data, error } = await getExportData(startDate, endDate);

            if (!success || !data) {
                console.error("Export failed:", error);
                toast.error("Export failed. Please try again.");
                setLoading(false);
                return;
            }

            const timestamp = new Date().toISOString().split("T")[0];
            const filename = `myduid_export_${timestamp}`;
            let exportedFilename = "";

            if (format === "JSON") {
                const exportData: any = {};
                if (includeTransactions) exportData.transactions = data.transactions;
                if (includeGoals) exportData.goals = data.goals;

                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
                exportedFilename = `${filename}.json`;
                saveAs(blob, exportedFilename);
            } else if (format === "CSV") {
                if (includeTransactions) {
                    const ws = XLSX.utils.json_to_sheet(data.transactions.map(t => ({
                        Date: new Date(t.date).toLocaleDateString(),
                        Type: t.type,
                        Category: t.category,
                        Amount: t.amount,
                        Description: t.description
                    })));
                    const csv = XLSX.utils.sheet_to_csv(ws);
                    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
                    exportedFilename = `${filename}_transactions.csv`;
                    saveAs(blob, exportedFilename);
                }
                if (includeGoals && !includeTransactions) {
                    const ws = XLSX.utils.json_to_sheet(data.goals.map(g => ({
                        Name: g.name,
                        Target: g.targetAmount,
                        Current: g.currentAmount,
                        Deadline: g.deadline ? new Date(g.deadline).toLocaleDateString() : "N/A"
                    })));
                    const csv = XLSX.utils.sheet_to_csv(ws);
                    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
                    exportedFilename = `${filename}_goals.csv`;
                    saveAs(blob, exportedFilename);
                }
            } else if (format === "XLSX") {
                const wb = XLSX.utils.book_new();

                if (includeTransactions) {
                    const wsT = XLSX.utils.json_to_sheet(data.transactions.map(t => ({
                        Date: new Date(t.date).toLocaleDateString(),
                        Type: t.type,
                        Category: t.category,
                        Amount: t.amount,
                        Description: t.description
                    })));
                    XLSX.utils.book_append_sheet(wb, wsT, "Transactions");
                }

                if (includeGoals) {
                    const wsG = XLSX.utils.json_to_sheet(data.goals.map(g => ({
                        Name: g.name,
                        Target: g.targetAmount,
                        Current: g.currentAmount,
                        Deadline: g.deadline ? new Date(g.deadline).toLocaleDateString() : "N/A"
                    })));
                    XLSX.utils.book_append_sheet(wb, wsG, "Goals");
                }

                exportedFilename = `${filename}.xlsx`;
                XLSX.writeFile(wb, exportedFilename);
            } else if (format === "PDF") {
                const doc = new jsPDF();

                doc.setFontSize(20);
                doc.text("MyDuid Financial Report", 14, 22);
                doc.setFontSize(10);
                doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

                let yPos = 40;

                if (includeTransactions) {
                    doc.setFontSize(14);
                    doc.text("Transactions", 14, yPos);
                    yPos += 10;

                    autoTable(doc, {
                        startY: yPos,
                        head: [["Date", "Type", "Category", "Amount", "Description"]],
                        body: data.transactions.map(t => [
                            new Date(t.date).toLocaleDateString(),
                            t.type,
                            t.category,
                            `Rp ${t.amount.toLocaleString("id-ID")}`,
                            t.description
                        ]),
                        theme: 'grid',
                        headStyles: { fillColor: [20, 184, 166] }
                    });

                    // @ts-ignore
                    yPos = doc.lastAutoTable.finalY + 20;
                }

                if (includeGoals) {
                    if (yPos > 250) {
                        doc.addPage();
                        yPos = 30;
                    }

                    doc.setFontSize(14);
                    doc.text("Saving Goals", 14, yPos);
                    yPos += 10;

                    autoTable(doc, {
                        startY: yPos,
                        head: [["Name", "Target", "Current", "Deadline"]],
                        body: data.goals.map(g => [
                            g.name,
                            `Rp ${g.targetAmount.toLocaleString("id-ID")}`,
                            `Rp ${g.currentAmount.toLocaleString("id-ID")}`,
                            g.deadline ? new Date(g.deadline).toLocaleDateString() : "N/A"
                        ]),
                        theme: 'grid',
                        headStyles: { fillColor: [20, 184, 166] }
                    });
                }

                exportedFilename = `${filename}.pdf`;
                doc.save(exportedFilename);
            }

            // Success toast
            const dataTypes = [];
            if (includeTransactions) dataTypes.push("transactions");
            if (includeGoals) dataTypes.push("goals");

            toast.success(`${format} exported successfully!`, {
                description: `${dataTypes.join(" & ")} saved as ${exportedFilename}`,
                icon: <CheckCircle2 className="w-5 h-5 text-teal-400" />,
            });

            setOpen(false);
        } catch (error) {
            console.error("Export error:", error);
            toast.error("Something went wrong during export.");
        }
        setLoading(false);
    };

    const formats = [
        { id: "PDF", label: "PDF Document", icon: FileText, desc: "Best for sharing & printing", color: "from-rose-500/20 to-orange-500/20" },
        { id: "CSV", label: "CSV Spreadsheet", icon: Table, desc: "Best for data analysis", color: "from-emerald-500/20 to-teal-500/20" },
        { id: "XLSX", label: "Excel Workbook", icon: FileSpreadsheet, desc: "Best for Excel / Sheets", color: "from-green-500/20 to-emerald-500/20" },
        { id: "JSON", label: "JSON Data", icon: Database, desc: "Raw data format", color: "from-blue-500/20 to-cyan-500/20" },
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="glass-button h-10 px-4 rounded-xl flex items-center gap-2 text-white text-sm font-medium hover:text-teal-400 transition-colors border border-teal-500/20"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export Data</span>
                    </motion.button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl p-0 border-0 text-white overflow-visible bg-transparent shadow-none [&>button]:hidden">
                <DialogTitle className="sr-only">Export Data</DialogTitle>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    className="relative rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/40 overflow-visible max-h-[85vh] overflow-y-auto"
                    style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
                >
                    {/* Top accent glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full blur-3xl opacity-25 bg-teal-500 pointer-events-none" />

                    <div className="relative z-10 p-5 sm:p-8">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <ArrowDownToLine className="w-4 h-4 text-teal-400" />
                                    <h2 className="text-xl font-bold text-white tracking-tight">Export Data</h2>
                                </div>
                                <DialogDescription className="text-sm text-slate-500">
                                    Download your financial data in any format.
                                </DialogDescription>
                            </div>
                            <DialogClose className="text-slate-500 hover:text-white transition-colors rounded-xl p-2 hover:bg-white/10 outline-none">
                                <X className="w-5 h-5" />
                            </DialogClose>
                        </div>

                        {/* Format Selection */}
                        <div className="mb-6">
                            <label className="block text-[10px] font-bold text-slate-500 mb-3 ml-1 uppercase tracking-widest">File Format</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {formats.map((f) => (
                                    <motion.button
                                        key={f.id}
                                        type="button"
                                        onClick={() => setFormat(f.id as ExportFormat)}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className={cn(
                                            "relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 text-center overflow-hidden",
                                            format === f.id
                                                ? "bg-teal-500/10 border-teal-500/35 shadow-[0_0_20px_-5px_rgba(45,212,191,0.2)]"
                                                : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1]"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                                            format === f.id ? "bg-teal-500/15 text-teal-400" : "bg-white/[0.05] text-slate-500"
                                        )}>
                                            <f.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className={cn("text-xs font-bold transition-colors", format === f.id ? "text-white" : "text-slate-400")}>{f.label}</div>
                                            <div className="text-[9px] text-slate-500 mt-0.5">{f.desc}</div>
                                        </div>
                                        {format === f.id && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute top-2 right-2 w-4 h-4 rounded-full bg-teal-500 flex items-center justify-center"
                                            >
                                                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Date Range & Include Data */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            {/* Date Range */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Date Range</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsDateOpen(!isDateOpen)}
                                        className={cn(
                                            "w-full rounded-xl flex items-center px-4 py-3.5 transition-all duration-300 bg-white/[0.04] backdrop-blur-xl border",
                                            isDateOpen
                                                ? "border-teal-500/40 shadow-[0_0_20px_-5px_rgba(45,212,191,0.25)]"
                                                : "border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.12]"
                                        )}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center mr-3">
                                            <Calendar className="w-4 h-4 text-teal-400" />
                                        </div>
                                        <span className="text-sm font-medium text-white flex-1 text-left">
                                            {dateOptions.find(d => d.value === dateRange)?.label}
                                        </span>
                                        <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform duration-200", isDateOpen && "rotate-180")} />
                                    </button>

                                    <AnimatePresence>
                                        {isDateOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute top-full left-0 right-0 mt-2 z-[60] bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-hidden"
                                            >
                                                {dateOptions.map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => { setDateRange(opt.value as DateRange); setIsDateOpen(false); }}
                                                        className={cn(
                                                            "w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors",
                                                            dateRange === opt.value
                                                                ? "bg-teal-500/10 text-teal-400"
                                                                : "text-slate-300 hover:bg-white/5 hover:text-white"
                                                        )}
                                                    >
                                                        {dateRange === opt.value && <Check className="w-3.5 h-3.5" />}
                                                        <span className={dateRange !== opt.value ? "ml-[22px]" : ""}>{opt.label}</span>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Include Data — Now just a label that spans the right column */}
                            <div className="flex flex-col justify-center">
                                <label className="block text-[10px] font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Summary</label>
                                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3.5 flex items-center gap-3">
                                    <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
                                    <span className="text-xs text-slate-400">
                                        {dateRange === "ALL" ? "All data" : `Last ${dateRange} days`} • <span className="text-white font-medium">{format}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Include Data Checkboxes */}
                        <div className="mb-8">
                            <label className="block text-[10px] font-bold text-slate-500 mb-3 ml-1 uppercase tracking-widest">Include Data</label>
                            <div className="space-y-3">
                                <GlassCheckbox
                                    checked={includeTransactions}
                                    onChange={setIncludeTransactions}
                                    icon="💳"
                                    label="Transactions"
                                    description="Income & expense records"
                                    color="teal"
                                />
                                <GlassCheckbox
                                    checked={includeGoals}
                                    onChange={setIncludeGoals}
                                    icon="🎯"
                                    label="Savings Goals"
                                    description="Target amounts & progress"
                                    color="blue"
                                />
                            </div>
                            {!includeTransactions && !includeGoals && (
                                <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs text-rose-400 mt-2 ml-1"
                                >
                                    Please select at least one data type to export.
                                </motion.p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            <DialogClose asChild>
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 px-6 py-3.5 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] text-slate-400 font-semibold text-sm hover:bg-white/[0.08] hover:text-white transition-all duration-200"
                                >
                                    Cancel
                                </motion.button>
                            </DialogClose>
                            <motion.button
                                type="button"
                                onClick={handleExport}
                                disabled={loading || (!includeTransactions && !includeGoals)}
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-[2] px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-900 font-bold text-sm flex justify-center items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-teal-500/25"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-5 h-5" />
                                        Download {format}
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
