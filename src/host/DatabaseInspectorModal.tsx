import React, { useState } from 'react';
import { X, Database, RotateCcw, Server, Shield, Layers, FileJson } from 'lucide-react';
import { localDB } from '../data/localDatabase';

export interface DatabaseInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

export const DatabaseInspectorModal: React.FC<DatabaseInspectorModalProps> = ({ 
  isOpen, 
  onClose,
  onReset 
}) => {
  const [selectedRecordId, setSelectedRecordId] = useState<string>('cust_globex');

  if (!isOpen) return null;

  const stats = localDB.getStats();
  const allObjects = localDB.getAllObjects();
  const currentRecord = allObjects.find(o => o.id === selectedRecordId) || allObjects[0];

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(48, 38, 76, 0.4)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '840px',
          maxHeight: '88vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 20px 48px rgba(48, 38, 76, 0.2)',
          border: '1px solid var(--wos-border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--wos-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #FAF7FD 0%, #FFFFFF 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={20} color="var(--wos-selection)" />
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--wos-label)' }}>
                Database Layer & Storage Architecture
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--wos-label-muted)' }}>
                Client-side persistent relational storage engine with stable business object IDs
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="wos-panel-close-btn"
            aria-label="Close database inspector"
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Quick Metrics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px'
          }}>
            <div style={{ padding: '12px', background: '#FAF8FD', borderRadius: '10px', border: '1px solid var(--wos-border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--wos-label-muted)', fontWeight: 600 }}>Total Records</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--wos-selection)' }}>{stats.totalObjects}</div>
            </div>
            <div style={{ padding: '12px', background: '#FAF8FD', borderRadius: '10px', border: '1px solid var(--wos-border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--wos-label-muted)', fontWeight: 600 }}>Normalized Links</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--wos-selection)' }}>{stats.totalRelationships}</div>
            </div>
            <div style={{ padding: '12px', background: '#FAF8FD', borderRadius: '10px', border: '1px solid var(--wos-border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--wos-label-muted)', fontWeight: 600 }}>Company Scopes</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--wos-label)', marginTop: '4px' }}>
                Globex · Initech
              </div>
            </div>
            <div style={{ padding: '12px', background: '#FAF8FD', borderRadius: '10px', border: '1px solid var(--wos-border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--wos-label-muted)', fontWeight: 600 }}>Storage Backend</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#2e7d32', marginTop: '4px' }}>
                HTML5 WebStorage
              </div>
            </div>
          </div>

          {/* Database Explorer Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '16px', minHeight: '260px' }}>
            {/* Record List */}
            <div style={{
              border: '1px solid var(--wos-border)',
              borderRadius: '10px',
              overflowY: 'auto',
              maxHeight: '300px'
            }}>
              <div style={{ padding: '8px 12px', background: '#F5F3FA', fontSize: '11px', fontWeight: 700, color: 'var(--wos-label-muted)' }}>
                STORED BUSINESS OBJECTS
              </div>
              {allObjects.map(obj => (
                <div
                  key={obj.id}
                  onClick={() => setSelectedRecordId(obj.id)}
                  style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid rgba(112, 70, 178, 0.05)',
                    cursor: 'pointer',
                    background: selectedRecordId === obj.id ? 'var(--wos-selection-light)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--wos-label)' }}>{obj.name}</span>
                    <span style={{ display: 'block', fontSize: '10px', color: 'var(--wos-label-muted)' }}>{obj.id}</span>
                  </div>
                  <span className="wos-search-type-badge" style={{ fontSize: '9px', padding: '1px 6px' }}>{obj.type}</span>
                </div>
              ))}
            </div>

            {/* Record JSON Inspector */}
            <div style={{
              border: '1px solid var(--wos-border)',
              borderRadius: '10px',
              padding: '12px',
              background: '#1E1E2E',
              color: '#CDD6F4',
              fontFamily: 'monospace',
              fontSize: '12px',
              overflowY: 'auto',
              maxHeight: '300px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#A6ADC8', fontSize: '11px' }}>
                <FileJson size={14} color="#CBA6F7" />
                <span>JSON Document View [{currentRecord?.id}]</span>
              </div>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.45 }}>
                {JSON.stringify(currentRecord, null, 2)}
              </pre>
            </div>
          </div>

          {/* Reset Database Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '1px solid var(--wos-border)'
          }}>
            <span style={{ fontSize: '12px', color: 'var(--wos-label-muted)' }}>
              Data persists locally across browser refreshes. Click reset to restore initial synthetic fixtures.
            </span>
            <button
              onClick={() => {
                localDB.reset();
                onReset();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: '#fff',
                border: '1px solid var(--wos-border)',
                borderRadius: '8px',
                color: 'var(--wos-selection)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={14} />
              <span>Reset Database</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
