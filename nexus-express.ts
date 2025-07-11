

import { Request, Response } from 'express';
import { 
    streamStrategicReport,
    streamAnalysis,
    getRegionalCities,
    getLiveOpportunities,
    getSymbiosisResponse,
    getOutreachLetter
} from './nexus';

// Helper to stream an async generator to an Express response
async function streamToExpress(generator: AsyncGenerator<string>, res: Response) {
    try {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        
        for await (const chunk of generator) {
            if (chunk) {
                res.write(chunk);
            }
        }
        res.end();
    } catch (error) {
        console.error('Streaming error:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Error during server-side streaming.' });
        } else {
            // If headers are already sent, we can't send a new status code,
            // so we just end the response. The client will see a truncated response.
            res.end();
        }
    }
}

export const nexusApiHandler = async (req: Request, res: Response) => {
    const { action, payload } = req.body;

    if (!action) {
        return res.status(400).json({ message: "Missing 'action' in request body" });
    }

    try {
        switch (action) {
            case 'generateStrategicReport':
                return await streamToExpress(streamStrategicReport(payload), res);
            
            case 'generateAnalysis':
                return await streamToExpress(streamAnalysis(payload.item, payload.region), res);

            case 'getRegionalCities':
                const cities = await getRegionalCities(payload);
                return res.json(cities);
            
            case 'fetchLiveOpportunities':
                 const opportunities = await getLiveOpportunities();
                 // In a self-hosted environment, data is never "mock"
                 return res.json({...opportunities, isMockData: false});

            case 'fetchSymbiosisResponse':
                 const symbiosisResponse = await getSymbiosisResponse(payload.context, payload.history);
                 return res.json({ text: symbiosisResponse });

            case 'generateOutreachLetter':
                const letter = await getOutreachLetter(payload);
                return res.json({ text: letter });

            default:
                return res.status(400).json({ message: `Unknown action: ${action}` });
        }
    } catch (error) {
        console.error(`API Error on action '${action}':`, error);
        const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred.';
        return res.status(500).json({ message: errorMessage });
    }
};