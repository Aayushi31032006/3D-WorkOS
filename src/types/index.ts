export type ObjectType = 
  | 'customer' 
  | 'invoice' 
  | 'project' 
  | 'task' 
  | 'person' 
  | 'product' 
  | 'payment' 
  | 'contract';

export interface TimelineEvent {
  id: string;
  date: string;
  description: string;
}

export interface BusinessObject {
  id: string;
  companyId: string;
  type: ObjectType;
  name: string;
  code?: string;
  status?: string;
  owner?: string;
  amount?: string;
  dueDate?: string;
  createdDate?: string;
  description?: string;
  summaryFields?: Record<string, string | number>;
  activity?: TimelineEvent[];
  restricted?: boolean;
}

export interface RelationshipGroup {
  type: ObjectType;
  label: string; // e.g. "Invoices"
  count: number;
  recordIds?: string[];
}

export interface BreadcrumbItem {
  id: string;
  label: string;
  type: ObjectType | 'category';
  categoryKey?: string;
}

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  zoom: number;
}

export interface ReturnContext {
  objectId: string;
  breadcrumbTrail: BreadcrumbItem[];
  selectedCategory?: string | null;
  camera?: CameraState;
  viewMode: '3D' | 'List';
  timestamp: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface RecordFilter {
  query?: string;
  status?: string;
}

export interface DataProvider {
  getObject(id: string, companyId: string): Promise<BusinessObject>;
  getRelationships(id: string, companyId: string): Promise<RelationshipGroup[]>;
  searchObjects(query: string, companyId: string): Promise<BusinessObject[]>;
  getTimeline(id: string, companyId: string): Promise<TimelineEvent[]>;
  getCollectionRecords(
    parentId: string, 
    groupType: ObjectType, 
    companyId: string, 
    page: number, 
    pageSize: number,
    filter?: RecordFilter
  ): Promise<PaginatedResult<BusinessObject>>;
}

export interface ExplorerTheme {
  backgroundColor?: string;
  centralSphereColor?: string;
  relatedSphereColor?: string;
  selectionColor?: string;
  labelColor?: string;
}

export interface ObjectSpaceExplorerProps {
  startingId: string;
  companyContext: string;
  dataProvider: DataProvider;
  onOpenExecution?: (recordId: string, returnContext: ReturnContext) => void;
  initialReturnContext?: ReturnContext | null;
  theme?: ExplorerTheme;
  onError?: (err: Error) => void;
}
