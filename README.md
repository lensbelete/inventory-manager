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

- **Navigation** — left **drawer** (sidebar) for Users, Products, and History; **modals** for registering users/products and adjusting stock.
- **Users** — register email and full name (listed after signup).
- **Products** — register SKU, name, price, and initial quantity (SKU must be unique; validation on all fields).
- **Stock** — add or remove quantity per product; removals are blocked if stock would go negative.
- **Status** — each product shows SKU, quantity, and last updated time.
- **History** — chronological list of changes with simple previous/next pagination.

Mutations use a short artificial delay to mimic async API calls while staying entirely on-device.

## Approach and trade-offs

- **State:** A single `InventoryProvider` holds React state (`useState`) for users, products, and transactions.

- **Why Context:** The drawer screens share data without prop drilling; Context is sufficient at this scale.

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
