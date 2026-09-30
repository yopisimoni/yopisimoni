# Khenifra Delivery — Store Release Checklist

Last reviewed: 2026-09-30

## Current state

### Complete
- Arabic-first customer delivery request UI
- French and English language support
- Appwrite backend connected
- TablesDB schema created
- Real delivery request persistence
- Rider application flow
- Admin rider approval/suspension flow
- PWA manifest and service worker
- Privacy Policy page
- Terms of Use page
- About page
- Contact page
- Data Deletion page
- Legal/support footer links

### Not yet store-ready
- Public HTTPS deployment
- Production Appwrite domains/origins
- Android native wrapper/package
- Android 16 / API 36 target verification
- Signed Android App Bundle (.aab)
- Production app icon/adaptive icon/splash assets
- Store screenshots and feature graphic
- Play Console Data safety form
- Play Console App content declarations
- Content rating questionnaire
- Target audience declaration
- Ads declaration
- App access/reviewer instructions if required
- Public Privacy Policy URL
- Public Support/Contact URL
- Public Data Deletion URL
- Closed testing requirement check for the developer account
- Real-device QA
- Accessibility QA
- Network/offline/failure QA
- Admin-route production hardening
- Delivery dispatch board
- Rider active-delivery workflow
- End-to-end delivery lifecycle validation
- Production monitoring/error logging

## Google Play

### Technical package
- Package the PWA as Android using Capacitor or another approved Android wrapper.
- Target Android 16 / API level 36 or higher for new submissions after 2026-08-31.
- Generate a signed Android App Bundle (.aab).
- Configure Play App Signing.
- Verify min SDK and device compatibility.
- Test install/update on physical Android devices.

### Store listing
Prepare:
- App name
- Short description
- Full description
- App icon
- Feature graphic
- Phone screenshots
- Category
- Contact/support information
- Privacy Policy URL

### App content / policy
Complete in Play Console:
- Privacy policy
- Ads declaration
- App access declaration
- Target audience and content
- Content rating
- Data safety
- Sensitive-permission declarations, if any are added later
- Data deletion URL if account creation is enabled

### Data currently handled by Khenifra Delivery
Current implementation stores:
- Rider/customer Appwrite user identifier
- Name for rider applicants
- Phone numbers
- Pickup address
- Drop-off address
- Delivery notes
- Delivery category/status/timestamps
- Rider vehicle type
- Rider application/approval status
- Pricing fields when used

Current implementation does NOT intentionally collect:
- Background location
- Precise live location
- Contacts
- Photos
- Audio
- Payment-card information

If live rider location is added, update:
- Privacy Policy
- Play Data safety
- Apple App Privacy
- Android/iOS permission disclosures
before release.

### Testing
If the Play developer account is a personal account created after 2023-11-13:
- Closed test
- Minimum 12 testers
- Testers continuously opted in for at least 14 days
- Apply for production access afterward

## Apple App Store

The current PWA is not yet an iOS App Store binary.

Before iOS submission:
- Create native iOS package, likely with Capacitor
- Apple Developer account
- Bundle ID
- Xcode signing/provisioning
- App Store Connect record
- iPhone screenshots
- Privacy Policy URL
- Support URL
- App Privacy disclosures
- Age rating
- Review information
- In-app account deletion if user account creation is offered
- TestFlight QA
- App Review submission

## Production hardening before any public store launch

### Admin security
- Replace temporary admin passcode approach with proper authenticated admin authorization before public production.
- Keep Appwrite server API keys server-only.
- Rotate temporary setup keys.
- Never expose secrets through NEXT_PUBLIC_ variables.
- Add rate limiting to admin endpoints.
- Add audit logs for rider approval and delivery assignment actions.

### User/data controls
- Add in-app data/account deletion workflow if account creation remains part of the release.
- Define retention periods for delivery and rider data.
- Add a production support workflow.
- Confirm legal operator/contact details to publish publicly.

### Delivery operations still required
- Admin delivery dispatch board
- Assign/reassign rider
- Rider availability toggle
- Rider job list
- Pickup confirmation
- Delivery status progression
- Proof/PIN for delivery
- Cancellation/failed-delivery handling
- Customer order status screen
- Pricing confirmation
- End-to-end event logging

## Release gate

Do not submit to production stores until all of these are true:

1. Public HTTPS app is live.
2. Legal/support URLs are publicly accessible.
3. Real delivery lifecycle works end-to-end.
4. Admin authentication is production-safe.
5. Android/iOS packages build successfully.
6. Store privacy declarations match actual code behavior.
7. Required testers have completed the required test period.
8. Physical-device QA passes.
9. No secrets are exposed in client code.
10. Store assets and metadata are complete.
