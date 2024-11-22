export interface IPR {
    _id: string;
    title: string;
    description: string;
    type: 'Patent' | 'Trademark' | 'Copyright' | 'Trade Secret';
    filingDate: string;
    status: 'Pending' | 'Accepted' | 'Rejected';
    relatedDocuments: Array<{
        public_id: string;
        secure_url: string;
    }>;
    transactionHash: string;
}