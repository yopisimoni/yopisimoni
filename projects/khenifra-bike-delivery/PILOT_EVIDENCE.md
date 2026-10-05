# Pilot evidence and release gates — 5 October 2026

## Implemented and checked
Pagination now traverses all Appwrite rows rather than stopping at 25; admin availability uses recent rider-location/availability data; assignment cannot reset a picked-up or terminal delivery. Rider decline returns an assigned job to the queue. Admin incident notes are private rows with no customer/rider read permissions. Dependency versions and lockfile are pinned. Production build and two pagination regression tests pass.

## Evidence still required
- KBD-01: ten resident and ten business interviews, plus three to five recruited riders. Use the interview log below; no interviews have been fabricated. Do not set prices before reviewing real responses.
- KBD-02: agreed quote/pricing policy and real mobile AR/FR/EN request-flow tests, with customer approval before pickup.
- KBD-03: authenticated dispatch/reassignment/cancellation/private incident acceptance tests against the real Appwrite project. Recheck concurrency under two dispatchers.
- KBD-04: real authenticated availability, accept/decline, pickup, navigation, PIN, earnings and location tests. Review mixed-language screens.
- KBD-05: A timestamped owner event timeline is implemented with explicit permission filtering and no notes/actor identifiers. Revocable, privacy-safe shareable tracking remains outstanding. Existing owner-authenticated tracking and PIN do not prove those acceptance criteria. Agree retention/deletion policy before storing location history; current implementation overwrites the latest position rather than storing a trail.
- Deployment: Vercel connection can list projects but cannot access the team's deployment scope. Builds prove compilation, not live deployment or pilot completion.

## Interview log (one row per consented interview)
Keep identifiable contact details privately, outside this public repository. Record anonymous respondent ID, resident/business/rider type, date, neighborhood, use cases, acceptable price band, expected delivery time, peak hours, constraints and consent status. Summarize counts and findings before locking pricing. Record 30 real pilot delivery outcomes separately without customer addresses or phone numbers.
