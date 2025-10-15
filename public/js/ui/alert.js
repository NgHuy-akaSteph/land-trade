
// Alert system for showing notifications

export const hideAlert = () => {
  const existingAlert = document.querySelector('.custom-alert');
  if (existingAlert) {
    existingAlert.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (existingAlert.parentNode) {
        existingAlert.remove();
      }
    }, 300);
  }
}

export const showAlert = (type, message, duration = 4000) => {
  // Remove any existing alerts
  hideAlert();

  // Create alert element
  const alertDiv = document.createElement('div');
  alertDiv.className = `custom-alert alert-${type}`;
  
  // Set alert content
  alertDiv.innerHTML = `
    <div class="alert-content">
      <i class="alert-icon fas ${getAlertIcon(type)}"></i>
      <span class="alert-message">${message}</span>
      <button class="alert-close" onclick="this.parentElement.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;

  // Set alert styles
  alertDiv.style.cssText = getAlertStyles(type);

  // Add to DOM
  document.body.appendChild(alertDiv);

  // Auto remove after duration
  setTimeout(() => {
    hideAlert();
  }, duration);
}

function getAlertIcon(type) {
  switch (type) {
    case 'success':
      return 'fa-check-circle';
    case 'error':
      return 'fa-exclamation-circle';
    case 'warning':
      return 'fa-exclamation-triangle';
    case 'info':
      return 'fa-info-circle';
    default:
      return 'fa-info-circle';
  }
}

function getAlertStyles(type) {
  const baseStyles = `
    position: fixed;
    top: 20px;
    right: 20px;
    min-width: 300px;
    max-width: 500px;
    padding: 0;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    font-family: 'Inter', sans-serif;
    animation: slideInRight 0.3s ease-out;
    border-left: 4px solid;
  `;

  const typeStyles = {
    success: `
      background: #f0fdf4;
      border-left-color: #10b981;
      color: #065f46;
    `,
    error: `
      background: #fef2f2;
      border-left-color: #ef4444;
      color: #991b1b;
    `,
    warning: `
      background: #fffbeb;
      border-left-color: #f59e0b;
      color: #92400e;
    `,
    info: `
      background: #eff6ff;
      border-left-color: #3b82f6;
      color: #1e40af;
    `
  };

  return baseStyles + (typeStyles[type] || typeStyles.info);
}

// Initialize alert CSS
const initAlertCSS = () => {
  if (document.querySelector('#alert-styles')) return;

  const alertCSS = `
    .custom-alert .alert-content {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
    }

    .custom-alert .alert-icon {
      font-size: 18px;
      flex-shrink: 0;
    }

    .custom-alert .alert-message {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
    }

    .custom-alert .alert-close {
      background: none;
      border: none;
      font-size: 14px;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
      flex-shrink: 0;
      padding: 4px;
      border-radius: 4px;
    }

    .custom-alert .alert-close:hover {
      opacity: 1;
      background: rgba(0, 0, 0, 0.05);
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }

    @media (max-width: 480px) {
      .custom-alert {
        left: 10px !important;
        right: 10px !important;
        min-width: auto !important;
        max-width: none !important;
      }
    }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.id = 'alert-styles';
  styleSheet.textContent = alertCSS;
  document.head.appendChild(styleSheet);
};

// Auto-initialize CSS when module loads
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAlertCSS);
  } else {
    initAlertCSS();
  }
}