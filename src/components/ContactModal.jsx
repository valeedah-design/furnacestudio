import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import { EASE } from "@/components/Shared";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const TYPES = [
  "Restaurant / Café",
  "Salon / Barbershop",
  "Trades",
  "Shop / Retail",
  "Clinic",
  "Studio",
  "Other local business",
];

const EMPTY = {
  name: "",
  business: "",
  email: "",
  business_type: TYPES[0],
  message: "",
};

const inputCls =
  "w-full rounded-none border-b border-white/15 bg-transparent py-3 text-base font-medium text-white placeholder:text-white/25 outline-none transition-colors duration-300 focus:border-ember";

export default function ContactModal({ open, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (open) {
      window.addEventListener("keydown", onKey);
      window.__lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      window.__lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setSent(false);
        setForm(EMPTY);
      }, 350);
      return () => clearTimeout(t);
    }
  }, [open]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch(`${API}/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      setSent(true);
      toast.success("Enquiry received. We’ll reply within one working day.");
    } catch {
      toast.error("Something broke. Try again — or email hello@furnace.studio.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 md:items-center md:p-6">
          <motion.div
            data-testid="contact-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />
          <motion.div
            data-testid="contact-modal"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative max-h-[92svh] w-full max-w-xl overflow-y-auto border border-white/10 bg-forge-panel p-7 md:p-10"
          >
            <button
              data-testid="contact-modal-close"
              onClick={onClose}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center border border-white/15 text-white/50 transition-colors duration-300 hover:border-ember hover:text-ember"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {sent ? (
              <div className="py-10 text-center" data-testid="enquiry-success">
                <div className="mx-auto mb-8 h-2 w-2 bg-temper" />
                <h3 className="text-4xl font-extrabold uppercase tracking-tight md:text-5xl">
                  Received<span className="text-temper">.</span>
                </h3>
                <p className="mx-auto mt-6 max-w-xs text-base font-medium text-white/55">
                  We’ll reply within one working day. Talk soon.
                </p>
                <button
                  data-testid="enquiry-success-close"
                  onClick={onClose}
                  className="mt-10 border border-white/20 px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:border-temper hover:bg-temper"
                >
                  Back to the site
                </button>
              </div>
            ) : (
              <>
                <div className="mb-2 h-2 w-2 bg-ember" />
                <h3 className="text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
                  Start a project<span className="text-ember">.</span>
                </h3>
                <p className="mt-3 text-sm font-medium text-white/50">
                  Tell us what’s raw. We’ll bring the heat.
                </p>

                <form onSubmit={submit} className="mt-8 space-y-7">
                  <div>
                    <label htmlFor="enquiry-name" className="mb-1 block text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
                      Your name
                    </label>
                    <input
                      id="enquiry-name"
                      data-testid="enquiry-name-input"
                      required
                      value={form.name}
                      onChange={set("name")}
                      placeholder="Alex Rivera"
                      className={inputCls}
                    />
                  </div>
                  <div className="grid gap-7 md:grid-cols-2">
                    <div>
                      <label htmlFor="enquiry-business" className="mb-1 block text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
                        Business
                      </label>
                      <input
                        id="enquiry-business"
                        data-testid="enquiry-business-input"
                        required
                        value={form.business}
                        onChange={set("business")}
                        placeholder="Ember & Oak"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label htmlFor="enquiry-email" className="mb-1 block text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
                        Email
                      </label>
                      <input
                        id="enquiry-email"
                        data-testid="enquiry-email-input"
                        required
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                        placeholder="alex@emberandoak.co.uk"
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="enquiry-type" className="mb-1 block text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
                      Type of business
                    </label>
                    <select
                      id="enquiry-type"
                      data-testid="enquiry-type-select"
                      value={form.business_type}
                      onChange={set("business_type")}
                      className={`${inputCls} cursor-pointer bg-forge-panel`}
                    >
                      {TYPES.map((t) => (
                        <option key={t} value={t} className="bg-forge-panel">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="enquiry-message" className="mb-1 block text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
                      What’s not working?
                    </label>
                    <textarea
                      id="enquiry-message"
                      data-testid="enquiry-message-input"
                      required
                      rows={3}
                      value={form.message}
                      onChange={set("message")}
                      placeholder="Good business. Quiet phone."
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                  <button
                    data-testid="enquiry-submit-button"
                    type="submit"
                    disabled={busy}
                    className="w-full bg-ember py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-white hover:text-forge disabled:opacity-50"
                  >
                    {busy ? "Sending…" : "Send it into the furnace"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
