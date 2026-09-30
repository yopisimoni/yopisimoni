import { Client, TablesDB } from "node-appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1";
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "6abc6d6f002d62e54e76";
const apiKey = process.env.APPWRITE_SERVER_API_KEY;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "khenifra_delivery";

if (!apiKey) {
  throw new Error("APPWRITE_SERVER_API_KEY is not configured");
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

export const adminTablesDB = new TablesDB(client);
export const adminDatabaseId = databaseId;
