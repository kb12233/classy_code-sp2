import { database, storage, 
    DATABASE_ID, HISTORY_COLLECTION_ID, 
    IMAGES_BUCKET_ID } from "./config";

import { ID, Query } from "appwrite";


const uploadToStorage = async (file, bucketID, userID) => {
    try {
        if (!(file instanceof File)) {
            console.error("Invalid file object detected:", file);
            throw new Error(`Invalid file type: ${file}`);
        }
        console.log("Attempting to upload file:", file);
        const uploadedFile = await storage.createFile(bucketID, ID.unique(), file);
        console.log("Appwrite createFile response:", uploadedFile);
        const imageUrl = await storage.getFileView(bucketID, uploadedFile.$id);
        console.log("imageUrl before return:", imageUrl);
        return imageUrl; // ✅ Fixed line
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    } finally {
        console.log("uploadToStorage finally block executed");
    }
};

const convertBlobToFile = async (blobUrl, filename) => {
    try {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        console.log("Fetched blob:", blob); 
        const file = new File([blob], filename, { type: blob.type });
        console.log("Created file from blob:", file); // Log the created file
        return file;
    } catch (error) {
        console.error("Error converting blob to file:", error);
        return null;
    }
};

export const saveHistory = async (userID, image, generatedCode, language, umlCode, fileName) => {
    try {
        if(!userID) {
            throw new Error("User required to login to save history");
        }

        let fileToUpload = image;
        if(typeof image === 'string' && image.startsWith('blob:')){
            fileToUpload = await convertBlobToFile(image, fileName);
            if(!fileToUpload){
                throw new Error("Failed to convert blob to file");
            }
        }
        if(!(fileToUpload instanceof File)) {
            throw new Error(`Invalid file type: ${fileToUpload}`);
        }

        const photoURL = await uploadToStorage(fileToUpload, IMAGES_BUCKET_ID, userID);
        console.log("photoURL after uploadToStorage:", photoURL); // This should be the URL
        if(!photoURL) {
            console.error("Error uploading image");
            return;
        }

        await database.createDocument(
            DATABASE_ID, HISTORY_COLLECTION_ID, ID.unique(), {
                userID,
                dateTime: new Date().toISOString(),
                fileName,
                photoURL,
                generatedCode,
                language,
                umlCode,
            }
        );
        console.log("History saved successfully.");
    } catch (error) {
        console.error("Error saving history:", error);
    }
};

export const fetchHistory = async (userID) => {
    try {
        if(!userID) {
            return [];
        }
    
        const response = await database.listDocuments(
            DATABASE_ID, HISTORY_COLLECTION_ID, [
                Query.equal('userID', userID),
                Query.orderDesc('dateTime')
            ]
        );
        return response.documents;
    } catch (error) {
        console.error("Error fetching history:", error);
        return [];
    }
    
}

export const deleteHistoryItem = async (documentId) => {
    try {
        await database.deleteDocument(DATABASE_ID, HISTORY_COLLECTION_ID, documentId);
        console.log(`History item with ID ${documentId} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting history item with ID ${documentId}:`, error);
        throw error; 
    }
};