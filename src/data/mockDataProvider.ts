import { 
  DataProvider, 
  BusinessObject, 
  RelationshipGroup, 
  TimelineEvent, 
  PaginatedResult, 
  ObjectType, 
  RecordFilter 
} from '../types';
import { localDB } from './localDatabase';

export interface MockDataProviderOptions {
  networkDelayMs?: number;
  simulateError?: boolean;
  simulateEmptyGroup?: boolean;
  useLargeCollectionStress?: boolean;
}

export class MockDataProvider implements DataProvider {
  private networkDelayMs: number;
  public simulateError: boolean;
  public simulateEmptyGroup: boolean;
  public useLargeCollectionStress: boolean;

  constructor(options: MockDataProviderOptions = {}) {
    this.networkDelayMs = options.networkDelayMs ?? 180;
    this.simulateError = options.simulateError ?? false;
    this.simulateEmptyGroup = options.simulateEmptyGroup ?? false;
    this.useLargeCollectionStress = options.useLargeCollectionStress ?? false;
  }

  private async delay(): Promise<void> {
    if (this.networkDelayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, this.networkDelayMs));
    }
  }

  private checkError(): void {
    if (this.simulateError) {
      throw new Error('Could not load this information');
    }
  }

  public async getObject(id: string, companyId: string): Promise<BusinessObject> {
    await this.delay();
    this.checkError();

    const obj = localDB.findById(id, companyId, this.useLargeCollectionStress);
    if (!obj) {
      throw new Error(`Record ${id} not found`);
    }

    if (obj.restricted) {
      return {
        id: obj.id,
        companyId: obj.companyId,
        type: obj.type,
        name: 'Restricted Record',
        status: 'Restricted',
        restricted: true,
        description: 'You do not have permission to view the details of this record.'
      };
    }

    return obj;
  }

  public async getRelationships(id: string, companyId: string): Promise<RelationshipGroup[]> {
    await this.delay();
    this.checkError();

    if (this.simulateEmptyGroup) {
      return [];
    }

    return localDB.getRelationshipsFor(id, companyId, this.useLargeCollectionStress);
  }

  public async searchObjects(query: string, companyId: string): Promise<BusinessObject[]> {
    await this.delay();
    this.checkError();

    return localDB.search(query, companyId);
  }

  public async getTimeline(id: string, companyId: string): Promise<TimelineEvent[]> {
    await this.delay();
    this.checkError();

    const obj = await this.getObject(id, companyId);
    return obj.activity || [];
  }

  public async getCollectionRecords(
    parentId: string,
    groupType: ObjectType,
    companyId: string,
    page: number = 1,
    pageSize: number = 20,
    filter?: RecordFilter
  ): Promise<PaginatedResult<BusinessObject>> {
    await this.delay();
    this.checkError();

    if (this.simulateEmptyGroup) {
      return {
        items: [],
        total: 0,
        page,
        pageSize,
        hasMore: false
      };
    }

    return localDB.queryCollection(
      parentId,
      groupType,
      companyId,
      page,
      pageSize,
      filter,
      this.useLargeCollectionStress
    );
  }
}
