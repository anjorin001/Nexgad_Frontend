/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// Toast types
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextValue {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string, options?: Partial<Toast>) => void;
  error: (title: string, message?: string, options?: Partial<Toast>) => void;
  warning: (title: string, message?: string, options?: Partial<Toast>) => void;
  info: (title: string, message?: string, options?: Partial<Toast>) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// Toast component
const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ 
  toast, 
  onRemove 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, toast.duration || 8000);
      
      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getColorClasses = () => {
    switch (toast.type) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800';
      case 'error':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'info':
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800';
      default:
        return 'border-gray-200 bg-white dark:bg-neutral-900 dark:border-neutral-700';
    }
  };

  return (
    <div
      className={`
        relative flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm
        transition-all duration-300 ease-out transform max-w-sm w-full
        ${getColorClasses()}
        ${isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
        }
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
          {toast.title}
        </h4>
        {toast.message && (
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {toast.message}
          </p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-sm font-medium text-[#5f80ed] hover:text-[#4a6bc7] transition-colors"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={handleRemove}
        className="flex-shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress bar for timed toasts */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#5f80ed] to-[#4a6de3] rounded-b-xl animate-shrink-width"></div>
      )}
    </div>
  );
};

// Toast container
const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void }> = ({ 
  toasts, 
  onRemove 
}) => {
  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none"
      style={{ maxHeight: 'calc(100vh - 2rem)' }}
    >
      <div className="flex flex-col gap-3 overflow-hidden">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={onRemove} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Toast provider
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toastData: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = { id, ...toastData };
    
    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({ type: 'success', title, message, ...options });
  }, [addToast]);

  const error = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({ type: 'error', title, message, duration: 7000, ...options });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({ type: 'warning', title, message, duration: 6000, ...options });
  }, [addToast]);

  const info = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({ type: 'info', title, message, ...options });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <style>{`
        @keyframes shrink-width {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-shrink-width {
          animation: shrink-width var(--duration, 5s) linear forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Demo component to show usage
export const ToastDemo: React.FC = () => {
  const toast = useToast();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-neutral-900 dark:to-neutral-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Custom Toast Notifications
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Beautiful, responsive, and easy-to-use toast notifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => toast.success('Success!', 'Your action was completed successfully.')}
            className="p-4 bg-green-100 text-green-800 rounded-xl hover:bg-green-200 transition-colors font-medium"
          >
            Show Success Toast
          </button>

          <button
            onClick={() => toast.error('Error!', 'Something went wrong. Please try again.')}
            className="p-4 bg-red-100 text-red-800 rounded-xl hover:bg-red-200 transition-colors font-medium"
          >
            Show Error Toast
          </button>

          <button
            onClick={() => toast.warning('Warning!', 'Please check your input before proceeding.')}
            className="p-4 bg-yellow-100 text-yellow-800 rounded-xl hover:bg-yellow-200 transition-colors font-medium"
          >
            Show Warning Toast
          </button>

          <button
            onClick={() => toast.info('Info', 'Here is some useful information for you.')}
            className="p-4 bg-blue-100 text-blue-800 rounded-xl hover:bg-blue-200 transition-colors font-medium"
          >
            Show Info Toast
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => toast.addToast({
              type: 'success',
              title: 'Custom Duration',
              message: 'This toast will disappear in 10 seconds.',
              duration: 10000
            })}
            className="p-4 bg-purple-100 text-purple-800 rounded-xl hover:bg-purple-200 transition-colors font-medium"
          >
            10 Second Toast
          </button>

          <button
            onClick={() => toast.addToast({
              type: 'info',
              title: 'Persistent Toast',
              message: 'This toast won\'t auto-dismiss. Click X to close.',
              duration: 0
            })}
            className="p-4 bg-indigo-100 text-indigo-800 rounded-xl hover:bg-indigo-200 transition-colors font-medium"
          >
            Persistent Toast
          </button>
        </div>

        <button
          onClick={() => toast.addToast({
            type: 'success',
            title: 'Action Toast',
            message: 'This toast has an action button.',
            action: {
              label: 'Undo',
              onClick: () => toast.info('Undo clicked!', 'Action button was pressed.')
            }
          })}
          className="w-full p-4 bg-gradient-to-r from-[#5f80ed] to-[#4a6de3] text-white rounded-xl hover:from-[#4a6de3] hover:to-[#5f80ed] transition-all font-medium"
        >
          Toast with Action Button
        </button>

        <div className="mt-12 bg-white dark:bg-neutral-900 rounded-xl p-6 border border-gray-200 dark:border-neutral-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">1. Wrap your app with ToastProvider:</h3>
              <code className="block bg-gray-100 dark:bg-neutral-800 p-3 rounded-lg text-gray-800 dark:text-gray-200">
                {`<ToastProvider>\n  <App />\n</ToastProvider>`}
              </code>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">2. Use the useToast hook:</h3>
              <code className="block bg-gray-100 dark:bg-neutral-800 p-3 rounded-lg text-gray-800 dark:text-gray-200">
                {`const toast = useToast();\n\n// Simple usage\ntoast.success('Success!', 'Operation completed');\ntoast.error('Error!', 'Something went wrong');\n\n// Advanced usage\ntoast.addToast({\n  type: 'info',\n  title: 'Custom Toast',\n  message: 'With custom options',\n  duration: 10000,\n  action: { label: 'Undo', onClick: () => {} }\n});`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component wrapped with provider
const App: React.FC = () => {
  return (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  );
};

export default App;