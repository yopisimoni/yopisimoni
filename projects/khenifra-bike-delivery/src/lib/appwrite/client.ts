import { Account, Client, TablesDB } from "appwrite";

const endpoint =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
  "https://fra.cloud.appwrite.io/v1";
const projectId =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ||
  "6abc6d6f002d62e54e76";

export const isAppwriteConfigured = Boolean(endpoint && projectId);

export const appwriteClient = new Client();

if (endpoint && projectId) {
  appwriteClient.setEndpoint(endpoint).setProject(projectId);
}

export const account = new Account(appwriteClient);
export const tablesDB = new TablesDB(appwriteClient);
