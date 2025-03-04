import { useState, ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import '../.css/TabbedCollectionContainer.css';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  requiresAuth?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
}

interface TabbedCollectionContainerProps {
  tabs: Tab[];
  defaultTabId?: string;
  className?: string;
  onTabChange?: (tabId: string) => void;
}

/**
 * A flexible tabbed container component that can be used for any content.
 * 
 * Features:
 * - Authentication-aware tabs that disable when user isn't authenticated
 * - Support for customization via className
 * - Optional icons in tab buttons
 * - Callback for tab changes
 */
const TabbedCollectionContainer = ({ 
  tabs, 
  defaultTabId,
  className = '',
  onTabChange
}: TabbedCollectionContainerProps): JSX.Element => {
  const { isAuthenticated } = useAuth0();
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id);

  const handleTabClick = (tabId: string, tab: Tab): void => {
    // Skip if tab is disabled
    if (tab.disabled) {
      return;
    }
    
    // Skip if tab requires auth but user isn't authenticated
    if (tab.requiresAuth && !isAuthenticated) {
      return;
    }
    
    setActiveTabId(tabId);
    
    // Call the onTabChange callback if provided
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  return (
    <div className={`tabbed-container ${className}`}>
      <div className="tabs-header">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${
              activeTabId === tab.id ? 'active' : ''
            } ${
              (tab.disabled || (tab.requiresAuth && !isAuthenticated)) ? 'disabled' : ''
            }`}
            onClick={() => handleTabClick(tab.id, tab)}
            disabled={tab.disabled || (tab.requiresAuth && !isAuthenticated)}
            title={
              tab.requiresAuth && !isAuthenticated 
                ? 'Login required to view this content' 
                : undefined
            }
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {activeTab?.content}
      </div>
    </div>
  );
};

export default TabbedCollectionContainer;