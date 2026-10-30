import React from 'react';
import { 
  Globe, 
  CheckSquare, 
  Eye, 
  LayoutGrid, 
  Layers, 
  ArrowLeft, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building2,
  FileText
} from 'lucide-react';

export interface WorkOSModuleViewProps {
  module: 'world' | 'tasks' | 'review' | 'gallery' | 'qm';
  onReturnToObjectSpace: () => void;
  onNavigateToRecord: (id: string) => void;
}

export const WorkOSModuleView: React.FC<WorkOSModuleViewProps> = ({
  module,
  onReturnToObjectSpace,
  onNavigateToRecord
}) => {
  return (
    <div style={{
      flex: 1,
      height: 'calc(100vh - 56px)',
      overflowY: 'auto',
      backgroundColor: '#FAF9FE',
      padding: '32px 40px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Top Breadcrumb & Return Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid var(--wos-border)',
        boxShadow: 'var(--wos-shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onReturnToObjectSpace}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: 'var(--wos-selection-light)',
              color: 'var(--wos-selection)',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            <span>Return to 3D Object Space</span>
          </button>
          <span style={{ fontSize: '14px', color: 'var(--wos-label-muted)', fontWeight: 500 }}>
            WorkOS Platform • {module.toUpperCase()} System
          </span>
        </div>

        <button
          onClick={onReturnToObjectSpace}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            background: 'var(--wos-selection)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <Sparkles size={14} />
          <span>Launch 3D Explorer</span>
        </button>
      </div>

      {/* Module Specific Screen */}
      {module === 'tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--wos-label)', margin: 0 }}>
              WorkOS Task & Execution Operations
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--wos-label-muted)', margin: '4px 0 0' }}>
              Active engineering sprints and task execution linked to Globex Ltd and Project Alpha.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {/* Column 1: In Review */}
            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid var(--wos-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#8c5b00' }}>IN REVIEW (2)</span>
                <Clock size={16} color="#8c5b00" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div 
                  onClick={() => { onNavigateToRecord('task_proposal'); onReturnToObjectSpace(); }}
                  style={{ padding: '14px', borderRadius: '10px', border: '1px solid var(--wos-border)', background: '#FAF8FD', cursor: 'pointer' }}
                >
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>Prepare proposal</div>
                  <div style={{ fontSize: '12px', color: 'var(--wos-label-muted)', marginTop: '4px' }}>Assignee: Sarah Connor • Due: 02 Nov</div>
                  <span className="wos-status-pill wos-status-draft" style={{ marginTop: '8px', display: 'inline-block' }}>In Review</span>
                </div>
                <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid var(--wos-border)', background: '#FAF8FD' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>SOC2 Type II compliance check</div>
                  <div style={{ fontSize: '12px', color: 'var(--wos-label-muted)', marginTop: '4px' }}>Assignee: Kyle Reese • Due: 05 Nov</div>
                  <span className="wos-status-pill wos-status-draft" style={{ marginTop: '8px', display: 'inline-block' }}>In Review</span>
                </div>
              </div>
            </div>

            {/* Column 2: In Progress */}
            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid var(--wos-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--wos-selection)' }}>IN PROGRESS (3)</span>
                <CheckSquare size={16} color="var(--wos-selection)" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div 
                  onClick={() => { onNavigateToRecord('task_security_signoff'); onReturnToObjectSpace(); }}
                  style={{ padding: '14px', borderRadius: '10px', border: '1px solid var(--wos-border)', background: '#FAF8FD', cursor: 'pointer' }}
                >
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>Security sign-off</div>
                  <div style={{ fontSize: '12px', color: 'var(--wos-label-muted)', marginTop: '4px' }}>Project Alpha • High Priority</div>
                  <span className="wos-status-pill wos-status-active" style={{ marginTop: '8px', display: 'inline-block' }}>In Progress</span>
                </div>
                <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid var(--wos-border)', background: '#FAF8FD' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>Kubernetes pod autoscaling policy</div>
                  <div style={{ fontSize: '12px', color: 'var(--wos-label-muted)', marginTop: '4px' }}>DevOps Engineering</div>
                  <span className="wos-status-pill wos-status-active" style={{ marginTop: '8px', display: 'inline-block' }}>In Progress</span>
                </div>
              </div>
            </div>

            {/* Column 3: Completed */}
            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid var(--wos-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#2e7d32' }}>COMPLETED (4)</span>
                <CheckCircle2 size={16} color="#2e7d32" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div 
                  onClick={() => { onNavigateToRecord('task_arch_review'); onReturnToObjectSpace(); }}
                  style={{ padding: '14px', borderRadius: '10px', border: '1px solid var(--wos-border)', background: '#FAF8FD', cursor: 'pointer' }}
                >
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>Architecture review</div>
                  <div style={{ fontSize: '12px', color: 'var(--wos-label-muted)', marginTop: '4px' }}>Completed by Marcus Aurelius</div>
                  <span className="wos-status-pill wos-status-paid" style={{ marginTop: '8px', display: 'inline-block' }}>Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {module === 'world' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--wos-label)', margin: 0 }}>
              Global Topology & Enterprise Nodes
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--wos-label-muted)', margin: '4px 0 0' }}>
              Multi-region enterprise infrastructure map connecting Globex Ltd worldwide facilities.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px'
          }}>
            {[
              { region: 'Zurich Central Hub', status: 'Optimal · 12ms', org: 'Globex Ltd EMEA HQ', id: 'cust_globex' },
              { region: 'London Telemetry Point', status: 'Optimal · 18ms', org: 'Project Alpha Fleet', id: 'proj_alpha' },
              { region: 'San Francisco Gateway', status: 'Active · 34ms', org: 'WorkOS Cloud Sync', id: 'prod_cloud' }
            ].map((node, i) => (
              <div key={i} style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid var(--wos-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Globe size={18} color="var(--wos-selection)" />
                  <span style={{ fontWeight: 700, fontSize: '16px' }}>{node.region}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--wos-label-muted)' }}>{node.org}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#2e7d32', marginTop: '6px' }}>{node.status}</div>
                <button
                  onClick={() => { onNavigateToRecord(node.id); onReturnToObjectSpace(); }}
                  style={{
                    marginTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--wos-selection)',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  <span>Explore node in 3D</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {module === 'review' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--wos-label)', margin: 0 }}>
              Executive Review & Authorization Queue
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--wos-label-muted)', margin: '4px 0 0' }}>
              Pending financial items, invoices, and legal agreements requiring executive authorization.
            </p>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--wos-border)', overflow: 'hidden' }}>
            <table className="wos-table">
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Title / Recipient</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr onClick={() => { onNavigateToRecord('inv_0042'); onReturnToObjectSpace(); }}>
                  <td style={{ fontWeight: 700 }}>INV-0042</td>
                  <td>Globex Ltd • Project Alpha billing</td>
                  <td style={{ fontWeight: 700, color: 'var(--wos-selection)' }}>₹42,500</td>
                  <td>30 Oct 2026</td>
                  <td><span className="wos-status-pill wos-status-due">Due</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button style={{ color: 'var(--wos-selection)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
                      Inspect in 3D →
                    </button>
                  </td>
                </tr>
                <tr onClick={() => { onNavigateToRecord('inv_0044'); onReturnToObjectSpace(); }}>
                  <td style={{ fontWeight: 700 }}>INV-0044</td>
                  <td>Globex Ltd • Robotics Phase 1</td>
                  <td style={{ fontWeight: 700, color: 'var(--wos-selection)' }}>₹32,400</td>
                  <td>05 Nov 2026</td>
                  <td><span className="wos-status-pill wos-status-due">Due</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button style={{ color: 'var(--wos-selection)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
                      Inspect in 3D →
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {module === 'gallery' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--wos-label)', margin: 0 }}>
              WorkOS 3D Object Gallery
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--wos-label-muted)', margin: '4px 0 0' }}>
              Interactive 3D business-object visual catalog for enterprise entity exploration.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { title: 'Customer Record', type: 'CUSTOMER', color: '#B897E3', id: 'cust_globex', name: 'Globex Ltd' },
              { title: 'Invoice Entity', type: 'INVOICE', color: '#D3BFEF', id: 'inv_0042', name: 'INV-0042' },
              { title: 'Project Pipeline', type: 'PROJECT', color: '#D3BFEF', id: 'proj_alpha', name: 'Project Alpha' },
              { title: 'Work Task', type: 'TASK', color: '#D3BFEF', id: 'task_proposal', name: 'Prepare proposal' }
            ].map((card, i) => (
              <div 
                key={i}
                onClick={() => { onNavigateToRecord(card.id); onReturnToObjectSpace(); }}
                style={{
                  background: '#FFFFFF',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '1px solid var(--wos-border)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${card.color} 0%, #7046B2 100%)`,
                  boxShadow: '0 8px 20px rgba(112, 70, 178, 0.25)'
                }} />
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--wos-selection)' }}>{card.type}</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--wos-label)' }}>{card.name}</div>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--wos-selection)', fontWeight: 600 }}>Launch in Object Space →</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {module === 'qm' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--wos-label)', margin: 0 }}>
              Quality Management & WebGL Telemetry (QM)
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--wos-label-muted)', margin: '4px 0 0' }}>
              Real-time WebGL render health, GPU memory allocation, and SLA compliance metrics.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid var(--wos-border)' }}>
              <div style={{ fontSize: '12px', color: 'var(--wos-label-muted)', fontWeight: 600 }}>WebGL FPS</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#2e7d32', marginTop: '4px' }}>60.0 FPS</div>
              <div style={{ fontSize: '12px', color: 'var(--wos-label-muted)', marginTop: '4px' }}>16.6ms render budget</div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid var(--wos-border)' }}>
              <div style={{ fontSize: '12px', color: 'var(--wos-label-muted)', fontWeight: 600 }}>SLA Availability</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--wos-selection)', marginTop: '4px' }}>99.999%</div>
              <div style={{ fontSize: '12px', color: 'var(--wos-label-muted)', marginTop: '4px' }}>Exceeds enterprise target</div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid var(--wos-border)' }}>
              <div style={{ fontSize: '12px', color: 'var(--wos-label-muted)', fontWeight: 600 }}>Normalized Records</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--wos-label)', marginTop: '4px' }}>1,000+</div>
              <div style={{ fontSize: '12px', color: 'var(--wos-label-muted)', marginTop: '4px' }}>Synthetic enterprise store</div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid var(--wos-border)' }}>
              <div style={{ fontSize: '12px', color: 'var(--wos-label-muted)', fontWeight: 600 }}>Memory Footprint</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#2e7d32', marginTop: '4px' }}>32 MB</div>
              <div style={{ fontSize: '12px', color: 'var(--wos-label-muted)', marginTop: '4px' }}>Zero memory leakage</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
