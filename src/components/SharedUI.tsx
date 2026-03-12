import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure?",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-foreground/20"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0 }}
          className="campus-card-elevated relative z-10 w-full max-w-sm mx-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary text-muted-foreground">
              <X size={16} />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mb-6">{message}</p>
          <div className="flex gap-3 justify-end">
            <button onClick={onClose} className="btn-campus-secondary text-sm px-4 py-2">Cancel</button>
            <button onClick={() => { onConfirm(); onClose(); }} className="btn-campus-destructive">Delete</button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export const PageHeader = ({ title, children }: { title: string; children?: ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{title}</h1>
    {children && <div className="flex gap-3">{children}</div>}
  </div>
);

export const EmptyState = ({ icon: Icon, message }: { icon: any; message: string }) => (
  <div className="campus-card flex flex-col items-center justify-center py-16 text-center">
    <div className="bg-secondary p-4 rounded-xl mb-4">
      <Icon size={32} className="text-muted-foreground" />
    </div>
    <p className="text-muted-foreground text-sm">{message}</p>
  </div>
);

export const useConfirm = () => {
  const [state, setState] = useState<{ open: boolean; resolve: ((v: boolean) => void) | null }>({ open: false, resolve: null });

  const confirm = () =>
    new Promise<boolean>((resolve) => {
      setState({ open: true, resolve });
    });

  const dialog = (
    <ConfirmDialog
      open={state.open}
      onClose={() => { state.resolve?.(false); setState({ open: false, resolve: null }); }}
      onConfirm={() => { state.resolve?.(true); setState({ open: false, resolve: null }); }}
    />
  );

  return { confirm, dialog };
};
