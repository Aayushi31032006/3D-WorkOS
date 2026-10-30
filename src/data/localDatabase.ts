import { BusinessObject, ObjectType, RelationshipGroup, RecordFilter, PaginatedResult } from '../types';
import { SAMPLE_OBJECTS, RELATIONSHIPS, generateLargeInvoiceSet } from './sampleData';

const DB_STORAGE_KEY = 'workos_object_space_db_v1';

export interface DatabaseSchema {
  version: number;
  lastUpdated: string;
  objects: Record<string, BusinessObject>;
  relationships: Array<{ fromId: string; toId: string; relationshipName: string }>;
}

/**
 * LocalDatabase
 * Client-side persistent relational database engine.
 * Stores business objects and normalized relationship links in persistent browser storage.
 */
export class LocalDatabase {
  private schema: DatabaseSchema;
  private largeInvoicesCache: BusinessObject[] | null = null;

  constructor() {
    this.schema = this.loadOrSeed();
  }

  private loadOrSeed(): DatabaseSchema {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(DB_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.version === 1 && parsed.objects) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage unavailable, using in-memory store', e);
    }

    // Seed default dataset
    const initialSchema: DatabaseSchema = {
      version: 1,
      lastUpdated: new Date().toISOString(),
      objects: { ...SAMPLE_OBJECTS },
      relationships: [...RELATIONSHIPS]
    };

    this.save(initialSchema);
    return initialSchema;
  }

  private save(schema: DatabaseSchema): void {
    this.schema = schema;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(schema));
      }
    } catch (e) {
      console.warn('Could not persist to LocalStorage', e);
    }
  }

  public reset(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(DB_STORAGE_KEY);
    }
    this.schema = {
      version: 1,
      lastUpdated: new Date().toISOString(),
      objects: { ...SAMPLE_OBJECTS },
      relationships: [...RELATIONSHIPS]
    };
    this.save(this.schema);
    this.largeInvoicesCache = null;
  }

  public getStats() {
    const objectList = Object.values(this.schema.objects);
    return {
      totalObjects: objectList.length,
      totalRelationships: this.schema.relationships.length,
      companies: Array.from(new Set(objectList.map(o => o.companyId))),
      types: Array.from(new Set(objectList.map(o => o.type))),
      storageEngine: 'HTML5 Web Storage (Persistent)'
    };
  }

  public getAllObjects(): BusinessObject[] {
    return Object.values(this.schema.objects);
  }

  public findById(id: string, companyId: string, useLargeStress: boolean = false): BusinessObject | null {
    if (useLargeStress && id.startsWith('inv_stress_')) {
      return this.getLargeInvoices().find(o => o.id === id) || null;
    }

    const obj = this.schema.objects[id];
    if (!obj) return null;
    if (obj.companyId !== companyId) return null;
    return { ...obj };
  }

  public getRelationshipsFor(id: string, companyId: string, useLargeStress: boolean = false): RelationshipGroup[] {
    const connected = this.schema.relationships
      .filter(rel => rel.fromId === id)
      .map(rel => ({
        targetId: rel.toId,
        targetObj: this.schema.objects[rel.toId]
      }))
      .filter(item => item.targetObj && item.targetObj.companyId === companyId);

    const groupMap = new Map<ObjectType, string[]>();

    connected.forEach(({ targetId, targetObj }) => {
      const type = targetObj.type;
      const list = groupMap.get(type) || [];
      list.push(targetId);
      groupMap.set(type, list);
    });

    const labelMap: Record<ObjectType, string> = {
      customer: 'Customer',
      invoice: 'Invoices',
      project: 'Projects',
      task: 'Tasks',
      person: 'Contacts',
      product: 'Products',
      payment: 'Payment',
      contract: 'Contracts'
    };

    const groups: RelationshipGroup[] = [];
    groupMap.forEach((ids, type) => {
      let count = ids.length;
      if (type === 'invoice' && useLargeStress && id === 'cust_globex') {
        count = 1000;
      }
      groups.push({
        type,
        label: labelMap[type] || type,
        count,
        recordIds: ids
      });
    });

    return groups;
  }

  public search(query: string, companyId: string): BusinessObject[] {
    if (!query || !query.trim()) return [];
    const q = query.toLowerCase().trim();

    return Object.values(this.schema.objects).filter(obj => {
      if (obj.companyId !== companyId) return false;
      return (
        obj.name.toLowerCase().includes(q) ||
        obj.code?.toLowerCase().includes(q) ||
        obj.type.toLowerCase().includes(q) ||
        obj.owner?.toLowerCase().includes(q)
      );
    }).slice(0, 12);
  }

  private getLargeInvoices(): BusinessObject[] {
    if (!this.largeInvoicesCache) {
      this.largeInvoicesCache = generateLargeInvoiceSet(1000);
    }
    return this.largeInvoicesCache;
  }

  public queryCollection(
    parentId: string,
    groupType: ObjectType,
    companyId: string,
    page: number = 1,
    pageSize: number = 20,
    filter?: RecordFilter,
    useLargeStress: boolean = false
  ): PaginatedResult<BusinessObject> {
    let records: BusinessObject[] = [];

    if (useLargeStress && groupType === 'invoice' && parentId === 'cust_globex') {
      records = this.getLargeInvoices();
    } else {
      const targetIds = this.schema.relationships
        .filter(rel => rel.fromId === parentId)
        .map(rel => rel.toId);

      records = targetIds
        .map(id => this.schema.objects[id])
        .filter((obj): obj is BusinessObject => !!obj && obj.type === groupType && obj.companyId === companyId);
    }

    // Apply Filters
    if (filter) {
      if (filter.query && filter.query.trim()) {
        const q = filter.query.toLowerCase().trim();
        records = records.filter(r =>
          r.name.toLowerCase().includes(q) ||
          r.code?.toLowerCase().includes(q) ||
          r.owner?.toLowerCase().includes(q)
        );
      }
      if (filter.status && filter.status !== 'All') {
        records = records.filter(r => r.status?.toLowerCase() === filter.status?.toLowerCase());
      }
    }

    const total = records.length;
    const startIndex = (page - 1) * pageSize;
    const items = records.slice(startIndex, startIndex + pageSize);
    const hasMore = startIndex + pageSize < total;

    return {
      items,
      total,
      page,
      pageSize,
      hasMore
    };
  }
}

export const localDB = new LocalDatabase();
