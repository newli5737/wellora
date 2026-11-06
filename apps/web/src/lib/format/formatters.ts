export function formatCurrency(minorAmount?: number | null, currency: string = 'VND'): string {
  if (minorAmount === undefined || minorAmount === null) {
    return 'Liên hệ xác nhận';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
  }).format(minorAmount);
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;

    const time = d.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Ho_Chi_Minh',
    });

    const date = d.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Asia/Ho_Chi_Minh',
    });

    return `${time} — ${date}`;
  } catch {
    return isoString;
  }
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Asia/Ho_Chi_Minh',
    });
  } catch {
    return isoString;
  }
}

export function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Ho_Chi_Minh',
    });
  } catch {
    return isoString;
  }
}

export function getStatusBadgeInfo(status: string): {
  label: string;
  badgeClass: string;
} {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return {
        label: 'Chờ xác nhận',
        badgeClass: 'bg-status-warning-bg text-status-warning border-status-warning-border',
      };
    case 'CONFIRMED':
      return {
        label: 'Đã xác nhận',
        badgeClass: 'bg-status-success-bg text-status-success border-status-success-border',
      };
    case 'CANCELLED':
      return {
        label: 'Đã hủy',
        badgeClass: 'bg-status-danger-bg text-status-danger border-status-danger-border',
      };
    case 'COMPLETED':
      return {
        label: 'Đã hoàn thành',
        badgeClass: 'bg-status-info-bg text-status-info border-status-info-border',
      };
    case 'NO_SHOW':
      return {
        label: 'Vắng mặt',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      };
    default:
      return {
        label: status,
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      };
  }
}

