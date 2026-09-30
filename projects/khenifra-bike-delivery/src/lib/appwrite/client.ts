import { Account, Client, TablesDB } from "appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

export const isAppwriteConfigured = Boolean(endpoint && projectId);

export const appwriteClient = new Client();

if (endpoint && projectId) {
  appwriteClient.setEndpoint(endpoint).setProject(projectId);
}

export const account = new Account(appwriteClient);
export const tablesDB = new TablesDB(appwriteClient);
