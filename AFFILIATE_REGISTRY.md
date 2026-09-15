# Affiliate Registry

Canonical affiliate-monetization control file for the `yopisimoni` project portfolio.

## Purpose

This registry exists to add affiliate revenue without contaminating project boundaries, breaking production funnels, mixing analytics, or changing deployment/DNS settings by accident.

## Global safety rules

1. No global affiliate-link injection scripts.
2. No automatic portfolio-wide link replacement.
3. No affiliate program may be used outside its assigned project unless this file is deliberately updated first.
4. Do not change DNS, hosting, deployment, forms, lead routing, analytics IDs, or Make publishing scenarios just to add affiliate monetization.
5. Existing project-specific GA4 properties remain separate.
6. Affiliate links must use clear disclosure where required.
7. Track outbound affiliate clicks with project-scoped events only.
8. Treat committed, deployed, and live-verified states separately.
9. Do not place affiliate monetization inside protected conversion funnels unless explicitly approved.
10. Before editing any project repository, read that repository's `AGENTS.md` and `.chatgpt/PROJECT_CONTROL.md` when present.

## Project assignments

| Project | Canonical repository / channel | Affiliate program | Status | Allowed scope | Protected / forbidden scope |
|---|---|---|---|---|---|
| MyFastOffer4U France | `yopisimoni/MyFastOffer4U-France` / `fr.myfastoffer4u.com` | Sharesub / Ambassub | PENDING REGISTRATION | Subscription-saving pages, relevant comparison/help content, contextual CTAs | No cross-posting to UK property sites; no global scripts |
| NEXT / AI Problem Solver | `yopisimoni/ai-hub-last` / future `next.myfastoffer4u.com` | ElevenLabs | PENDING REGISTRATION | Relevant AI workflow/tool pages and comparisons | No use on property, wedding, café, or portfolio projects |
| NEXT / AI Problem Solver | `yopisimoni/ai-hub-last` / future `next.myfastoffer4u.com` | Manychat / PartnerStack | PENDING REGISTRATION | Relevant automation/social workflow pages and comparisons | No use on unrelated projects |
| MarocVows | `yopisimoni/marocvows` / `marocvows.com` | Travelpayouts | PENDING REGISTRATION | Wedding-travel guides, guest accommodation, transfers, activities, honeymoon/travel context | No interference with future vendor marketplace or lead flows |
| Recipes Inspired / Pinterest | Channel/project location to be verified before code edits | Amazon Associates / Amazon Influencer + Pinterest | ELIGIBILITY CHECK | Relevant kitchen products attached to recipe content and eligible Pins | No unrelated Amazon products; no use on property or wedding funnels |
| MyFastOffer4U UK | `yopisimoni/MyFastOffer4U` / `myfastoffer4u.com` | Property-service referrals (candidate: conveyancing/removals/surveys) | HOLD — REVIEW LATER | Only contextual seller-service guides/results after review | Main enquiry form, OPG referral flow, primary seller CTA, partner consent, lead routing |
| Landlord Exit Hub | MyFastOffer4U ecosystem; exact file location must be verified first | None for now | PROTECTED | None until reviewed | Keep seller/landlord conversion flow clean |
| HUG Cafe QR Ordering | `yopisimoni/-hug-cafe-qr-order` | None | PROTECTED | None | No affiliate monetization |
| Portfolio | `yopisimoni/yopisimoni.github.io` | None | PROTECTED | None | Keep professional showcase clean |

## Affiliate ID storage rule

Do not commit private credentials, API keys, secrets, access tokens, or dashboard passwords.

Store only safe public tracking identifiers or public affiliate URLs when needed. Secrets must remain in the relevant provider/deployment secret store.

## Tracking standard

Recommended GA4 event:

```text
event_name: affiliate_click
project_scope: <project>
affiliate_provider: <provider>
source_page: <path>
placement: <cta/location>
```

Example:

```text
affiliate_click
project_scope = next
affiliate_provider = elevenlabs
source_page = /workflows/ai-voice
placement = primary_cta
```

Do not replace or merge existing GA4 measurement IDs to implement affiliate tracking.

## UTM convention

When the affiliate provider permits extra tracking parameters:

```text
utm_source=<project>
utm_medium=affiliate
utm_campaign=<content-or-offer>
```

Provider-specific attribution parameters always take precedence over UTM decoration.

## Disclosure rule

Affiliate-enabled pages must use a clear disclosure appropriate to the program and jurisdiction, for example:

> Some links on this website are affiliate links. We may receive a commission if you purchase through them, at no additional cost to you.

Use provider-required wording where stricter wording is mandated.

## Rollout order

1. Sharesub / Ambassub — MyFastOffer4U France
2. ElevenLabs — NEXT
3. Manychat / PartnerStack — NEXT
4. Travelpayouts — MarocVows
5. Amazon / Pinterest — Recipes Inspired, subject to eligibility
6. Property-service referrals — MyFastOffer4U UK only after separate review

## Change-control checklist

Before adding any affiliate link:

- Confirm the project in `AI_PROJECT_REGISTRY.md`.
- Confirm the program is assigned to that project in this file.
- Read repository control/instruction files if present.
- Confirm the destination URL belongs to the intended affiliate provider.
- Confirm disclosure requirements.
- Confirm no existing lead/partner CTA is displaced.
- Add project-scoped tracking only.
- Run local/build checks where applicable.
- Deploy only after code verification.
- Verify the production page and outbound destination after deployment.

## Current implementation state — 2026-09-15

- Control registry created.
- No production website code changed.
- No DNS changed.
- No analytics ID changed.
- No Make scenario changed.
- No existing lead form or partner integration changed.
- No affiliate account credentials stored in GitHub.
- Next operational step: register/verify the first provider account, starting with Sharesub for MyFastOffer4U France.
