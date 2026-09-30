# Mobile packaging — Android + iOS

Khenifra Delivery remains a web-first product at:
https://khenifra-delivery.vercel.app

Capacitor wraps that same production app for Android and iOS. The backend remains Appwrite.

## App identity

- App ID / bundle ID: `com.khenifra.delivery`
- App name: `Khenifra Delivery`
- Production URL: `https://khenifra-delivery.vercel.app`

## First-time setup

From `projects/khenifra-bike-delivery`:

```bash
npm install
npm run mobile:add:android
npm run mobile:add:ios
npm run mobile:sync
```

Do not run `mobile:add:android` or `mobile:add:ios` a second time after the native folders exist.

## Android

Open Android Studio:

```bash
npm run mobile:android
```

Required permissions in `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

For the first release, do not request background location.

Build a signed Android App Bundle from Android Studio:

Build → Generate Signed Bundle / APK → Android App Bundle

Expected Play upload artifact: `.aab`.

## iOS

Open Xcode:

```bash
npm run mobile:ios
```

In `ios/App/App/Info.plist`, add:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Khenifra Delivery uses your location while you are using the app to select pickup points, find nearby available riders, and track active deliveries.</string>
```

Do not add Always/background location for the first release.

In Xcode:
- select the App target
- Signing & Capabilities
- choose the Apple Developer team
- confirm bundle identifier `com.khenifra.delivery`
- Product → Archive
- Distribute App → App Store Connect

## Appwrite production platform

Keep the Web platform for:
- localhost
- khenifra-delivery.vercel.app

The native wrappers load the production HTTPS app and use the same Appwrite project.

## Release test

Before submitting either store build, verify:
1. sign up/sign in/reset password
2. customer creates delivery
3. location permission allowed and denied
4. rider application + approval
5. rider online/offline
6. nearest-rider assignment
7. active rider location refresh
8. customer tracking
9. PIN delivery completion
10. rating/favorite feedback
11. admin authentication and analytics
12. external map links and telephone links
13. app resume after backgrounding
14. slow/offline connection behavior
