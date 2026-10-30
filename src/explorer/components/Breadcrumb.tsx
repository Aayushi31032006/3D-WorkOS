import React from 'react';
import { ChevronRight } from 'lucide-react';
import { BreadcrumbItem } from '../../types';

export interface BreadcrumbProps {
  trail: BreadcrumbItem[];
  onNavigate: (index: number, item: BreadcrumbItem) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ trail, onNavigate }) => {
  return (
    <nav className="wos-breadcrumb-bar" aria-label="Breadcrumb navigation">
      {trail.map((crumb, idx) => {
        const isLast = idx === trail.length - 1;

        return (
          <React.Fragment key={crumb.id + '_' + idx}>
            {idx > 0 && (
              <ChevronRight size={14} className="wos-breadcrumb-separator" />
            )}
            {isLast ? (
              <span className="wos-breadcrumb-current" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <button
                className="wos-breadcrumb-crumb"
                onClick={() => onNavigate(idx, crumb)}
                style={{
                  background: 'none',
                  border: 'none',
                  font: 'inherit',
                  cursor: 'pointer'
                }}
              >
                {crumb.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
