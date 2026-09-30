import {
  Client,
  TablesDB,
  Permission,
  Role,
} from "node-appwrite";

const endpoint = process.env.APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1";
const projectId = process.env.APPWRITE_PROJECT_ID || "6abc6d6f002d62e54e76";
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.APPWRITE_DATABASE_ID;

if (!apiKey) {
  console.error("Missing APPWRITE_API_KEY.");
  console.error("Create a server API key in Appwrite and export it locally before running this script.");
  process.exit(1);
}

if (!databaseId) {
  console.error("Missing APPWRITE_DATABASE_ID.");
  console.error("Copy the database ID from Appwrite and export it locally before running this script.");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const db = new TablesDB(client);

const tables = [
  {
    id: "profiles",
    name: "Profiles",
    rowSecurity: true,
    permissions: [Permission.create(Role.users())],
    columns: [
      ["varchar", { key: "user_id", size: 36, required: true }],
      ["varchar", { key: "full_name", size: 120, required: false }],
      ["varchar", { key: "phone", size: 30, required: false }],
      ["enum", { key: "preferred_language", elements: ["ar", "fr", "en"], required: true, default: "ar" }],
      ["enum", { key: "role", elements: ["customer", "rider", "merchant", "admin"], required: true, default: "customer" }],
    ],
    indexes: [
      { key: "user_id_unique", type: "unique", columns: ["user_id"], orders: ["ASC"], lengths: [36] },
    ],
  },
  {
    id: "riders",
    name: "Riders",
    rowSecurity: true,
    permissions: [Permission.create(Role.users())],
    columns: [
      ["varchar", { key: "user_id", size: 36, required: true }],
      ["enum", { key: "status", elements: ["pending", "approved", "suspended"], required: true, default: "pending" }],
      ["boolean", { key: "is_online", required: true, default: false }],
      ["enum", { key: "vehicle_type", elements: ["bike", "motorbike"], required: true, default: "bike" }],
    ],
    indexes: [
      { key: "rider_user_unique", type: "unique", columns: ["user_id"], orders: ["ASC"], lengths: [36] },
      { key: "rider_status_idx", type: "key", columns: ["status"], orders: ["ASC"] },
      { key: "rider_online_idx", type: "key", columns: ["is_online"], orders: ["ASC"] },
    ],
  },
  {
    id: "businesses",
    name: "Businesses",
    rowSecurity: true,
    permissions: [Permission.create(Role.users())],
    columns: [
      ["varchar", { key: "owner_id", size: 36, required: true }],
      ["varchar", { key: "name", size: 160, required: true }],
      ["varchar", { key: "phone", size: 30, required: false }],
      ["varchar", { key: "pickup_address", size: 500, required: true }],
    ],
    indexes: [
      { key: "business_owner_idx", type: "key", columns: ["owner_id"], orders: ["ASC"], lengths: [36] },
    ],
  },
  {
    id: "deliveries",
    name: "Deliveries",
    rowSecurity: true,
    permissions: [Permission.create(Role.users())],
    columns: [
      ["varchar", { key: "order_code", size: 20, required: true }],
      ["varchar", { key: "customer_id", size: 36, required: true }],
      ["varchar", { key: "rider_id", size: 36, required: false }],
      ["varchar", { key: "business_id", size: 36, required: false }],
      ["enum", { key: "category", elements: ["food", "groceries", "documents", "parcel"], required: true }],
      ["enum", { key: "status", elements: ["requested", "assigned", "rider_to_pickup", "picked_up", "rider_to_dropoff", "delivered", "cancelled", "failed"], required: true, default: "requested" }],
      ["varchar", { key: "pickup_address", size: 500, required: true }],
      ["varchar", { key: "dropoff_address", size: 500, required: true }],
      ["varchar", { key: "sender_phone", size: 30, required: true }],
      ["varchar", { key: "recipient_phone", size: 30, required: true }],
      ["text", { key: "notes", required: false }],
      ["float", { key: "quoted_price_mad", required: false }],
      ["float", { key: "final_price_mad", required: false }],
      ["varchar", { key: "delivery_pin", size: 10, required: false }],
      ["datetime", { key: "requested_at", required: true }],
      ["datetime", { key: "assigned_at", required: false }],
      ["datetime", { key: "picked_up_at", required: false }],
      ["datetime", { key: "delivered_at", required: false }],
    ],
    indexes: [
      { key: "order_code_unique", type: "unique", columns: ["order_code"], orders: ["ASC"], lengths: [20] },
      { key: "customer_idx", type: "key", columns: ["customer_id"], orders: ["ASC"], lengths: [36] },
      { key: "rider_idx", type: "key", columns: ["rider_id"], orders: ["ASC"], lengths: [36] },
      { key: "status_idx", type: "key", columns: ["status"], orders: ["ASC"] },
      { key: "status_rider_idx", type: "key", columns: ["status", "rider_id"], orders: ["ASC", "ASC"], lengths: [null, 36] },
    ],
  },
  {
    id: "delivery_events",
    name: "Delivery Events",
    rowSecurity: true,
    permissions: [],
    columns: [
      ["varchar", { key: "delivery_id", size: 36, required: true }],
      ["enum", { key: "status", elements: ["requested", "assigned", "rider_to_pickup", "picked_up", "rider_to_dropoff", "delivered", "cancelled", "failed"], required: true }],
      ["text", { key: "note", required: false }],
      ["varchar", { key: "actor_id", size: 36, required: false }],
      ["datetime", { key: "created_at", required: true }],
    ],
    indexes: [
      { key: "delivery_events_delivery_idx", type: "key", columns: ["delivery_id"], orders: ["ASC"], lengths: [36] },
      { key: "delivery_events_actor_idx", type: "key", columns: ["actor_id"], orders: ["ASC"], lengths: [36] },
    ],
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function safe(label, fn) {
  try {
    const result = await fn();
    console.log("✓", label);
    return result;
  } catch (error) {
    if (error?.code === 409) {
      console.log("•", label, "(already exists)");
      return null;
    }
    throw error;
  }
}

async function waitForColumns(tableId) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const result = await db.listColumns({ databaseId, tableId });
    const processing = result.columns.filter((column) => column.status && column.status !== "available");
    if (processing.length === 0) return;
    await sleep(1000);
  }
  throw new Error(`Timed out waiting for columns in ${tableId}`);
}

async function createColumn(tableId, [kind, config]) {
  const common = { databaseId, tableId, ...config };
  switch (kind) {
    case "varchar":
      return db.createVarcharColumn(common);
    case "text":
      return db.createTextColumn(common);
    case "enum":
      return db.createEnumColumn(common);
    case "boolean":
      return db.createBooleanColumn(common);
    case "float":
      return db.createFloatColumn(common);
    case "datetime":
      return db.createDatetimeColumn(common);
    default:
      throw new Error(`Unsupported column type: ${kind}`);
  }
}

for (const table of tables) {
  await safe(`table ${table.id}`, () =>
    db.createTable({
      databaseId,
      tableId: table.id,
      name: table.name,
      permissions: table.permissions,
      rowSecurity: table.rowSecurity,
      enabled: true,
    })
  );

  for (const column of table.columns) {
    await safe(`${table.id}.${column[1].key}`, () => createColumn(table.id, column));
  }

  await waitForColumns(table.id);

  for (const index of table.indexes) {
    const payload = {
      databaseId,
      tableId: table.id,
      key: index.key,
      type: index.type,
      columns: index.columns,
      orders: index.orders,
    };
    if (index.lengths && index.lengths.every((value) => Number.isInteger(value))) {
      payload.lengths = index.lengths;
    }
    await safe(`index ${table.id}.${index.key}`, () => db.createIndex(payload));
  }
}

console.log("\nKhenifra Delivery Appwrite schema setup complete.");
console.log("Next: connect authentication and assign per-row customer/rider permissions when rows are created.");
