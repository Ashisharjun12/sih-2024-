export const driverStyles = `
.driverjs-theme.driver-active .driver-overlay {
  background: rgba(2, 6, 23, 0.85);
  backdrop-filter: blur(4px);
}

.driverjs-theme.driver-active .driver-popover {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

.driverjs-theme .driver-popover-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(15, 23, 42);
  margin-bottom: 0.5rem;
  border-left: 4px solid rgb(59, 130, 246);
  padding-left: 0.75rem;
}

.driverjs-theme .driver-popover-description {
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgb(71, 85, 105);
  margin-bottom: 1rem;
}

.driverjs-theme .driver-popover-footer {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.driverjs-theme .driver-popover-progress-text {
  font-size: 0.875rem;
  color: rgb(100, 116, 139);
}

.driverjs-theme .driver-popover-prev-btn,
.driverjs-theme .driver-popover-next-btn {
  background: linear-gradient(to right, rgb(59, 130, 246), rgb(37, 99, 235));
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.025em;
}

.driverjs-theme .driver-popover-prev-btn:hover,
.driverjs-theme .driver-popover-next-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.driverjs-theme .driver-popover-close-btn {
  background: rgb(241, 245, 249);
  color: rgb(71, 85, 105);
  border: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.driverjs-theme .driver-popover-close-btn:hover {
  background: rgb(226, 232, 240);
}

.driverjs-theme.driver-active .driver-highlight-element {
  animation: highlight-pulse 2s infinite;
}

@keyframes highlight-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}
`; 