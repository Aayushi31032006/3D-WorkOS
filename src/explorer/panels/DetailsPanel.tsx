import React from 'react';
import { X, ArrowRight, Clock, ShieldAlert } from 'lucide-react';
import { BusinessObject } from '../../types';

export interface DetailsPanelProps {
  object: BusinessObject;
  onClose: () => void;
  onNavigateToObject?: (id: string) => void;
  onOpenExecution?: (recordId: string) => void;
}

export const DetailsPanel: React.FC<DetailsPanelProps> = ({
  object,
  onClose,
  onNavigateToObject,
  onOpenExecution
}) => {
  const isInvoice = object.type === 'invoice';
  const isProject = object.type === 'project';
  const isTask = object.type === 'task';

  // Capitalized title matching Figure 3: "Invoice details", "Customer details", etc.
  const title = `${object.type.charAt(0).toUpperCase() + object.type.slice(1)} details`;

  return (
    <aside 
      className="wos-drawer-panel"
      role="region"
      aria-label={`${object.name} details`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="wos-panel-header">
        <h2 className="wos-panel-title">{title}</h2>
        <button 
          className="wos-panel-close-btn" 
          onClick={onClose}
          aria-label="Close details"
        >
          <X size={16} />
        </button>
      </div>

      <div className="wos-panel-body">
        {/* Restricted warning if applicable */}
        {object.restricted && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            background: '#ffebee',
            color: '#c62828',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 500
          }}>
            <ShieldAlert size={16} />
            <span>Record unavailable or access restricted. Private fields are hidden.</span>
          </div>
        )}

        {/* Customer Field */}
        {object.summaryFields?.['Customer'] && (
          <div className="wos-detail-field">
            <span className="wos-field-label">Customer</span>
            <span className="wos-field-value">{object.summaryFields['Customer']}</span>
          </div>
        )}

        {/* Amount Field */}
        {object.amount && (
          <div className="wos-detail-field">
            <span className="wos-field-label">Amount</span>
            <span className="wos-field-value-amount">{object.amount}</span>
          </div>
        )}

        {/* Status Field */}
        {object.status && (
          <div className="wos-detail-field">
            <span className="wos-field-label">Status</span>
            <span className="wos-field-value">{object.status}</span>
          </div>
        )}

        {/* Due Date Field */}
        {object.dueDate && (
          <div className="wos-detail-field">
            <span className="wos-field-label">Due date</span>
            <span className="wos-field-value">{object.dueDate}</span>
          </div>
        )}

        {/* Linked Project Field (Clickable to navigate to project) */}
        {object.summaryFields?.['Linked project'] && (
          <div className="wos-detail-field">
            <span className="wos-field-label">Linked project</span>
            <button
              onClick={() => {
                if (onNavigateToObject) {
                  // Resolve linked project id
                  onNavigateToObject('proj_alpha');
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                padding: 0,
                color: 'var(--wos-selection)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span>{object.summaryFields['Linked project']}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Parent Project Field (for Task) */}
        {object.summaryFields?.['Parent project'] && !object.summaryFields?.['Linked project'] && (
          <div className="wos-detail-field">
            <span className="wos-field-label">Parent project</span>
            <button
              onClick={() => onNavigateToObject && onNavigateToObject('proj_alpha')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                padding: 0,
                color: 'var(--wos-selection)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span>{object.summaryFields['Parent project']}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Other Summary Fields */}
        {object.summaryFields && Object.entries(object.summaryFields).map(([k, v]) => {
          if (k === 'Customer' || k === 'Linked project' || k === 'Parent project') return null;
          return (
            <div key={k} className="wos-detail-field">
              <span className="wos-field-label">{k}</span>
              <span className="wos-field-value">{String(v)}</span>
            </div>
          );
        })}

        {/* Description if present */}
        {object.description && (
          <div className="wos-detail-field">
            <span className="wos-field-label">Description</span>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'var(--wos-label-muted)' }}>
              {object.description}
            </p>
          </div>
        )}

        {/* WorkOS Execution Action Button (Figure 3 item 3: "Open project in WorkOS") */}
        {(isInvoice || isProject || isTask) && onOpenExecution && (
          <button
            className="wos-primary-action-btn"
            onClick={() => {
              if (isInvoice) {
                // As specified in Figure 3 item 3: "asks WorkOS to open the linked project"
                onOpenExecution('proj_alpha');
              } else {
                onOpenExecution(object.id);
              }
            }}
          >
            {isTask ? 'Open task in WorkOS' : 'Open project in WorkOS'}
          </button>
        )}

        {/* Activity Feed Section */}
        {object.activity && object.activity.length > 0 && (
          <div className="wos-activity-section">
            <h3 className="wos-activity-title">Activity</h3>
            <div className="wos-activity-list">
              {object.activity.map(act => (
                <div key={act.id} className="wos-activity-item">
                  <span className="wos-activity-date">{act.date} ·</span>
                  <span className="wos-activity-desc">{act.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
