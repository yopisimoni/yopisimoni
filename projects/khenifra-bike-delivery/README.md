# Khenifra Bike Delivery

Working name for a hyperlocal delivery platform built for Khenifra, Morocco.

## Mission

Make it simple for residents and local businesses to request a rider for fast delivery across Khenifra without requiring a complex marketplace on day one.

## MVP

### Customer
- Pickup + delivery address
- Delivery category: food, groceries, shop order, documents, parcel
- Sender/recipient phone
- Delivery notes
- Price estimate placeholder
- Cash payment first
- Order status timeline
- WhatsApp support fallback

### Rider
- Online/offline availability
- Nearby delivery requests
- Accept/decline
- Pickup confirmation
- Delivery confirmation
- Delivery code / proof-of-delivery phase
- Earnings summary

### Merchant
- Simple business profile
- Create delivery for an existing shop order
- Saved pickup location
- Order history

### Admin
- Live order queue
- Assign/reassign rider
- Rider approval
- Pricing zones
- Cancel/refund/incident notes
- Basic KPIs

## Product strategy

Phase 1 should solve one problem well: **send something across Khenifra**.

Do not begin with hundreds of restaurant menus. Restaurants and shops can use the same delivery request flow while we validate demand.

## Initial pricing hypothesis

To validate locally, start with transparent zone-based pricing rather than complex surge pricing. Exact prices must be tested with real riders and customers before launch.

## Stack

- Next.js + TypeScript
- Responsive PWA
- Tailwind/CSS
- Appwrite: Auth, TablesDB, Realtime, Storage
- OpenStreetMap/MapLibre or Leaflet for maps
- WhatsApp deep links for support/fallback
- Cash first; add Moroccan online payment only after validating demand
- Arabic-first interface (default) with full RTL support
- French as secondary language
- English as tertiary language
- All customer, rider, merchant and admin screens must use shared translation keys; no hard-coded single-language UI

## Core entities

`users`, `riders`, `businesses`, `deliveries`, `delivery_events`, `pricing_zones`, `ratings`

## Delivery lifecycle

`requested -> assigned -> rider_to_pickup -> picked_up -> rider_to_dropoff -> delivered`

Exceptions: `cancelled`, `failed`

## Validation target

Before building the full marketplace:
1. Recruit 3-5 reliable riders.
2. Recruit 5-10 local businesses.
3. Run the first 30 real deliveries.
4. Measure request-to-assignment time, delivery time, cancellation rate, rider earnings, repeat customers and contribution margin.
5. Only then expand into full restaurant/store discovery.

## Folder status

MVP shell initialized. Appwrite is the active backend choice. Next: create the Appwrite project/database/tables, connect authentication, persist delivery requests, then build realtime dispatch and mapping.
