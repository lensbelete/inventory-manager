# Inventory manager (Expo + NativeWind)

Small React Native demo that simulates **user registration**, **product catalog**, **stock changes**, and a **paginated transaction history** using only in-memory state (no backend).

**Repository:** [https://github.com/lensbelete/inventory-manager](https://github.com/lensbelete/inventory-manager)

## Setup

Requirements: Node.js (LTS recommended) and npm.

```bash
npm install
npm start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with Expo Go.

## What’s included

- **Users** — register email and full name (listed below the form after signup).
- **Products** — register SKU, name, price, and initial quantity (SKU must be unique; validation on all fields).
- **Stock** — add or remove quantity per product; removals are blocked if stock would go negative.
- **Status** — each product shows SKU, quantity, and last updated time.
- **History** — chronological list of changes with simple previous/next pagination.

Mutations use a short artificial delay to mimic async API calls while staying entirely on-device.

## Approach and trade-offs

- **State:** A single `InventoryProvider` holds React state (`useState`) for users, products, and transactions. A `useRef` mirror of the user list avoids stale closures when labeling the active user on async-style updates. This keeps the app small and easy to follow versus Redux or server state libraries.

- **Why Context:** Tabs need shared data without prop drilling; Context is sufficient at this scale. The trade-off is that any state change re-renders all consumers; for a larger catalog you would split contexts, memoize lists, or move to a store with selectors.

- **Styling:** NativeWind (`className`) keeps UI consistent with Tailwind-style tokens. Some React Native layout quirks still apply (e.g. keyboard avoidance, `ScrollView` vs `FlatList` for very long lists).

- **Persistence:** Nothing is saved after reload. Adding `AsyncStorage` or SQLite would be the next step if data must survive restarts.

- **Pagination:** History paging is client-side only (`slice` on the in-memory array). With a real API you would use cursor or offset parameters instead.

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm start`    | Start Expo dev server    |
| `npm run ios`  | Open iOS simulator       |
| `npm run android` | Open Android emulator |
| `npm run web`  | Run in web browser       |
| `npm run lint` | Run ESLint               |
