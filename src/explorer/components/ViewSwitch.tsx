import React from 'react';
import { Box, List as ListIcon } from 'lucide-react';

export interface ViewSwitchProps {
  viewMode: '3D' | 'List';
  onChange: (mode: '3D' | 'List') => void;
}

export const ViewSwitch: React.FC<ViewSwitchProps> = ({ viewMode, onChange }) => {
  return (
    <div className="wos-view-switch" role="group" aria-label="View switch">
      <button
        className={`wos-view-switch-btn ${viewMode === '3D' ? 'active' : ''}`}
        onClick={() => onChange('3D')}
        aria-pressed={viewMode === '3D'}
      >
        <Box size={14} />
        <span>3D</span>
      </button>
      <button
        className={`wos-view-switch-btn ${viewMode === 'List' ? 'active' : ''}`}
        onClick={() => onChange('List')}
        aria-pressed={viewMode === 'List'}
      >
        <ListIcon size={14} />
        <span>List</span>
      </button>
    </div>
  );
};
