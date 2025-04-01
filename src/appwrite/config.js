import { Client, Account, Databases, Storage } from 'appwrite';

export const client = new Client();

client
    .setEndpoint(import.meta.env.VITE_ENDPOINT)
    .setProject(import.meta.env.VITE_PROJECT_ID); 

export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
export const HISTORY_COLLECTION_ID = import.meta.env.VITE_HISTORY_COLLECTION_ID;
export const CODE_BUCKET_ID = import.meta.env.VITE_CODE_BUCKET_ID;
export const UMLCODE_BUCKET_ID = import.meta.env.VITE_UMLCODE_BUCKET_ID;
export const IMAGES_BUCKET_ID = import.meta.env.VITE_IMAGES_BUCKET_ID;

export default client;