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
        const uploadedFile = await storage.createFile(bucketID, ID.unique(), file);
        const imageUrl = await storage.getFileView(bucketID, uploadedFile.$id);
        return imageUrl; 
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    } finally {
        console.log("Upload to storage completed.");
    }
};

const convertBlobToFile = async (blobUrl, filename) => {
    try {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        const file = new File([blob], filename, { type: blob.type });
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
        
        const doc = await database.getDocument(DATABASE_ID, HISTORY_COLLECTION_ID, documentId);

        
        const photoURL = doc.photoURL;
        const match = photoURL.match(/files\/([^/]+)\//); 
        const fileId = match ? match[1] : null;

        if (fileId) {
            await storage.deleteFile(IMAGES_BUCKET_ID, fileId);
        } else {
            console.warn("Could not extract fileId from photoURL:", photoURL);
        }

        await database.deleteDocument(DATABASE_ID, HISTORY_COLLECTION_ID, documentId);
    } catch (error) {
        console.error(`Error deleting history item with ID ${documentId}:`, error);
        throw error;
    }
};