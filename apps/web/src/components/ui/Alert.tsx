import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export interface AlertProps {
  type?: 'info' | 'warning' | 'danger' | 'success';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  className = '',
}) => {
  const styles = {
    info: 'bg-status-info-bg border-status-info-border text-sky-900',
    warning: 'bg-status-warning-bg border-status-warning-border text-amber-900',
    danger: 'bg-status-danger-bg border-status-danger-border text-red-900',
    success: 'bg-status-success-bg border-status-success-border text-emerald-900',
  };

  const icons = {
    info: <Info className="w-5 h-5 text-status-info flex-shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 text-status-warning flex-shrink-0 mt-0.5" />,
    danger: <AlertCircle className="w-5 h-5 text-status-danger flex-shrink-0 mt-0.5" />,
    success: <CheckCircle className="w-5 h-5 text-status-success flex-shrink-0 mt-0.5" />,
  };

  return (
    <div
      role="alert"
      className={`border rounded-md p-4 flex gap-3 text-sm leading-relaxed ${styles[type]} ${className}`}
    >
      {icons[type]}
      <div className="flex-1">
        {title && <div className="font-semibold mb-1">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
};
