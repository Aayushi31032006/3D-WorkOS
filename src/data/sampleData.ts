import { BusinessObject, ObjectType } from '../types';

export interface RelationshipConnection {
  fromId: string;
  toId: string;
  relationshipName: string;
}

// Canonical Base Objects
const BASE_OBJECTS: Record<string, BusinessObject> = {
  cust_globex: {
    id: 'cust_globex',
    companyId: 'company_globex',
    type: 'customer',
    name: 'Globex Ltd',
    owner: 'Eleanor Vance',
    status: 'Active',
    createdDate: '12 January 2024',
    description: 'Global industrial automation, cyber-physical infrastructure, and enterprise robotics platform.',
    summaryFields: {
      'Active Contracts': 'Enterprise Tier 1',
      'Account Tier': 'Strategic Enterprise',
      'HQ Location': 'Zurich / London',
      'Primary Contact': 'Sarah Connor'
    },
    activity: [
      { id: 'act_1', date: '28 Oct', description: 'Quarterly enterprise governance review completed' },
      { id: 'act_2', date: '25 Oct', description: 'Enterprise platform subscription renewed for 2027' },
      { id: 'act_3', date: '20 Oct', description: 'Primary contact assigned: Sarah Connor' }
    ]
  },

  inv_0042: {
    id: 'inv_0042',
    companyId: 'company_globex',
    type: 'invoice',
    name: 'INV-0042',
    code: 'INV-0042',
    amount: '₹42,500',
    status: 'Due',
    dueDate: '30 October 2026',
    createdDate: '22 October 2026',
    owner: 'Eleanor Vance',
    summaryFields: {
      'Customer': 'Globex Ltd',
      'Linked project': 'Project Alpha',
      'Payment terms': 'Net 30',
      'Currency': 'INR (₹)'
    },
    activity: [
      { id: 'act_4', date: '23 Oct', description: 'Due date updated' },
      { id: 'act_5', date: '22 Oct', description: 'Invoice created' }
    ]
  },

  inv_0041: {
    id: 'inv_0041',
    companyId: 'company_globex',
    type: 'invoice',
    name: 'INV-0041',
    code: 'INV-0041',
    amount: '₹18,000',
    status: 'Paid',
    dueDate: '15 October 2026',
    createdDate: '15 September 2026',
    owner: 'Eleanor Vance',
    summaryFields: { 'Customer': 'Globex Ltd', 'Linked project': 'Project Alpha' },
    activity: [{ id: 'act_6', date: '15 Oct', description: 'Marked as paid' }]
  },

  inv_0043: {
    id: 'inv_0043',
    companyId: 'company_globex',
    type: 'invoice',
    name: 'INV-0043',
    code: 'INV-0043',
    amount: '₹65,000',
    status: 'Draft',
    dueDate: '15 November 2026',
    createdDate: '24 October 2026',
    owner: 'Marcus Aurelius',
    summaryFields: { 'Customer': 'Globex Ltd', 'Linked project': 'Project Beta' },
    activity: [{ id: 'act_7', date: '24 Oct', description: 'Draft generated from timesheet' }]
  },

  inv_0044: {
    id: 'inv_0044',
    companyId: 'company_globex',
    type: 'invoice',
    name: 'INV-0044',
    code: 'INV-0044',
    amount: '₹32,400',
    status: 'Due',
    dueDate: '05 November 2026',
    createdDate: '18 October 2026',
    owner: 'Eleanor Vance',
    summaryFields: { 'Customer': 'Globex Ltd', 'Linked project': 'Project Alpha' }
  },

  inv_0045: {
    id: 'inv_0045',
    companyId: 'company_globex',
    type: 'invoice',
    name: 'INV-0045',
    code: 'INV-0045',
    amount: '₹12,800',
    status: 'Paid',
    dueDate: '01 October 2026',
    createdDate: '01 September 2026',
    owner: 'Eleanor Vance',
    summaryFields: { 'Customer': 'Globex Ltd', 'Linked project': 'Project Alpha' }
  },

  inv_0046: {
    id: 'inv_0046',
    companyId: 'company_globex',
    type: 'invoice',
    name: 'INV-0046',
    code: 'INV-0046',
    amount: '₹94,000',
    status: 'Due',
    dueDate: '20 November 2026',
    createdDate: '20 October 2026',
    owner: 'Eleanor Vance',
    summaryFields: { 'Customer': 'Globex Ltd', 'Linked project': 'Project Beta' }
  },

  inv_0047: {
    id: 'inv_0047',
    companyId: 'company_globex',
    type: 'invoice',
    name: 'INV-0047',
    code: 'INV-0047',
    amount: '₹51,200',
    status: 'Paid',
    dueDate: '28 September 2026',
    createdDate: '28 August 2026',
    owner: 'Marcus Aurelius',
    summaryFields: { 'Customer': 'Globex Ltd', 'Linked project': 'Project Beta' }
  },

  proj_alpha: {
    id: 'proj_alpha',
    companyId: 'company_globex',
    type: 'project',
    name: 'Project Alpha',
    owner: 'Marcus Aurelius',
    status: 'In Progress',
    dueDate: '15 December 2026',
    createdDate: '01 August 2026',
    description: 'Autonomous robotics orchestration engine for next-gen smart manufacturing pipelines.',
    summaryFields: {
      'Target Delivery': 'Q4 2026',
      'Assigned Team': '8 Senior Engineers',
      'Sprint Health': '98% Velocity'
    },
    activity: [
      { id: 'act_8', date: '29 Oct', description: 'Sprint 14 review completed' },
      { id: 'act_9', date: '19 Oct', description: 'Prototype validated with Globex QA' }
    ]
  },

  proj_beta: {
    id: 'proj_beta',
    companyId: 'company_globex',
    type: 'project',
    name: 'Project Beta',
    owner: 'Eleanor Vance',
    status: 'Planning',
    dueDate: '30 March 2027',
    createdDate: '10 October 2026',
    description: 'Supply chain sensor telemetry mesh integration with WorkOS cloud ERP.',
    summaryFields: { 'Budget': '₹1,200,000', 'Phase': 'Design Discovery' },
    activity: []
  },

  proj_nova: {
    id: 'proj_nova',
    companyId: 'company_globex',
    type: 'project',
    name: 'Project Nova Sentinel',
    owner: 'Sarah Connor',
    status: 'Active',
    dueDate: '20 January 2027',
    description: 'High-availability cyber defense telemetry broker for industrial IoT controllers.',
    summaryFields: { 'Security Clearance': 'Level 4 Critical', 'Architecture': 'Zero Trust' }
  },

  proj_draft_q4: {
    id: 'proj_draft_q4',
    companyId: 'company_globex',
    type: 'project',
    name: 'Project Quantum Logistics',
    owner: 'Miles Dyson',
    status: 'Draft',
    dueDate: '15 May 2027',
    description: 'Next-generation quantum routing optimization draft specification for maritime transport.',
    summaryFields: { 'Phase': 'Draft Charter', 'Budget Estimate': '₹2,500,000' }
  },

  proj_completed_sys: {
    id: 'proj_completed_sys',
    companyId: 'company_globex',
    type: 'project',
    name: 'Project Infrastructure v1',
    owner: 'Marcus Aurelius',
    status: 'Completed',
    dueDate: '15 September 2026',
    description: 'Core Kubernetes cluster migration and multi-region failover cluster.',
    summaryFields: { 'Result': 'Delivered on schedule', 'Uptime': '99.99%' }
  },

  task_proposal: {
    id: 'task_proposal',
    companyId: 'company_globex',
    type: 'task',
    name: 'Prepare proposal',
    owner: 'Sarah Connor',
    status: 'In Review',
    dueDate: '02 November 2026',
    createdDate: '26 October 2026',
    description: 'Finalize technical scope, SLA definitions and rate card for Phase 2 expansion.',
    summaryFields: {
      'Parent project': 'Project Alpha',
      'Priority': 'High',
      'Estimated Effort': '16 Hours'
    },
    activity: [
      { id: 'act_10', date: '27 Oct', description: 'Legal annex attached' },
      { id: 'act_11', date: '26 Oct', description: 'Task assigned to Sarah Connor' }
    ]
  },

  task_arch_review: {
    id: 'task_arch_review',
    companyId: 'company_globex',
    type: 'task',
    name: 'Architecture review',
    owner: 'Marcus Aurelius',
    status: 'Completed',
    dueDate: '20 October 2026',
    summaryFields: { 'Parent project': 'Project Alpha' }
  },

  task_security_signoff: {
    id: 'task_security_signoff',
    companyId: 'company_globex',
    type: 'task',
    name: 'Security sign-off',
    owner: 'Sarah Connor',
    status: 'In Progress',
    dueDate: '08 November 2026',
    summaryFields: { 'Parent project': 'Project Alpha' }
  },

  person_sarah: {
    id: 'person_sarah',
    companyId: 'company_globex',
    type: 'person',
    name: 'Sarah Connor',
    owner: 'Globex Ltd',
    status: 'Primary Contact',
    description: 'Vice President of Technology & Infrastructure at Globex Ltd.',
    summaryFields: {
      'Email': 'sarah.connor@globex.internal',
      'Phone': '+1 (555) 019-2834',
      'Department': 'Executive Engineering'
    },
    activity: [{ id: 'act_12', date: '18 Oct', description: 'Quarterly roadmap aligned' }]
  },

  prod_cloud: {
    id: 'prod_cloud',
    companyId: 'company_globex',
    type: 'product',
    name: 'Enterprise Cloud Platform',
    status: 'Active Subscription',
    summaryFields: {
      'Tier': 'Enterprise Platinum',
      'Seats': '250 Allocated',
      'Renewal Date': '15 January 2027'
    }
  },

  pay_9011: {
    id: 'pay_9011',
    companyId: 'company_globex',
    type: 'payment',
    name: 'PAY-9011',
    amount: '₹42,500',
    status: 'Pending Authorization',
    summaryFields: {
      'Method': 'Corporate Wire',
      'Escrow Account': 'HDFC-WorkOS-Escrow'
    }
  },

  contract_master: {
    id: 'contract_master',
    companyId: 'company_globex',
    type: 'contract',
    name: 'Master Services Agreement 2026',
    status: 'Executed',
    summaryFields: {
      'Effective Date': '01 Jan 2026',
      'Governing Law': 'Delaware / National'
    }
  },

  record_restricted: {
    id: 'record_restricted',
    companyId: 'company_globex',
    type: 'contract',
    name: 'Confidential M&A Acquisition Annex',
    restricted: true,
    status: 'Restricted'
  },

  cust_initech: {
    id: 'cust_initech',
    companyId: 'company_initech',
    type: 'customer',
    name: 'Initech Corporation',
    owner: 'Bill Lumbergh',
    status: 'Active',
    createdDate: '15 March 2022',
    description: 'Financial accounting software & document compliance consultancy.',
    summaryFields: { 'Account Health': 'Good', 'Contract Status': 'Renewed' },
    activity: [{ id: 'act_ini_1', date: '29 Oct', description: 'TPS report format updated' }]
  },

  inv_initech_9001: {
    id: 'inv_initech_9001',
    companyId: 'company_initech',
    type: 'invoice',
    name: 'INV-9001',
    code: 'INV-9001',
    amount: '$14,200',
    status: 'Paid',
    dueDate: '20 October 2026',
    owner: 'Bill Lumbergh',
    summaryFields: { 'Customer': 'Initech Corporation' }
  },

  proj_phoenix: {
    id: 'proj_phoenix',
    companyId: 'company_initech',
    type: 'project',
    name: 'Project Phoenix',
    owner: 'Peter Gibbons',
    status: 'In Progress',
    dueDate: '30 November 2026'
  }
};

// Generate 1,000+ Enterprise Records including Projects, Tasks, People, Contracts, Invoices
function generateComprehensive1000Dataset(): {
  objects: Record<string, BusinessObject>;
  relationships: RelationshipConnection[];
} {
  const objects: Record<string, BusinessObject> = { ...BASE_OBJECTS };
  const relationships: RelationshipConnection[] = [
    // Base Globex Customer connections
    { fromId: 'cust_globex', toId: 'inv_0042', relationshipName: 'invoice' },
    { fromId: 'cust_globex', toId: 'inv_0041', relationshipName: 'invoice' },
    { fromId: 'cust_globex', toId: 'inv_0043', relationshipName: 'invoice' },
    { fromId: 'cust_globex', toId: 'inv_0044', relationshipName: 'invoice' },
    { fromId: 'cust_globex', toId: 'inv_0045', relationshipName: 'invoice' },
    { fromId: 'cust_globex', toId: 'inv_0046', relationshipName: 'invoice' },
    { fromId: 'cust_globex', toId: 'inv_0047', relationshipName: 'invoice' },

    { fromId: 'cust_globex', toId: 'proj_alpha', relationshipName: 'project' },
    { fromId: 'cust_globex', toId: 'proj_beta', relationshipName: 'project' },
    { fromId: 'cust_globex', toId: 'proj_nova', relationshipName: 'project' },
    { fromId: 'cust_globex', toId: 'proj_draft_q4', relationshipName: 'project' },
    { fromId: 'cust_globex', toId: 'proj_completed_sys', relationshipName: 'project' },

    { fromId: 'cust_globex', toId: 'person_sarah', relationshipName: 'person' },

    { fromId: 'cust_globex', toId: 'task_proposal', relationshipName: 'task' },
    { fromId: 'cust_globex', toId: 'task_arch_review', relationshipName: 'task' },
    { fromId: 'cust_globex', toId: 'task_security_signoff', relationshipName: 'task' },

    { fromId: 'cust_globex', toId: 'prod_cloud', relationshipName: 'product' },
    { fromId: 'cust_globex', toId: 'contract_master', relationshipName: 'contract' },

    // Around INV-0042
    { fromId: 'inv_0042', toId: 'cust_globex', relationshipName: 'customer' },
    { fromId: 'inv_0042', toId: 'proj_alpha', relationshipName: 'project' },
    { fromId: 'inv_0042', toId: 'pay_9011', relationshipName: 'payment' },
    { fromId: 'inv_0042', toId: 'task_proposal', relationshipName: 'task' },
    { fromId: 'inv_0042', toId: 'task_arch_review', relationshipName: 'task' },
    { fromId: 'inv_0042', toId: 'task_security_signoff', relationshipName: 'task' },

    // Project Alpha connections
    { fromId: 'proj_alpha', toId: 'cust_globex', relationshipName: 'customer' },
    { fromId: 'proj_alpha', toId: 'inv_0042', relationshipName: 'invoice' },
    { fromId: 'proj_alpha', toId: 'task_proposal', relationshipName: 'task' },
    { fromId: 'proj_alpha', toId: 'person_sarah', relationshipName: 'person' },

    // Initech
    { fromId: 'cust_initech', toId: 'inv_initech_9001', relationshipName: 'invoice' },
    { fromId: 'cust_initech', toId: 'proj_phoenix', relationshipName: 'project' }
  ];

  // 1. Generate 1,000 Invoices for Globex Ltd
  const invoiceStatuses = ['Paid', 'Due', 'Draft', 'Pending Approval'];
  const projectList = ['Project Alpha', 'Project Beta', 'Project Nova Sentinel', 'Project Quantum Logistics'];
  for (let i = 48; i <= 1040; i++) {
    const num = String(i).padStart(4, '0');
    const id = `inv_${num}`;
    const code = `INV-${num}`;
    const amount = `₹${(Math.floor((i * 37) % 750) + 120) * 100}`;
    const status = invoiceStatuses[i % invoiceStatuses.length];
    const dueDate = `${(i % 28) + 1} November 2026`;
    const proj = projectList[i % projectList.length];

    objects[id] = {
      id,
      companyId: 'company_globex',
      type: 'invoice',
      name: code,
      code,
      amount,
      status,
      dueDate,
      owner: i % 2 === 0 ? 'Eleanor Vance' : 'Marcus Aurelius',
      summaryFields: {
        'Customer': 'Globex Ltd',
        'Linked project': proj,
        'Terms': 'Net 30 Standard'
      },
      activity: [
        { id: `act_inv_${i}`, date: `${(i % 25) + 1} Oct`, description: `Transaction logged for ${proj}` }
      ]
    };

    relationships.push({ fromId: 'cust_globex', toId: id, relationshipName: 'invoice' });
  }

  // 2. Generate 40 Engineering & Operational Tasks with all statuses
  const taskStatuses = ['In Progress', 'In Review', 'Completed', 'Pending'];
  const taskTitles = [
    'CI/CD Pipeline hardening',
    'Kubernetes pod autoscaling policy',
    'Telemetry buffer optimization',
    'Kafka broker latency tuning',
    'ISO 27001 audit evidence collection',
    'Database replication health check',
    'WebSockets connection pooling',
    'OAuth2 JWT rotation schedule',
    'SSL certificate auto-renewal',
    'Three.js GPU buffer caching',
    'Disaster recovery failover simulation',
    'SOC2 Type II compliance check',
    'API rate limiting policy review',
    'Prometheus metrics scraper setup',
    'Grafana dashboard alert rules',
    'Frontend bundle size optimization',
    'React Three Fiber memory profiling',
    'ElasticSearch index compaction',
    'AWS VPC peering latency check',
    'Microservices tracing with OpenTelemetry',
    'Zero-trust mesh network verification',
    'Customer SLA report generation',
    'Contract renewal terms draft',
    'Payment gateway webhook audit',
    'Data pipeline backpressure tuning',
    'Hardware telemetry watchdog timer',
    'Firmware OTA update encryption',
    'Automated smoke test suite execution',
    'Vulnerability scan on edge gateways',
    'Postgres connection pool exhaustion fix',
    'Redis cache eviction tuning',
    'Load balancer health check interval',
    'Static asset CDN distribution',
    'Audit log tamper-proofing check',
    'Service mesh mTLS certificate audit',
    'End-to-end encryption key exchange',
    'Edge node heartbeat interval tuning',
    'Sprint 15 velocity retrospection',
    'GraphQL schema federation deprecation',
    'Cloud cost allocation tagging'
  ];

  taskTitles.forEach((title, idx) => {
    const id = `task_gen_${idx + 1}`;
    const status = taskStatuses[idx % taskStatuses.length];
    objects[id] = {
      id,
      companyId: 'company_globex',
      type: 'task',
      name: title,
      status,
      dueDate: `${(idx % 25) + 1} November 2026`,
      owner: idx % 2 === 0 ? 'Sarah Connor' : 'Marcus Aurelius',
      summaryFields: {
        'Parent project': idx % 2 === 0 ? 'Project Alpha' : 'Project Beta',
        'Priority': idx % 3 === 0 ? 'Urgent' : 'Normal'
      }
    };
    relationships.push({ fromId: 'cust_globex', toId: id, relationshipName: 'task' });
    if (idx < 6) {
      relationships.push({ fromId: 'proj_alpha', toId: id, relationshipName: 'task' });
    }
  });

  // 3. Generate 20 People/Contacts
  const contacts = [
    { name: 'Dr. Peter Silberman', role: 'Director of QA & Systems' },
    { name: 'Miles Dyson', role: 'Principal Architect - Distributed Systems' },
    { name: 'John Connor', role: 'Head of Product Architecture' },
    { name: 'Kyle Reese', role: 'Lead Information Security Officer' },
    { name: 'Grace Harper', role: 'Staff Platform Engineer' },
    { name: 'Dani Ramos', role: 'Director of Global Operations' },
    { name: 'Marcus Wright', role: 'Lead Hardware Telemetry Specialist' },
    { name: 'Tarissa Dyson', role: 'VP Corporate Relations' },
    { name: 'Ed Traxler', role: 'Senior Compliance Director' },
    { name: 'Hal Vukovich', role: 'Infrastructure Operations Lead' },
    { name: 'Kate Brewster', role: 'Head of Enterprise Engineering' },
    { name: 'Robert Brewster', role: 'Executive Technology Advisor' },
    { name: 'Devon Martinez', role: 'Lead DevOps & Cloud Systems' },
    { name: 'Aria Sterling', role: 'Senior Technical Account Manager' },
    { name: 'Julian Vance', role: 'VP Global Enterprise Partnerships' },
    { name: 'Elena Rostova', role: 'Principal Security Researcher' },
    { name: 'Lucas Scott', role: 'Senior Site Reliability Architect' },
    { name: 'Nadia Chen', role: 'Director of Data Science' },
    { name: 'Mateo Alvarez', role: 'Lead Frontend UI Systems' },
    { name: 'Zoe Washington', role: 'Product Operations Manager' }
  ];

  contacts.forEach((person, idx) => {
    const id = `person_gen_${idx + 1}`;
    objects[id] = {
      id,
      companyId: 'company_globex',
      type: 'person',
      name: person.name,
      owner: 'Globex Ltd',
      status: person.role,
      summaryFields: {
        'Department': 'Global Engineering & Ops',
        'WorkOS ID': `USR-0${idx + 200}`,
        'Office': 'Zurich / London / SF'
      }
    };
    relationships.push({ fromId: 'cust_globex', toId: id, relationshipName: 'person' });
  });

  // 4. Products, Contracts, Payments
  const products = [
    'Enterprise Cloud Platform',
    'Edge Telemetry Gateway',
    'Predictive Maintenance AI Engine',
    'WorkOS Identity Federation Broker',
    'Zero-Trust Security Mesh',
    'High-Throughput Event Bus',
    'Distributed Database Replica Cluster',
    'Robotics Real-Time OS Kernel',
    'Cloud Cost Optimization Suite',
    'Autonomous Logistics Sensor Node'
  ];

  products.forEach((pName, idx) => {
    const id = `prod_gen_${idx + 1}`;
    objects[id] = {
      id,
      companyId: 'company_globex',
      type: 'product',
      name: pName,
      status: idx % 3 === 0 ? 'Active Subscription' : idx % 3 === 1 ? 'Deployed' : 'Trial',
      summaryFields: {
        'License Tier': 'Enterprise Fleet',
        'SLA': '99.999% Guaranteed'
      }
    };
    relationships.push({ fromId: 'cust_globex', toId: id, relationshipName: 'product' });
  });

  const contracts = [
    { title: 'Master Services Agreement 2026', status: 'Executed' },
    { title: '99.99% Availability SLA Addendum', status: 'Active' },
    { title: 'SOC2 Type II Audit Compliance Exhibit', status: 'Executed' },
    { title: 'ISO 27001 Data Privacy Framework', status: 'Active' },
    { title: 'Global Enterprise Fleet Support Terms', status: 'Draft' }
  ];

  contracts.forEach((c, idx) => {
    const id = `contract_gen_${idx + 1}`;
    objects[id] = {
      id,
      companyId: 'company_globex',
      type: 'contract',
      name: c.title,
      status: c.status,
      summaryFields: {
        'Signatory': 'Eleanor Vance',
        'Jurisdiction': 'Delaware Commercial'
      }
    };
    relationships.push({ fromId: 'cust_globex', toId: id, relationshipName: 'contract' });
  });

  const payments = [
    { code: 'PAY-9012', amount: '₹120,000', status: 'Settled' },
    { code: 'PAY-9013', amount: '₹84,500', status: 'Settled' },
    { code: 'PAY-9014', amount: '₹350,000', status: 'In Escrow' },
    { code: 'PAY-9015', amount: '₹95,000', status: 'Pending Authorization' },
    { code: 'PAY-9016', amount: '₹62,000', status: 'Processing' }
  ];

  payments.forEach((p, idx) => {
    const id = `pay_gen_${idx + 1}`;
    objects[id] = {
      id,
      companyId: 'company_globex',
      type: 'payment',
      name: p.code,
      amount: p.amount,
      status: p.status,
      summaryFields: {
        'Gateway': 'HDFC Corporate Wire',
        'Reference': `TXN-884${idx}`
      }
    };
    relationships.push({ fromId: 'cust_globex', toId: id, relationshipName: 'payment' });
  });

  return { objects, relationships };
}

const enterpriseDataset = generateComprehensive1000Dataset();

export const SAMPLE_OBJECTS: Record<string, BusinessObject> = enterpriseDataset.objects;
export const RELATIONSHIPS: RelationshipConnection[] = enterpriseDataset.relationships;

// Export large generator ensuring canonical invoices are at the top
export function generateLargeInvoiceSet(count: number = 1000): BusinessObject[] {
  const baseInvoices = [
    BASE_OBJECTS['inv_0042'],
    BASE_OBJECTS['inv_0041'],
    BASE_OBJECTS['inv_0043'],
    BASE_OBJECTS['inv_0044'],
    BASE_OBJECTS['inv_0045'],
    BASE_OBJECTS['inv_0046'],
    BASE_OBJECTS['inv_0047']
  ].filter(Boolean);

  const statuses = ['Paid', 'Due', 'Draft', 'Pending Approval'];
  const items: BusinessObject[] = [...baseInvoices];
  for (let i = 8; i <= count; i++) {
    const num = String(i).padStart(4, '0');
    items.push({
      id: `inv_stress_${num}`,
      companyId: 'company_globex',
      type: 'invoice',
      name: `INV-${num}`,
      code: `INV-${num}`,
      amount: `₹${(Math.floor((i * 47) % 800) + 100) * 100}`,
      status: statuses[i % statuses.length],
      dueDate: `${(i % 28) + 1} November 2026`,
      owner: i % 2 === 0 ? 'Eleanor Vance' : 'Marcus Aurelius',
      summaryFields: {
        'Customer': 'Globex Ltd',
        'Linked project': 'Project Alpha'
      }
    });
  }
  return items;
}
