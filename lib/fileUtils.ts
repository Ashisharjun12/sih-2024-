export const getFileUrl = (fileId: string, type: 'view' | 'preview' = 'view') => {
    return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_PDF_BUCKET_ID}/files/${fileId}/${type}?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
};

export const getFileUrls = (fileId: string) => {
    return {
        public_id: fileId,
        secure_url: getFileUrl(fileId, 'view'),
        preview_url: getFileUrl(fileId, 'preview')
    };
}; 