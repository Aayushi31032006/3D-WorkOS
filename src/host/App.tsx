import React, { useState, useMemo } from 'react';
import { WorkOSHeader } from './WorkOSHeader';
import { PMSPlaceholder } from './PMSPlaceholder';
import { ThreeJsInspectorModal } from './ThreeJsInspectorModal';
import { DatabaseInspectorModal } from './DatabaseInspectorModal';
import { WorkOSModuleView } from './WorkOSModuleViews';
import { ObjectSpaceExplorer } from '../explorer';
import { MockDataProvider } from '../data/mockDataProvider';
import { ReturnContext, BusinessObject } from '../types';

export const App: React.FC = () => {
  // Demo Host Navigation State
  const [activeNavTab, setActiveNavTab] = useState<string>('object_space');
  const [activeScreen, setActiveScreen] = useState<'object_space' | 'pms_placeholder'>('object_space');
  
  // Execution Handoff State
  const [executionRecordId, setExecutionRecordId] = useState<string | null>(null);
  const [executionRecord, setExecutionRecord] = useState<BusinessObject | undefined>(undefined);
  const [savedReturnContext, setSavedReturnContext] = useState<ReturnContext | null>(null);

  // Company Scoping State
  const [currentCompany, setCurrentCompany] = useState<string>('company_globex');

  // Edge Case Simulation Flags (Default large collection stress true so 1,000 records are immediately active)
  const [simulateError, setSimulateError] = useState<boolean>(false);
  const [simulateEmpty, setSimulateEmpty] = useState<boolean>(false);
  const [largeCollectionStress, setLargeCollectionStress] = useState<boolean>(true);

  // Inspector Modals State
  const [isThreeJsInspectorOpen, setIsThreeJsInspectorOpen] = useState<boolean>(false);
  const [isDatabaseInspectorOpen, setIsDatabaseInspectorOpen] = useState<boolean>(false);
  const [dbResetKey, setDbResetKey] = useState<number>(0);

  // Instantiate data provider
  const dataProvider = useMemo(() => {
    return new MockDataProvider({
      networkDelayMs: 140,
      simulateError,
      simulateEmptyGroup: simulateEmpty,
      useLargeCollectionStress: largeCollectionStress
    });
  }, [simulateError, simulateEmpty, largeCollectionStress, dbResetKey]);

  // Determine starting root object by company
  const startingObjectId = currentCompany === 'company_globex' ? 'cust_globex' : 'cust_initech';

  const handleCompanyChange = (newCompanyId: string) => {
    setCurrentCompany(newCompanyId);
    setSavedReturnContext(null);
    setActiveScreen('object_space');
  };

  const handleOpenExecution = async (recordId: string, returnContext: ReturnContext) => {
    setSavedReturnContext(returnContext);
    setExecutionRecordId(recordId);

    try {
      const obj = await dataProvider.getObject(recordId, currentCompany);
      setExecutionRecord(obj);
    } catch {
      setExecutionRecord(undefined);
    }

    setActiveScreen('pms_placeholder');
  };

  const handleReturnFromPMS = (ctx: ReturnContext) => {
    setSavedReturnContext(ctx);
    setActiveScreen('object_space');
  };

  const handleDatabaseReset = () => {
    setDbResetKey(k => k + 1);
    setSavedReturnContext(null);
    setActiveScreen('object_space');
  };

  const handleDirectNavigateToRecord = (targetId: string) => {
    setSavedReturnContext({
      objectId: targetId,
      breadcrumbTrail: [
        { id: 'objects_root', label: 'Objects', type: 'category' },
        { id: targetId, label: targetId, type: 'customer' }
      ],
      viewMode: '3D',
      timestamp: Date.now()
    });
    setActiveNavTab('object_space');
    setActiveScreen('object_space');
  };

  return (
    <div className="workos-host-container">
      {/* Top WorkOS Navigation Bar */}
      <WorkOSHeader
        currentCompany={currentCompany}
        onCompanyChange={handleCompanyChange}
        simulateError={simulateError}
        onToggleSimulateError={() => setSimulateError(prev => !prev)}
        simulateEmpty={simulateEmpty}
        onToggleSimulateEmpty={() => setSimulateEmpty(prev => !prev)}
        largeCollectionStress={largeCollectionStress}
        onToggleLargeCollectionStress={() => setLargeCollectionStress(prev => !prev)}
        activeNavTab={activeNavTab}
        onNavTabChange={(tab) => {
          setActiveNavTab(tab);
          if (tab === 'object_space') {
            setActiveScreen('object_space');
          }
        }}
        onOpenThreeJsInspector={() => setIsThreeJsInspectorOpen(true)}
        onOpenDatabaseInspector={() => setIsDatabaseInspectorOpen(true)}
      />

      {/* Main Content Area: Object Space Explorer, Module Views, or WorkOS PMS Screen */}
      {activeNavTab !== 'object_space' ? (
        <WorkOSModuleView
          module={activeNavTab as any}
          onReturnToObjectSpace={() => {
            setActiveNavTab('object_space');
            setActiveScreen('object_space');
          }}
          onNavigateToRecord={handleDirectNavigateToRecord}
        />
      ) : activeScreen === 'pms_placeholder' && executionRecordId && savedReturnContext ? (
        <PMSPlaceholder
          recordId={executionRecordId}
          record={executionRecord}
          returnContext={savedReturnContext}
          onReturn={handleReturnFromPMS}
        />
      ) : (
        <ObjectSpaceExplorer
          key={`${currentCompany}_${savedReturnContext?.timestamp || 'root'}_${dbResetKey}`}
          startingId={startingObjectId}
          companyContext={currentCompany}
          dataProvider={dataProvider}
          initialReturnContext={savedReturnContext}
          onOpenExecution={handleOpenExecution}
        />
      )}

      {/* Architecture & Database Inspectors */}
      <ThreeJsInspectorModal
        isOpen={isThreeJsInspectorOpen}
        onClose={() => setIsThreeJsInspectorOpen(false)}
      />

      <DatabaseInspectorModal
        isOpen={isDatabaseInspectorOpen}
        onClose={() => setIsDatabaseInspectorOpen(false)}
        onReset={handleDatabaseReset}
      />
    </div>
  );
};
