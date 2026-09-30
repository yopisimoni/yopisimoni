# PWA to Google Play path

## Current target

Build and validate Khenifra Delivery first as an installable Progressive Web App.

### PWA requirements

- Arabic is the default language with RTL layout.
- French is second.
- English is third.
- Web app manifest.
- Service worker.
- HTTPS production deployment.
- App icon set.
- Mobile responsive experience.
- Offline-safe app shell.
- No background location until it is operationally necessary.

## Pilot install flow

1. User opens the HTTPS app in Chrome on Android.
2. Browser offers Install app / Add to Home screen when eligible.
3. The app opens in standalone mode like a normal mobile app.
4. We test the first 30 real deliveries before Play Store publication.

## Google Play phase

1. Create production 192px, 512px and adaptive icon assets.
2. Add a stable production domain.
3. Generate Android package using Capacitor or a Trusted Web Activity.
4. Produce a signed Android App Bundle (.aab).
5. Create the Google Play Console app.
6. Add Arabic store listing first, then French and English.
7. Complete Data Safety, content rating, permissions and privacy disclosures.
8. Use internal/closed testing.
9. Fix issues found on real Android devices.
10. Submit production release.

## Location policy

Customer location should initially be foreground-only and optional where possible.
Rider realtime location should only be collected during an active delivery.
Background location is postponed until the need is proven and Play policy requirements are fully satisfied.
