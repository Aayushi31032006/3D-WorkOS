# WorkOS Object Space Explorer

## Temporary Submission Progress Report

**Project:** WorkOS Object Space Explorer  
**Submission type:** Temporary submission  
**Date:** 2 November 2026

## Team

- Aayushi Jitendra Ramani
- Shreya Hande

## Project overview

The project is an interactive way to explore how business records are connected. A customer, invoice, project, task, person, or product can be placed at the centre of the experience, with its related records shown around it.

The interface is designed to feel like a practical WorkOS tool rather than a static 3D demonstration. Users can move through related records, open details, return to earlier records, and switch to a table-based view when that is more useful.

## Progress completed

### Object Space experience

- Added the WorkOS-style host navigation.
- Built the Object Space Explorer with a light lavender visual direction.
- Added the central record and connected relationship groups.
- Added 3D camera controls for zooming, resetting, and dragging.
- Added readable labels, soft shadows, floor details, selection states, and relationship lines.
- Added the List view as a keyboard-friendly alternative to the 3D view.
- Added an automatic List fallback for environments where WebGL cannot be used reliably.

### Record exploration

- Added customer, invoice, project, task, person, product, contract, and payment records.
- Added stable IDs so opening a record from different places does not create duplicates.
- Added breadcrumbs, Back, Forward, and return navigation.
- Added connected-record search.
- Added temporary details and collection panels.
- Added invoice search, status filters, pagination, and Load more behavior.
- Added activity information and linked-record actions.

### Demonstration journey

The main demonstration journey is working:

```text
Globex Ltd
  -> Invoices
  -> INV-0042
  -> Project Alpha
  -> Open project in WorkOS
  -> Return to Object Space
```

The return flow preserves the selected object, navigation history, filters, and camera context instead of returning to the default customer.

### Sample data and states

- Added 1,000 invoice records with stable IDs.
- Added 20-record collection pages so large collections are not rendered as hundreds of spheres.
- Added simulated loading behavior.
- Added empty collection behavior.
- Added network-error and Retry behavior.
- Added restricted-record messaging without exposing private fields.
- Added company switching between Globex Ltd and Initech Corporation.

### Responsive and host experience

- Added responsive layouts for laptop, tablet, and mobile screens.
- Kept the WorkOS navigation available across screen sizes.
- Added visible demo controls for company switching and state demonstrations.
- Added lightweight placeholder screens for World, Tasks, Review, Gallery, and QM.
- Added visible return actions from host screens.
- Added a full-screen project handoff placeholder that covers the explorer cleanly.

## Validation completed

The current project has been checked with:

- TypeScript validation
- Automated Vitest acceptance tests
- Production Vite build
- Browser smoke testing
- Host navigation testing
- Project handoff and return testing
- 1,000-record collection testing
- Mobile viewport testing
- Git diff and working-tree checks

The automated acceptance suite currently passes all **11 tests**.

## How to run

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

To make the demo available to another device on the same network:

```bash
npm run dev -- --host 0.0.0.0
```

Then open the host computer's local network address with port `3000`.

## Current status

The temporary submission is in a working demonstration state. The core interaction journey, responsive host layout, accessible List view, 3D experience, sample data, handoff screen, and edge-state demonstrations are implemented and ready for review.

The project uses sample data and simulated provider calls as requested. Real WorkOS authentication, permissions, production APIs, and destination screens remain integration work for the WorkOS host environment.
