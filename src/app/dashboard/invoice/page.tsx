"use client";

import { useState, useRef } from "react";
import { ToolTemplate } from "@/components/ui/ToolTemplate";
import { 
  Receipt, 
  Download, 
  Plus, 
  Trash2, 
  QrCode, 
  Image as ImageIcon,
  Globe,
  Sun,
  Moon,
  Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export default function InvoiceGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [invoiceTheme, setInvoiceTheme] = useState<"light" | "dark">("light");
  const [currency, setCurrency] = useState("₹");
  const [logo, setLogo] = useState<string | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split("T")[0],
    businessName: "",
    businessEmail: "",
    businessAddress: "",
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    items: [{ id: "1", description: "", quantity: 1, rate: 0 }] as InvoiceItem[],
    taxRate: 18,
    discount: 0,
    paymentTerms: "Please pay within 15 days",
    paymentDetails: "",
    upiId: "",
  });

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { id: Math.random().toString(), description: "", quantity: 1, rate: 0 }]
    });
  };

  const removeItem = (id: string) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter(item => item.id !== id)
      });
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setFormData({
      ...formData,
      items: formData.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() * formData.taxRate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - formData.discount;
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadPDF = async () => {
    const html2pdf = (await import("html2pdf.js" as any)).default;
    const element = invoiceRef.current;
    
    // Temporarily hide elements that shouldn't be in PDF if any
    const opt = {
      margin: [0.5, 0.5],
      filename: `${formData.invoiceNumber}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        // Disable modern CSS features that html2canvas doesn't support
        logging: false,
      },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    };
    
    try {
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF Generation Error:", err);
      alert("There was an error generating the PDF. Please try the 'Print' option as a fallback.");
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setShowPreview(true);
      setIsGenerating(false);
    }, 1000);
  };

  const PreviewContent = () => {
    const isLight = invoiceTheme === "light";
    const bgColor = isLight ? "#ffffff" : "#0f172a";
    const textColor = isLight ? "#1e293b" : "#f8fafc";
    const borderColor = isLight ? "#e2e8f0" : "#334155";
    const accentColor = "#8b5cf6";
    const subtextColor = isLight ? "#64748b" : "#94a3b8";

    return (
      <div 
        ref={invoiceRef}
        className="p-10 transition-colors duration-300"
        style={{ 
          minHeight: "800px",
          fontFamily: "'Inter', sans-serif",
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            {logo ? (
              <img src={logo} alt="Logo" className="h-16 w-auto mb-4 object-contain" />
            ) : (
              <div 
                className="w-16 h-16 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: isLight ? "#f1f5f9" : "rgba(255,255,255,0.1)" }}
              >
                <ImageIcon className="w-8 h-8" style={{ opacity: 0.2 }} />
              </div>
            )}
            <h1 className="text-4xl font-bold tracking-tighter">INVOICE</h1>
            <p className="text-sm mt-1 font-mono tracking-wider" style={{ opacity: 0.6 }}>{formData.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <h2 className="font-bold text-xl mb-1">{formData.businessName || "BUSINESS NAME"}</h2>
            <p className="text-sm" style={{ opacity: 0.7 }}>{formData.businessEmail}</p>
            <p className="text-sm whitespace-pre-line mt-1" style={{ opacity: 0.7 }}>{formData.businessAddress}</p>
          </div>
        </div>

        <div className="h-px mb-12" style={{ backgroundColor: textColor, opacity: 0.1 }} />

        {/* Bill To */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-black mb-4" style={{ opacity: 0.3 }}>Bill To</h3>
            <p className="font-bold text-lg">{formData.clientName || "CLIENT NAME"}</p>
            <p className="text-sm" style={{ opacity: 0.7 }}>{formData.clientEmail}</p>
            <p className="text-sm whitespace-pre-line mt-1" style={{ opacity: 0.7 }}>{formData.clientAddress}</p>
          </div>
          <div className="text-right space-y-2">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-black mb-4 text-right" style={{ opacity: 0.3 }}>Invoice Details</h3>
            <p className="text-sm"><span style={{ opacity: 0.4 }} className="uppercase tracking-tighter mr-2">Issued On:</span> {formData.date}</p>
            <p className="text-sm"><span style={{ opacity: 0.4 }} className="uppercase tracking-tighter mr-2">Currency:</span> {currency} (Standard)</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-12">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `2px solid ${isLight ? "#1e293b" : "#ffffff"}` }}>
                <th className="text-left py-4 font-black text-[10px] uppercase tracking-widest">Description</th>
                <th className="text-center py-4 font-black text-[10px] uppercase tracking-widest w-24">Qty</th>
                <th className="text-right py-4 font-black text-[10px] uppercase tracking-widest w-32">Rate</th>
                <th className="text-right py-4 font-black text-[10px] uppercase tracking-widest w-32">Amount</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item) => (
                <tr key={item.id} style={{ borderBottom: `1px solid ${isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}` }}>
                  <td className="py-6 text-sm font-medium">{item.description || "Service/Product description..."}</td>
                  <td className="py-6 text-sm text-center">{item.quantity}</td>
                  <td className="py-6 text-sm text-right">{currency}{item.rate.toLocaleString()}</td>
                  <td className="py-6 text-sm text-right font-bold">{currency}{(item.quantity * item.rate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-16">
          <div className="w-72 space-y-4">
            <div className="flex justify-between text-sm">
              <span style={{ opacity: 0.5 }}>Subtotal</span>
              <span className="font-medium">{currency}{calculateSubtotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ opacity: 0.5 }}>Tax ({formData.taxRate}%)</span>
              <span className="font-medium">{currency}{calculateTax().toLocaleString()}</span>
            </div>
            {formData.discount > 0 && (
              <div className="flex justify-between text-sm font-medium" style={{ color: "#16a34a" }}>
                <span>Discount</span>
                <span>-{currency}{formData.discount.toLocaleString()}</span>
              </div>
            )}
            <div 
              className="flex justify-between pt-6 font-black text-2xl" 
              style={{ borderTop: `2px solid ${isLight ? "#1e293b" : "#ffffff"}` }}
            >
              <span>Total</span>
              <span style={{ color: accentColor }}>{currency}{calculateTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer / Payment */}
        <div 
          className="grid grid-cols-2 gap-12 pt-12 mt-auto" 
          style={{ borderTop: `2px solid ${isLight ? "#f1f5f9" : "rgba(255,255,255,0.05)"}` }}
        >
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-black mb-4" style={{ opacity: 0.3 }}>Terms & Conditions</h3>
            <p className="text-[11px] leading-relaxed italic" style={{ opacity: 0.6 }}>{formData.paymentTerms}</p>
          </div>
          <div className="text-right">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-black mb-4 text-right" style={{ opacity: 0.3 }}>Payment Methods</h3>
            {formData.upiId && <p className="text-sm font-bold mb-1">UPI: {formData.upiId}</p>}
            <p className="text-[11px] whitespace-pre-line" style={{ opacity: 0.6 }}>{formData.paymentDetails}</p>
            {formData.upiId && (
              <div 
                className="inline-block mt-6 p-3 bg-white rounded-xl border shadow-sm"
                style={{ borderColor: "#f1f5f9" }}
              >
                <div className="w-24 h-24 bg-gray-50 flex items-center justify-center">
                  <QrCode className="w-16 h-16" style={{ color: "#e2e8f0" }} />
                </div>
                <p className="text-[8px] text-center mt-2 font-bold uppercase tracking-tighter" style={{ color: "#94a3b8" }}>Scan to Pay</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ opacity: 0.2 }}>Thank you for your business</p>
        </div>
      </div>
    );
  };

  return (
    <ToolTemplate
      title="Premium Invoice Generator"
      description="Create world-class, professional invoices for your business or freelance work."
      icon={Receipt}
      isGenerating={isGenerating}
      onGenerate={handleGenerate}
      result={
        showPreview ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-2 p-2 bg-white/5 rounded-xl border border-white/5 backdrop-blur-md sticky top-0 z-20">
              <div className="flex gap-1">
                <Button 
                  variant={invoiceTheme === "light" ? "secondary" : "ghost"} 
                  size="sm"
                  onClick={() => setInvoiceTheme("light")}
                  className="h-8 px-3 rounded-lg text-xs"
                >
                  <Sun className="w-3.5 h-3.5 mr-1.5" /> Light
                </Button>
                <Button 
                  variant={invoiceTheme === "dark" ? "secondary" : "ghost"} 
                  size="sm"
                  onClick={() => setInvoiceTheme("dark")}
                  className="h-8 px-3 rounded-lg text-xs"
                >
                  <Moon className="w-3.5 h-3.5 mr-1.5" /> Dark
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={downloadPDF} className="h-8 px-3 rounded-lg border-white/10 hover:bg-white/5 text-xs">
                  <Download className="w-3.5 h-3.5 mr-1.5 text-primary" /> PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.print()} className="h-8 px-3 rounded-lg border-white/10 hover:bg-white/5 text-xs">
                  <Printer className="w-3.5 h-3.5 mr-1.5" /> Print
                </Button>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-xl border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <PreviewContent />
            </motion.div>

            <Button 
              variant="ghost" 
              className="w-full text-gray-400 hover:text-white text-xs uppercase tracking-widest font-bold"
              onClick={() => setShowPreview(false)}
            >
              Back to Editor
            </Button>
          </div>
        ) : null
      }
    >
      <div className="space-y-10 pb-20">
        {/* Logo Section */}
        <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/5 group transition-all hover:border-primary/30">
          <div className="relative w-24 h-24 bg-black/50 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden group-hover:border-primary/50 transition-colors">
            {logo ? (
              <img src={logo} alt="Logo Preview" className="w-full h-full object-contain p-2" />
            ) : (
              <div className="text-center">
                <ImageIcon className="w-8 h-8 text-white/10 mx-auto mb-1" />
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Upload Logo</span>
              </div>
            )}
            <input 
              type="file" 
              onChange={handleLogoUpload}
              className="absolute inset-0 opacity-0 cursor-pointer" 
              accept="image/*"
            />
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/90 mb-1">Brand Identity</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Add your professional logo to stand out. Recommended size: 400x400px.</p>
          </div>
        </div>

        {/* Business & Client Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 mb-2">
              <Globe className="w-3 h-3" /> Your Business
            </h3>
            <div className="space-y-3">
              <input 
                placeholder="Business Name"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-primary/50 outline-none transition-all text-sm"
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
              />
              <input 
                placeholder="Email Address"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-primary/50 outline-none transition-all text-sm"
                value={formData.businessEmail}
                onChange={(e) => setFormData({...formData, businessEmail: e.target.value})}
              />
              <textarea 
                placeholder="Address & Contact Details"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-primary/50 outline-none transition-all text-sm min-h-[100px] resize-none"
                value={formData.businessAddress}
                onChange={(e) => setFormData({...formData, businessAddress: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2 mb-2">
              <Receipt className="w-3 h-3" /> Client Details
            </h3>
            <div className="space-y-3">
              <input 
                placeholder="Client Name"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-primary/50 outline-none transition-all text-sm"
                value={formData.clientName}
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
              />
              <input 
                placeholder="Client Email"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-primary/50 outline-none transition-all text-sm"
                value={formData.clientEmail}
                onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
              />
              <textarea 
                placeholder="Client Address"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-primary/50 outline-none transition-all text-sm min-h-[100px] resize-none"
                value={formData.clientAddress}
                onChange={(e) => setFormData({...formData, clientAddress: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Invoice Settings */}
        <div className="grid grid-cols-3 gap-4 p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-xl">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500">Invoice ID</label>
            <input 
              className="w-full bg-transparent border-b border-white/10 focus:border-primary outline-none text-sm font-mono tracking-tighter pb-1"
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500">Issue Date</label>
            <input 
              type="date"
              className="w-full bg-transparent border-b border-white/10 focus:border-primary outline-none text-sm pb-1 [color-scheme:dark]"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500">Currency</label>
            <div className="flex gap-2 pt-1">
              {["₹", "$", "€"].map((c) => (
                <button 
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    currency === c ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-white/5 text-gray-500 hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Services & Items</h3>
            <span className="text-[10px] font-bold text-primary/50 uppercase tracking-widest">{formData.items.length} Item(s)</span>
          </div>
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {formData.items.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-3 group items-start"
                >
                  <div className="flex-[4]">
                    <input 
                      placeholder="Item description..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-primary/50 outline-none text-sm"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    />
                  </div>
                  <div className="w-24">
                    <input 
                      type="number"
                      placeholder="Qty"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-primary/50 outline-none text-sm text-center"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="w-32">
                    <input 
                      type="number"
                      placeholder="Rate"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-primary/50 outline-none text-sm text-right"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-11 w-11 rounded-xl text-gray-600 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <Button 
            variant="outline" 
            className="w-full border-dashed border-white/10 hover:bg-primary/5 hover:border-primary/50 py-7 rounded-2xl group transition-all"
            onClick={addItem}
          >
            <Plus className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" /> Add New Row
          </Button>
        </div>

        {/* Financial Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
          <div className="space-y-6">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Payments & Terms</h3>
             <div className="space-y-4">
              <div className="relative">
                <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  placeholder="UPI ID (e.g. user@bank)"
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-primary/50 outline-none text-sm"
                  value={formData.upiId}
                  onChange={(e) => setFormData({...formData, upiId: e.target.value})}
                />
              </div>
              <textarea 
                placeholder="Terms, Bank Account, or Notes..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-primary/50 outline-none text-sm min-h-[120px] resize-none"
                value={formData.paymentDetails}
                onChange={(e) => setFormData({...formData, paymentDetails: e.target.value})}
              />
              <input 
                placeholder="Payment Deadline (e.g. Due in 15 days)"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-primary/50 outline-none text-sm italic"
                value={formData.paymentTerms}
                onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
              />
             </div>
          </div>
          <div className="space-y-5 p-8 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl border border-primary/20 shadow-2xl shadow-primary/5">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Subtotal</span>
              <span className="font-bold">{currency}{calculateSubtotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Tax</span>
                <input 
                  type="number"
                  className="w-16 bg-black/30 border border-white/5 rounded-lg px-2 py-1 text-center outline-none text-xs font-bold text-primary"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({...formData, taxRate: parseFloat(e.target.value) || 0})}
                />
                <span className="text-[10px] font-bold text-gray-600">%</span>
              </div>
              <span className="font-bold text-sm">{currency}{calculateTax().toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Discount</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 font-bold">{currency}</span>
                <input 
                  type="number"
                  className="w-24 bg-black/30 border border-white/5 rounded-lg px-2 py-1 text-right outline-none text-xs font-bold text-green-500"
                  value={formData.discount}
                  onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="pt-6 border-t border-primary/20 mt-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Grand Total</span>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Incl. all taxes & discounts</p>
                </div>
                <span className="text-4xl font-black tracking-tighter text-white">
                  <span className="text-primary mr-1">{currency}</span>
                  {calculateTotal().toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolTemplate>
  );
}
