import { Client, Storage, ID, Models } from 'appwrite';

// Check if required environment variables are set
if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) {
    throw new Error('NEXT_PUBLIC_APPWRITE_ENDPOINT is not set');
}
if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
    throw new Error('NEXT_PUBLIC_APPWRITE_PROJECT_ID is not set');
}
if (!process.env.NEXT_PUBLIC_APPWRITE_PDF_BUCKET_ID) {
    throw new Error('NEXT_PUBLIC_APPWRITE_PDF_BUCKET_ID is not set');
}

// Initialize Appwrite client
const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const storage = new Storage(client);

// Bucket ID for PDF files
const PDF_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_PDF_BUCKET_ID;

// Define response types
interface AppwriteFileResponse {
    $id: string;
    name: string;
    sizeOriginal: number;
    mimeType: string;
}

interface AppwriteUrlResponse {
    href: string;
}

// Upload PDF file
export const uploadPDF = async (file: File) => {
    try {
        console.log('Starting PDF upload to Appwrite...', {
            bucketId: PDF_BUCKET_ID,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
        });

        const response = await storage.createFile(
            PDF_BUCKET_ID,
            ID.unique(),
            file
        ) as AppwriteFileResponse;

        console.log('PDF upload successful:', {
            fileId: response.$id,
            fileName: response.name,
            size: response.sizeOriginal,
            mimeType: response.mimeType
        });

        return {
            fileId: response.$id,
            bucketId: PDF_BUCKET_ID,
            name: response.name,
            size: response.sizeOriginal,
            mimeType: response.mimeType,
        };
    } catch (error) {
        console.error('Error uploading PDF to Appwrite:', {
            fileName: file.name,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
        throw error;
    }
};

// Get PDF view URL
export const getPDFView = async (fileId: string) => {
    try {
        console.log('Starting to get PDF view URL...', { fileId, bucketId: PDF_BUCKET_ID });
        
        // Create the URL directly
        const url = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${PDF_BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

        console.log('Successfully got PDF view URL:', { 
            fileId,
            url 
        });

        return {
            href: url
        };
    } catch (error) {
        console.error('Error getting PDF view:', {
            fileId,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
        throw error;
    }
};

// Delete PDF
export const deletePDF = async (fileId: string) => {
    try {
        console.log('Deleting PDF...', { fileId });
        await storage.deleteFile(
            PDF_BUCKET_ID,
            fileId
        );
        console.log('PDF deletion successful');
        return true;
    } catch (error) {
        console.error('Error deleting PDF:', error);
        throw error;
    }
}; 