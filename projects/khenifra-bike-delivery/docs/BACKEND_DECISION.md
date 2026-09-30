# Backend decision — Appwrite

Status: **Selected for active development**

Khenifra Delivery is moving away from Supabase because free-project constraints do not fit the wider project portfolio.

## Active backend

- Appwrite Cloud
- Authentication
- TablesDB
- Realtime
- Storage later if proof-of-delivery photos are introduced
- GitHub-connected deployment

## Tables

- profiles
- riders
- businesses
- deliveries
- delivery_events

Later:
- pricing_zones
- ratings

## Security rules

1. New resources stay private by default.
2. Enable row security on user-owned/participant tables.
3. A customer can read their own delivery.
4. The assigned rider can read/update only that delivery.
5. Admin operations use server-side credentials only.
6. Never expose an Appwrite API key through NEXT_PUBLIC variables.
7. Realtime subscriptions inherit Appwrite permissions.

## Delivery lifecycle

requested -> assigned -> rider_to_pickup -> picked_up -> rider_to_dropoff -> delivered

Exceptions: cancelled, failed.

## Architecture rule

Screens call our own delivery-service layer instead of scattering Appwrite SDK calls throughout the UI. This keeps Appwrite replaceable later.

## Supabase

The previously created Supabase backend is no longer the active source of truth. Do not add new application dependencies to it.
