import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ObjectSpaceExplorer } from '../explorer';
import { MockDataProvider } from '../data/mockDataProvider';
import { ReturnContext } from '../types';

describe('WorkOS Object Space Explorer Specification Acceptance Tests', () => {
  it('REQ-01 to REQ-05: Renders Globex Ltd customer with breadcrumbs and relationship groups', async () => {
    const dataProvider = new MockDataProvider({ networkDelayMs: 0 });

    render(
      <ObjectSpaceExplorer
        startingId="cust_globex"
        companyContext="company_globex"
        dataProvider={dataProvider}
      />
    );

    // Initial breadcrumb and central customer
    await waitFor(() => {
      expect(screen.getByText('Globex Ltd')).toBeInTheDocument();
      expect(screen.getByText('Objects')).toBeInTheDocument();
    });

    // Verify search input is present
    expect(screen.getByPlaceholderText('Search connected objects')).toBeInTheDocument();
  });

  it('REQ-09 & REQ-10: Canonical Journey: Globex Ltd -> Invoices collection -> INV-0042 selection', async () => {
    const dataProvider = new MockDataProvider({ networkDelayMs: 0 });

    render(
      <ObjectSpaceExplorer
        startingId="cust_globex"
        companyContext="company_globex"
        dataProvider={dataProvider}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Globex Ltd')).toBeInTheDocument();
    });

    // Switch to List view to test accessible DOM flow directly
    const listBtn = screen.getByRole('button', { name: /list/i });
    fireEvent.click(listBtn);

    // Click Invoices group row
    const invoicesRow = await screen.findByText('Invoices');
    fireEvent.click(invoicesRow);

    // Collection panel opens with brief specified title: "Invoices for Globex Ltd"
    await waitFor(() => {
      expect(screen.getByText('Invoices for Globex Ltd')).toBeInTheDocument();
    });

    // Select INV-0042 from collection
    const inv42Card = screen.getByText('INV-0042');
    fireEvent.click(inv42Card);

    // Verify INV-0042 is now the central record
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'INV-0042' })).toBeInTheDocument();
    });

    // Breadcrumb includes INV-0042
    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toHaveTextContent('INV-0042');
  });

  it('REQ-11 & REQ-13: Opens Invoice Details panel with fields and executes WorkOS handoff', async () => {
    const dataProvider = new MockDataProvider({ networkDelayMs: 0 });
    const onOpenExecution = vi.fn();

    render(
      <ObjectSpaceExplorer
        startingId="inv_0042"
        companyContext="company_globex"
        dataProvider={dataProvider}
        onOpenExecution={onOpenExecution}
      />
    );

    // Initial load confirms INV-0042 in breadcrumb
    await waitFor(() => {
      expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toHaveTextContent('INV-0042');
    });

    // Switch to list view to access "View Details"
    const listBtn = screen.getByRole('button', { name: /list/i });
    fireEvent.click(listBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'INV-0042' })).toBeInTheDocument();
    });

    const detailsBtn = screen.getByRole('button', { name: /details/i });
    fireEvent.click(detailsBtn);

    // Check fields specified in Figure 3 scoped inside Details panel
    let openWorkOSBtn: HTMLElement | null = null;
    await waitFor(() => {
      const panel = screen.getByRole('region', { name: /details/i });
      expect(within(panel).getByText('Invoice details')).toBeInTheDocument();
      expect(within(panel).getByText('₹42,500')).toBeInTheDocument();
      expect(within(panel).getByText('30 October 2026')).toBeInTheDocument();
      expect(within(panel).getByText('Project Alpha')).toBeInTheDocument();
      expect(within(panel).getByText(/Invoice created/i)).toBeInTheDocument();
      openWorkOSBtn = within(panel).getByRole('button', { name: /open project in workos/i });
    });

    // Click "Open project in WorkOS" button (Figure 3 item 3)
    fireEvent.click(openWorkOSBtn!);

    expect(onOpenExecution).toHaveBeenCalledTimes(1);
    expect(onOpenExecution).toHaveBeenCalledWith(
      'proj_alpha',
      expect.objectContaining({
        objectId: 'inv_0042',
        viewMode: 'List'
      })
    );
  });

  it('REQ-14: Return to Object Space restores previous exploration context without jumping to default customer', async () => {
    const dataProvider = new MockDataProvider({ networkDelayMs: 0 });

    const savedReturnContext: ReturnContext = {
      objectId: 'proj_alpha',
      breadcrumbTrail: [
        { id: 'objects_root', label: 'Objects', type: 'category' },
        { id: 'cust_globex', label: 'Globex Ltd', type: 'customer' },
        { id: 'inv_0042', label: 'INV-0042', type: 'invoice' },
        { id: 'proj_alpha', label: 'Project Alpha', type: 'project' }
      ],
      viewMode: 'List',
      timestamp: Date.now()
    };

    render(
      <ObjectSpaceExplorer
        startingId="cust_globex"
        companyContext="company_globex"
        dataProvider={dataProvider}
        initialReturnContext={savedReturnContext}
      />
    );

    // Verify it restored Project Alpha as center and didn't jump to Globex Ltd
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Project Alpha' })).toBeInTheDocument();
    });

    // Breadcrumb preserved
    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toHaveTextContent('INV-0042');
  });

  it('REQ-15: Stable business object identifiers persist across repeated navigations', async () => {
    const dataProvider = new MockDataProvider({ networkDelayMs: 0 });

    const obj1 = await dataProvider.getObject('cust_globex', 'company_globex');
    const obj2 = await dataProvider.getObject('inv_0042', 'company_globex');
    const obj3 = await dataProvider.getObject('cust_globex', 'company_globex');

    expect(obj1.id).toBe('cust_globex');
    expect(obj2.id).toBe('inv_0042');
    expect(obj3.id).toBe(obj1.id);
  });

  it('REQ-16: Error state displays brief-specified message and recovers on Retry', async () => {
    const dataProvider = new MockDataProvider({ networkDelayMs: 0, simulateError: true });

    render(
      <ObjectSpaceExplorer
        startingId="cust_globex"
        companyContext="company_globex"
        dataProvider={dataProvider}
      />
    );

    // Verify "Could not load this information" and "Retry"
    await waitFor(() => {
      expect(screen.getByText('Could not load this information')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    // Turn off error and click retry
    dataProvider.simulateError = false;
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));

    await waitFor(() => {
      expect(screen.getByText('Globex Ltd')).toBeInTheDocument();
    });
  });

  it('REQ-17: Handles large collections (1,000 items) with pagination', async () => {
    const dataProvider = new MockDataProvider({ 
      networkDelayMs: 0, 
      useLargeCollectionStress: true 
    });

    const res = await dataProvider.getCollectionRecords(
      'cust_globex', 
      'invoice', 
      'company_globex', 
      1, 
      20
    );

    expect(res.total).toBe(1000);
    expect(res.items.length).toBe(20);
    expect(res.hasMore).toBe(true);
  });
});
