# AI Project Registry

This file is the canonical GitHub project map for AI-assisted work on the yopisimoni account.

## Rule zero
Before editing any repository:
1. Identify the exact project requested by the user.
2. Match it to this registry.
3. Open that repository's `AGENTS.md`.
4. Open that repository's `.chatgpt/PROJECT_CONTROL.md`.
5. Do not edit an unclassified repository until its purpose is verified.

## Canonical active projects

| Project | Canonical repository | Primary domain / intended domain | Relationship | Status rule |
|---|---|---|---|---|
| MyFastOffer4U UK | `yopisimoni/MyFastOffer4U` | https://myfastoffer4u.com | Main UK property project | Verify production deployment before claiming a GitHub commit is live |
| MyFastOffer4U France | `yopisimoni/MyFastOffer4U-France` | https://fr.myfastoffer4u.com | Separate France product | Never reuse UK project identifiers or assumptions |
| NEXT | `yopisimoni/next.myfastoffer4u.com` | https://next.myfastoffer4u.com | Separate AI-focused project in MyFastOffer4U ecosystem | Treat deployment/DNS/analytics as unverified until checked |
| MarocVows | `yopisimoni/marocvows` | https://www.marocvows.com/ | Separate Morocco wedding platform | Never mix with MyFastOffer4U |

## Special scope notes
- Landlord Exit Hub belongs to the MyFastOffer4U ecosystem, but it is not interchangeable with the main UK site. Only work on it when the task explicitly targets Landlord Exit Hub.
- Other repositories on the account may be experiments, archived work, old versions, or unrelated products. Do not assume they are current.
- Similar names are not enough to establish identity.

## Cross-project safety rules
- Never copy analytics IDs between projects unless explicitly requested and verified.
- Never copy DNS, CNAME, redirects, environment variables, forms, partner settings, or authentication settings between projects by assumption.
- Never report "done" only because a commit succeeded.
- For production tasks, verify the actual live target after deployment.
- If the user's request is ambiguous, resolve it against this registry before editing.

## Completion standard
A production-affecting task is complete only when all applicable checks pass:
- correct repository selected;
- current files inspected;
- smallest safe change committed;
- deployment status checked;
- production URL tested;
- requested behavior confirmed;
- no obvious regression;
- project record remains isolated from unrelated repos.

## Unclassified repositories
Any repository not listed above is unclassified for AI-assisted production work until its current purpose is verified.
