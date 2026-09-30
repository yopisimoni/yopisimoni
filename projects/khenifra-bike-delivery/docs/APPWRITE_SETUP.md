# One-command Appwrite schema setup

The Appwrite dashboard is already connected to the Khenifra Delivery project.

This script creates the application schema automatically so columns and indexes do not have to be entered manually.

## 1. Create a server API key

In Appwrite Console open:

**API Keys → Create API key**

Give it only the database schema scopes needed for setup:

- databases.read
- tables.read
- tables.write
- columns.read
- columns.write
- indexes.read
- indexes.write

Do not paste the API key into ChatGPT and do not commit it to GitHub.

## 2. Find the database ID

Open the **Khenifra Delivery** TablesDB database and copy its database ID.

## 3. Run locally

From the project folder:

```bash
cd projects/khenifra-bike-delivery
npm install

export APPWRITE_ENDPOINT="https://fra.cloud.appwrite.io/v1"
export APPWRITE_PROJECT_ID="6abc6d6f002d62e54e76"
export APPWRITE_DATABASE_ID="YOUR_DATABASE_ID"
export APPWRITE_API_KEY="YOUR_PRIVATE_API_KEY"

npm run setup:appwrite
```

The setup is idempotent: if a table, column, or index already exists, the script skips it.

## Tables created

- profiles
- riders
- businesses
- deliveries
- delivery_events

Row security is enabled for all user-owned/participant tables. Client access remains restrictive; per-row customer and rider permissions are assigned by application logic when a row is created.

## Important

The API key is a server secret. Never put it in:

- NEXT_PUBLIC variables
- browser code
- GitHub source
- screenshots
- chat messages

Delete or rotate the setup API key after the schema has been created if it is no longer needed.
