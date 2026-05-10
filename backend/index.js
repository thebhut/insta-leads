const express = require('express');
const cors = require('cors');
const { processSearch } = require('./services/orchestrator');

const app = express();
const port = process.env.PORT || 3001;

// Prevent crashes from unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Don't exit — keep the server alive
});

app.use(cors());
app.use(express.json());

app.post('/search', async (req, res) => {
    const { query } = req.body;
    
    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        console.log(`Received search request for: ${query}`);
        const results = await processSearch(query);
        res.json(results);
    } catch (error) {
        console.error('Search failed', error);
        res.status(500).json({ error: 'Failed to process search. Check backend logs.' });
    }
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
