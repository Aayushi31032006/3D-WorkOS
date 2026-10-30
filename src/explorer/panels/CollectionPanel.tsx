import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Search, ChevronRight, Loader2, RotateCcw } from 'lucide-react';
import { BusinessObject, RelationshipGroup, DataProvider, ObjectType } from '../../types';

export interface CollectionPanelProps {
  parentObject: BusinessObject;
  group: RelationshipGroup;
  dataProvider: DataProvider;
  companyId: string;
  onClose: () => void;
  onSelectRecord: (record: BusinessObject) => void;
}

export const CollectionPanel: React.FC<CollectionPanelProps> = ({
  parentObject,
  group,
  dataProvider,
  companyId,
  onClose,
  onSelectRecord
}) => {
  const [records, setRecords] = useState<BusinessObject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(group.count);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dynamic filter choices mapped to object domain
  const availableStatuses = useMemo(() => {
    switch (group.type) {
      case 'invoice':
        return ['All', 'Due', 'Paid', 'Draft', 'Pending Approval'];
      case 'project':
        return ['All', 'In Progress', 'Planning', 'Active', 'Completed', 'Draft'];
      case 'task':
        return ['All', 'In Progress', 'In Review', 'Completed', 'Pending'];
      case 'person':
        return ['All', 'Primary Contact', 'Director', 'Lead', 'Architect'];
      case 'product':
        return ['All', 'Active Subscription', 'Deployed', 'Trial'];
      case 'contract':
        return ['All', 'Executed', 'Active', 'Draft'];
      case 'payment':
        return ['All', 'Settled', 'Pending Authorization', 'In Escrow', 'Processing'];
      default:
        return ['All'];
    }
  }, [group.type]);

  // Reset status filter when opening a different group
  useEffect(() => {
    setStatusFilter('All');
    setSearchQuery('');
    setPage(1);
  }, [group.type, parentObject.id]);

  const fetchRecords = useCallback(async (
    targetPage: number, 
    query: string, 
    status: string, 
    isAppend: boolean = false
  ) => {
    try {
      if (isAppend) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setErrorMessage(null);

      const res = await dataProvider.getCollectionRecords(
        parentObject.id,
        group.type,
        companyId,
        targetPage,
        20,
        { query, status }
      );

      if (isAppend) {
        setRecords(prev => [...prev, ...res.items]);
      } else {
        setRecords(res.items);
      }

      setHasMore(res.hasMore);
      setTotalCount(res.total);
      setPage(targetPage);
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not load this information');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [dataProvider, parentObject.id, group.type, companyId]);

  // Fetch when page, query, status changes
  useEffect(() => {
    fetchRecords(1, searchQuery, statusFilter, false);
  }, [fetchRecords, searchQuery, statusFilter]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchRecords(page + 1, searchQuery, statusFilter, true);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
  };

  const title = `${group.label} for ${parentObject.name}`;

  const renderStatusBadge = (status?: string) => {
    if (!status) return null;
    const lower = status.toLowerCase();
    let cls = 'wos-status-active';
    if (lower === 'due' || lower === 'urgent') cls = 'wos-status-due';
    else if (lower === 'paid' || lower === 'done' || lower === 'completed' || lower === 'executed' || lower === 'settled') cls = 'wos-status-paid';
    else if (lower === 'draft' || lower === 'planning' || lower === 'pending') cls = 'wos-status-draft';

    return <span className={`wos-status-pill ${cls}`}>{status}</span>;
  };

  const isFiltered = statusFilter !== 'All' || searchQuery.trim().length > 0;

  return (
    <aside 
      className="wos-drawer-panel"
      role="region"
      aria-label={title}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="wos-panel-header">
        <div>
          <h2 className="wos-panel-title">{title}</h2>
          <span style={{ fontSize: '12px', color: 'var(--wos-label-muted)', fontWeight: 500 }}>
            {totalCount} available {isFiltered && '(Filtered)'}
          </span>
        </div>
        <button 
          className="wos-panel-close-btn" 
          onClick={onClose}
          aria-label="Close collection"
        >
          <X size={16} />
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="wos-collection-controls">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: '#fff',
          padding: '6px 10px',
          borderRadius: 'var(--wos-radius-md)',
          border: '1px solid var(--wos-border)',
          flex: 1
        }}>
          <Search size={14} color="var(--wos-label-muted)" />
          <input
            type="text"
            placeholder={`Filter ${group.label.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '12px',
              width: '100%',
              color: 'var(--wos-label)'
            }}
          />
        </div>

        <select
          className="workos-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          {availableStatuses.map(st => (
            <option key={st} value={st}>
              {st === 'All' ? 'All statuses' : st}
            </option>
          ))}
        </select>
      </div>

      {/* Body / List */}
      <div className="wos-collection-list">
        {loading ? (
          <div className="wos-state-card">
            <div className="wos-spinner" />
            <span style={{ fontSize: '13px' }}>Loading {group.label.toLowerCase()}...</span>
          </div>
        ) : errorMessage ? (
          <div className="wos-state-card">
            <span style={{ fontSize: '13px', color: '#c62828' }}>{errorMessage}</span>
            <button 
              className="wos-retry-btn"
              onClick={() => fetchRecords(1, searchQuery, statusFilter, false)}
            >
              Retry
            </button>
          </div>
        ) : records.length === 0 ? (
          <div className="wos-state-card">
            {isFiltered ? (
              <>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--wos-label)' }}>
                  No {group.label.toLowerCase()} matching filter criteria
                </span>
                <span style={{ fontSize: '12px', color: 'var(--wos-label-muted)' }}>
                  Try switching the status filter or clearing your search query.
                </span>
                <button 
                  className="wos-retry-btn" 
                  onClick={handleResetFilters}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}
                >
                  <RotateCcw size={13} />
                  <span>Clear Filters</span>
                </button>
              </>
            ) : (
              <span style={{ fontSize: '14px', fontWeight: 500 }}>
                No {group.label.toLowerCase()} linked yet
              </span>
            )}
          </div>
        ) : (
          <>
            {records.map((rec) => (
              <div
                key={rec.id}
                className="wos-collection-card"
                onClick={() => onSelectRecord(rec)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectRecord(rec);
                  }
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--wos-label)' }}>
                      {rec.code || rec.name}
                    </span>
                    {renderStatusBadge(rec.status)}
                  </div>
                  {rec.amount && (
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--wos-selection)' }}>
                      {rec.amount}
                    </span>
                  )}
                  {rec.dueDate && (
                    <span style={{ fontSize: '11px', color: 'var(--wos-label-muted)' }}>
                      Due: {rec.dueDate}
                    </span>
                  )}
                  {rec.owner && !rec.amount && (
                    <span style={{ fontSize: '11px', color: 'var(--wos-label-muted)' }}>
                      Owner: {rec.owner}
                    </span>
                  )}
                </div>

                <ChevronRight size={16} color="var(--wos-label-muted)" />
              </div>
            ))}

            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                style={{
                  padding: '10px',
                  background: 'var(--wos-selection-light)',
                  color: 'var(--wos-selection)',
                  border: '1px solid var(--wos-border)',
                  borderRadius: 'var(--wos-radius-md)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '8px'
                }}
              >
                {loadingMore ? (
                  <>
                    <Loader2 size={14} className="wos-spinner" />
                    <span>Loading more...</span>
                  </>
                ) : (
                  <span>Load more ({records.length} of {totalCount})</span>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </aside>
  );
};
