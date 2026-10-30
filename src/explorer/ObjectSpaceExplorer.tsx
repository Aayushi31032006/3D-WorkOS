import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ObjectSpaceExplorerProps, 
  BusinessObject, 
  RelationshipGroup, 
  BreadcrumbItem, 
  CameraState, 
  ReturnContext 
} from '../types';
import { Scene } from './scene/Scene';
import { ListView } from './views/ListView';
import { DetailsPanel } from './panels/DetailsPanel';
import { CollectionPanel } from './panels/CollectionPanel';
import { Breadcrumb } from './components/Breadcrumb';
import { SearchBar } from './components/SearchBar';
import { ViewSwitch } from './components/ViewSwitch';
import { CameraControlsOverlay } from './components/CameraControlsOverlay';
import './styles/explorer.css';

export const ObjectSpaceExplorer: React.FC<ObjectSpaceExplorerProps> = ({
  startingId,
  companyContext,
  dataProvider,
  onOpenExecution,
  initialReturnContext,
  theme,
  onError
}) => {
  // Navigation & Active Object State
  const [currentObjectId, setCurrentObjectId] = useState<string>(
    initialReturnContext?.objectId || startingId
  );
  const [currentObject, setCurrentObject] = useState<BusinessObject | null>(null);
  const [relationshipGroups, setRelationshipGroups] = useState<RelationshipGroup[]>([]);
  
  // Breadcrumb Trail State
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>(
    initialReturnContext?.breadcrumbTrail || []
  );

  // History stack for back navigation
  const [historyStack, setHistoryStack] = useState<Array<{
    objectId: string;
    breadcrumbs: BreadcrumbItem[];
    camera?: CameraState;
  }>>([]);

  // Active temporary panel: 'none' | 'details' | 'collection'
  const [activePanel, setActivePanel] = useState<'none' | 'details' | 'collection'>('none');
  const [activeGroup, setActiveGroup] = useState<RelationshipGroup | null>(null);

  // View Mode: '3D' | 'List'
  const [viewMode, setViewMode] = useState<'3D' | 'List'>(
    initialReturnContext?.viewMode || '3D'
  );

  // Camera State and Triggers
  const currentCameraRef = useRef<CameraState | undefined>(initialReturnContext?.camera);
  const [cameraTrigger, setCameraTrigger] = useState<{
    action: 'zoomIn' | 'zoomOut' | 'reset' | 'restore';
    targetState?: CameraState;
    timestamp: number;
  } | null>(null);

  // Loading & Error States
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Detect WebGL support for fallback
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        setViewMode('List');
      }
    } catch {
      setHasWebGL(false);
      setViewMode('List');
    }
  }, []);

  // Fetch record & relationships
  const loadObjectData = useCallback(async (id: string, companyId: string) => {
    try {
      setLoading(true);
      setError(null);

      const [obj, rels] = await Promise.all([
        dataProvider.getObject(id, companyId),
        dataProvider.getRelationships(id, companyId)
      ]);

      setCurrentObject(obj);
      setRelationshipGroups(rels);

      // Initialize or update breadcrumbs
      setBreadcrumbs(prev => {
        if (prev.length === 0) {
          return [
            { id: 'objects_root', label: 'Objects', type: 'category' },
            { id: obj.id, label: obj.name, type: obj.type }
          ];
        }
        // If already in trail, preserve up to that point
        const existingIdx = prev.findIndex(item => item.id === obj.id);
        if (existingIdx !== -1) {
          return prev.slice(0, existingIdx + 1);
        }
        // Otherwise append
        return [...prev, { id: obj.id, label: obj.name, type: obj.type }];
      });
    } catch (err: any) {
      console.error('Failed to load object:', err);
      const msg = err.message || 'Could not load this information';
      setError(msg);
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  }, [dataProvider, onError]);

  // Detect company context changes
  const prevCompanyRef = useRef(companyContext);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const targetId = initialReturnContext?.objectId || startingId;
      if (initialReturnContext) {
        setBreadcrumbs(initialReturnContext.breadcrumbTrail);
        setViewMode(initialReturnContext.viewMode);
        if (initialReturnContext.camera) {
          currentCameraRef.current = initialReturnContext.camera;
          setCameraTrigger({
            action: 'restore',
            targetState: initialReturnContext.camera,
            timestamp: performance.now()
          });
        }
      }
      loadObjectData(targetId, companyContext);
      return;
    }

    if (prevCompanyRef.current !== companyContext) {
      prevCompanyRef.current = companyContext;
      setCurrentObjectId(startingId);
      setBreadcrumbs([]);
      setHistoryStack([]);
      setActivePanel('none');
      setActiveGroup(null);
      loadObjectData(startingId, companyContext);
    }
  }, [startingId, companyContext, initialReturnContext, loadObjectData]);

  // Navigation: Navigate to a new business record
  const navigateToObject = useCallback((targetId: string, intermediateGroup?: RelationshipGroup) => {
    if (currentObject) {
      setHistoryStack(prev => [
        ...prev,
        {
          objectId: currentObject.id,
          breadcrumbs: [...breadcrumbs],
          camera: currentCameraRef.current
        }
      ]);
    }

    if (intermediateGroup) {
      // Add group category to breadcrumbs if not already present
      setBreadcrumbs(prev => [
        ...prev,
        { id: `group_${intermediateGroup.type}`, label: intermediateGroup.label, type: 'category' }
      ]);
    }

    setActivePanel('none');
    setActiveGroup(null);
    setCurrentObjectId(targetId);
    loadObjectData(targetId, companyContext);
  }, [currentObject, breadcrumbs, companyContext, loadObjectData]);

  // Back Navigation: Restore previous object, camera and breadcrumbs
  const navigateBack = useCallback(() => {
    if (historyStack.length === 0) return;

    const previousState = historyStack[historyStack.length - 1];
    setHistoryStack(prev => prev.slice(0, -1));

    setCurrentObjectId(previousState.objectId);
    setBreadcrumbs(previousState.breadcrumbs);
    setActivePanel('none');
    setActiveGroup(null);

    if (previousState.camera) {
      currentCameraRef.current = previousState.camera;
      setCameraTrigger({
        action: 'restore',
        targetState: previousState.camera,
        timestamp: performance.now()
      });
    }

    loadObjectData(previousState.objectId, companyContext);
  }, [historyStack, companyContext, loadObjectData]);

  // Breadcrumb Click Navigation
  const handleBreadcrumbClick = (index: number, item: BreadcrumbItem) => {
    if (index === 0 && item.id === 'objects_root') {
      // Navigate to initial root
      navigateToObject(startingId);
      return;
    }
    if (item.type !== 'category' && item.id !== currentObjectId) {
      navigateToObject(item.id);
    }
  };

  // Open Execution Handoff (e.g. WorkOS PMS placeholder)
  const handleOpenExecution = (recordId: string) => {
    if (onOpenExecution) {
      const returnCtx: ReturnContext = {
        objectId: currentObjectId,
        breadcrumbTrail: breadcrumbs,
        camera: currentCameraRef.current,
        viewMode: viewMode,
        timestamp: Date.now()
      };
      onOpenExecution(recordId, returnCtx);
    }
  };

  // Handlers for Sphere Clicks
  const handleSelectCentral = () => {
    // Single temporary panel rule: open details panel
    setActiveGroup(null);
    setActivePanel('details');
  };

  const handleSelectGroup = (group: RelationshipGroup) => {
    // Single temporary panel rule: open collection panel
    setActiveGroup(group);
    setActivePanel('collection');
  };

  const handleSelectRecordFromCollection = (record: BusinessObject) => {
    // Selecting record closes collection and centers the new record
    setActivePanel('none');
    navigateToObject(record.id, activeGroup || undefined);
  };

  // Camera buttons
  const handleZoomIn = () => {
    setCameraTrigger({ action: 'zoomIn', timestamp: performance.now() });
  };
  const handleZoomOut = () => {
    setCameraTrigger({ action: 'zoomOut', timestamp: performance.now() });
  };
  const handleResetCamera = () => {
    setCameraTrigger({ action: 'reset', timestamp: performance.now() });
  };

  return (
    <div className="workos-object-space" role="main">
      {/* Action Row: Breadcrumbs, Global Search, View Switch */}
      <div className="wos-action-row">
        <Breadcrumb
          trail={breadcrumbs}
          onNavigate={handleBreadcrumbClick}
        />

        <SearchBar
          dataProvider={dataProvider}
          companyId={companyContext}
          onSelectObject={(obj) => navigateToObject(obj.id)}
        />

        <ViewSwitch
          viewMode={viewMode}
          onChange={(mode) => setViewMode(mode)}
        />
      </div>

      {/* Main View Area: 3D Scene or List View */}
      {loading && !currentObject ? (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <div className="wos-spinner" />
          <span style={{ fontSize: '14px', color: 'var(--wos-label-muted)', fontWeight: 500 }}>
            Loading object space...
          </span>
        </div>
      ) : error ? (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          background: 'var(--wos-bg)'
        }}>
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#c62828' }}>
            {error}
          </span>
          <button
            className="wos-retry-btn"
            onClick={() => loadObjectData(currentObjectId, companyContext)}
          >
            Retry
          </button>
        </div>
      ) : currentObject && viewMode === '3D' && hasWebGL ? (
        <>
          <Scene
            currentObject={currentObject}
            relationshipGroups={relationshipGroups}
            selectedGroupId={activeGroup?.type || null}
            onSelectCentral={handleSelectCentral}
            onSelectGroup={handleSelectGroup}
            cameraTrigger={cameraTrigger}
            onCameraChange={(cam) => {
              currentCameraRef.current = cam;
            }}
            backgroundColor={theme?.backgroundColor || '#F5F3FA'}
          />

          <CameraControlsOverlay
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onReset={handleResetCamera}
          />
        </>
      ) : currentObject ? (
        <ListView
          currentObject={currentObject}
          relationshipGroups={relationshipGroups}
          onSelectCentral={handleSelectCentral}
          onSelectGroup={handleSelectGroup}
          onNavigateToObject={navigateToObject}
          onOpenExecution={handleOpenExecution}
        />
      ) : null}

      {/* Temporary Side Panels (Exactly one at a time) */}
      {activePanel === 'details' && currentObject && (
        <DetailsPanel
          object={currentObject}
          onClose={() => setActivePanel('none')}
          onNavigateToObject={navigateToObject}
          onOpenExecution={handleOpenExecution}
        />
      )}

      {activePanel === 'collection' && currentObject && activeGroup && (
        <CollectionPanel
          parentObject={currentObject}
          group={activeGroup}
          dataProvider={dataProvider}
          companyId={companyContext}
          onClose={() => setActivePanel('none')}
          onSelectRecord={handleSelectRecordFromCollection}
        />
      )}
    </div>
  );
};
