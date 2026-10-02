# Pulse dating app

Expo React Native app (Android + iOS + web).

## Delivered fixes (2026-10-01)

- **Bottom tab safe-area:** `app/(tabs)/_layout.tsx` uses `useSafeAreaInsets()` and sets `tabBarStyle.paddingBottom` / `height` so tabs sit above Android system nav.
- **Sample photos:** `src/data/mockPhotoAssets.ts` + `mockProfiles` `photo_urls`; `ProfileCard` renders `Image`.
- **Clear filters:** Discover `clearAllHardFilters` clears require + travel chips; IntentRequireFilterBar `onClear`.
- **Keyboard:** `app.json` `softwareKeyboardLayoutMode: resize`; Discover dismiss-on-tap / `keyboardShouldPersistTaps`.
- **UI declutter:** fewer filter chips; More collapses advanced filters; quieter empty states.

## Links

- GitHub: https://github.com/mrfit1/pulse-dating-app
- Web: https://pulse-dating-app-sage.vercel.app
