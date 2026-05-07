# TechSoft Assessment — React Native

> **React Native 0.77 · TypeScript · Supabase · Deep Linking**

## 🚀 Setup Steps

1.  **Clone & Install**:
    ```bash
    git clone <repo-url>
    cd TechSoft_Assessment
    npm install
    ```
2.  **Environment Variables**:
    Open `src/services/supabase.ts` and replace the following with your credentials:
    ```ts
    const SUPABASE_URL = 'YOUR_SUPABASE_URL';
    const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
    ```
3.  **Run on iOS**:
    ```bash
    npx react-native run-ios
    ```

---

## 🔐 Env-Var List

| Variable | Location | Description |
|---|---|---|
| `SUPABASE_URL` | `src/services/supabase.ts` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | `src/services/supabase.ts` | Your Supabase anonymous key |

---

## 🔗 Deep Linking

The app supports the `tectsoft-rn://` scheme.

**To trigger the deep link on the iOS simulator:**
```bash
xcrun simctl openurl booted tectsoft-rn://item/<item-id>
```
Example:
```bash
xcrun simctl openurl booted tectsoft-rn://item/740445a6-9876-4674-8876-e177654321
```

---

## 🧪 Unit Testing

We pick the **Optimistic Update logic** and the **Deep Link parser** for unit testing. The tests are pure logic tests that mock any external dependencies.

**Run tests:**
```bash
npm test
```

---

## 📁 Folder Structure

- `src/components`: Reusable UI components (AppText, AppButton, AppCard).
- `src/screens`: Main screens (Login, ItemsList, ItemDetail).
- `src/navigation`: Navigation container and linking configuration.
- `src/services`: Supabase client initialization.
- `src/hooks`: Custom hooks (useAuth, useTheme, etc.).
- `src/utils`: Pure logic helpers and persistence wrappers.
- `src/types`: TypeScript interfaces.

---

## 🤖 AI Usage Disclosure

This project was built with the assistance of Antigravity (Google DeepMind).

*   **Where AI helped**:
    *   Initial project scaffolding and responsive design utilities.
    *   Generating unit test boilerplate and deep linking configuration steps.
*   **Where I overrode it**:
    *   Fixed incorrect import depth assumptions in component generation.
    *   Adjusted `HeadersInit` types to resolve React Native specific library conflicts.
    *   Manually corrected the `Info.plist` insertion point for URL schemes.
*   **Mistake Example**:
    *   In the first turn, the AI generated components with `../../constants` imports, assuming they were 2 levels deep. Since I placed them 1 level deep, I had to correct the imports across all component files.

---

## ✅ Checklist Compliance

- [x] **Auth**: Supabase session persistence + Sign-out.
- [x] **Items List**: Infinite scroll (page 20) + Pull-to-refresh.
- [x] **Item Detail**: Optimistic favorite toggle + Rollback on error.
- [x] **Deep Linking**: `tectsoft-rn://item/<id>` support.
- [x] **Persistence**: "Continue where you left off" logic for last-viewed item.
- [x] **TypeScript**: Strict mode enabled with no `any` usage.
- [x] **Unit Test**: Pure logic tests for optimistic state and deep link parsing.
- [x] **iOS Only**: Configured for iOS simulator.
