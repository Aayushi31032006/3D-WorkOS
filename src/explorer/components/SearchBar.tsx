import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, Loader2 } from 'lucide-react';
import { BusinessObject, DataProvider } from '../../types';

export interface SearchBarProps {
  dataProvider: DataProvider;
  companyId: string;
  onSelectObject: (obj: BusinessObject) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  dataProvider,
  companyId,
  onSelectObject
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BusinessObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const matches = await dataProvider.searchObjects(query, companyId);
        setResults(matches);
        setIsOpen(true);
      } catch (err) {
        console.error('Search error', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, dataProvider, companyId]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (obj: BusinessObject) => {
    onSelectObject(obj);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="wos-search-container" ref={dropdownRef}>
      <div className="wos-search-input-wrap">
        <SearchIcon size={16} color="var(--wos-label-muted)" />
        <input
          type="text"
          className="wos-search-input"
          placeholder="Search connected objects"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          aria-label="Search connected objects"
        />
        {loading && <Loader2 size={14} className="wos-spinner" />}
        {query && !loading && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              color: 'var(--wos-label-muted)',
              display: 'flex'
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="wos-search-dropdown" role="listbox">
          {results.length === 0 ? (
            <div style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--wos-label-muted)' }}>
              No connected objects found
            </div>
          ) : (
            results.map((obj) => (
              <div
                key={obj.id}
                className="wos-search-item"
                role="option"
                aria-selected="false"
                tabIndex={0}
                onClick={() => handleSelect(obj)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSelect(obj);
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--wos-label)' }}>
                    {obj.name}
                  </div>
                  {obj.status && (
                    <div style={{ fontSize: '11px', color: 'var(--wos-label-muted)' }}>
                      Status: {obj.status}
                    </div>
                  )}
                </div>
                <span className="wos-search-type-badge">
                  {obj.type}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
