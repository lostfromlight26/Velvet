import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { useToastStore } from "../../store/toastStore";

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isError = toast.type === "error";

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`
                pointer-events-auto
                flex
                items-center
                justify-between
                gap-3
                rounded-2xl
                border
                p-4
                shadow-2xl
                backdrop-blur-xl
                ${
                  isSuccess
                    ? "border-violet-500/40 bg-zinc-900/90 text-white shadow-[0_0_25px_rgba(168,85,247,0.25)]"
                    : isError
                    ? "border-red-500/40 bg-zinc-900/90 text-white shadow-[0_0_25px_rgba(239,68,68,0.25)]"
                    : "border-white/10 bg-zinc-900/90 text-white shadow-xl"
                }
              `}
            >
              <div className="flex items-center gap-3 min-w-0">
                {isSuccess ? (
                  <CheckCircle size={20} className="text-violet-400 flex-shrink-0" />
                ) : isError ? (
                  <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                ) : (
                  <Info size={20} className="text-purple-400 flex-shrink-0" />
                )}
                <span className="text-sm font-medium leading-snug truncate">
                  {toast.message}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeToast(toast.id)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition flex-shrink-0"
              >
                <X size={16} />
              </motion.button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
