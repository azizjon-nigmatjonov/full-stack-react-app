

export class PortfolioAPI {
    constructor(db) {
        this.db = db;
    }

    async getAllPortfolios() {
        try {
            const portfolios = await this.db.collection('portfolios').find().toArray();
            return portfolios;
        } catch (error) {
            console.error('Error fetching portfolios:', error);
            throw new Error('Failed to fetch portfolios');
        }
    }

    async initializePortfolios() {
        try {
            const portfolios = await this.db.collection('portfolios').countDocuments();
            if (portfolios === 0) {
                const defaultPortfolios = [];
                // Only insert if there are default portfolios to add
                if (defaultPortfolios.length > 0) {
                    await this.db.collection('portfolios').insertMany(defaultPortfolios);
                }
            }
        } catch (error) {
            console.error('Error initializing portfolios:', error);
            throw error;
        }
    }
}