import { NextApiRequest, NextApiResponse } from 'next';
import { applyMiddleware } from '@/lib/middleware';
import aiResponse from './aiResponse-togetherAi';
import aiLastResponse from './aiResponse-aiMlAi';
import aiSecondResponse from './aiResponse-openRouter';
import { 
    createTaskController,  
    updateTaskController, 
    deleteTaskController
} from '@/database/task/task';

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Request timed out")), ms);
        promise.then(
            (value) => {
                clearTimeout(timeout);
                resolve(value);
            },
            (err) => {
                clearTimeout(timeout);
                reject(err);
            }
        );
    });
}


async function aiPostHandler(req: NextApiRequest, res: NextApiResponse) {
    
    try {
        const { prompt } = req.body;

        let aiResponseData = null;

        async function tryAiProvider(provider: () => Promise<any>, providerName: string) {
            try {
                aiResponseData = await provider();
                console.log(`AI Response from ${providerName}:`, aiResponseData);
                return true; // Success
            } catch (error) {
                if (error instanceof Error) {
                    if ("status" in error && typeof error.status === "number" && error.status === 429) {
                        console.warn(`${providerName} rate limit exceeded. Trying next provider...`);
                        return false; // Move to the next provider
                    }
                    if (error.message === "Request timed out") {
                        console.warn(`${providerName} took too long. Skipping to next provider...`);
                        return false; // Move to the next provider
                    }
                }
                throw error; 
            }
        }

        if (!(await tryAiProvider(() => withTimeout(aiResponse(prompt), 5000), "Together.AI"))) {
            if (!(await tryAiProvider(() => withTimeout(aiSecondResponse(prompt), 5000), "OpenRouter"))) {
                await tryAiProvider(() => withTimeout(aiLastResponse(prompt), 5000), "AIMLAPI");
            }
        }
        

        if (!aiResponseData) {
            return res.status(503).json({ 
                success: false, 
                message: "All AI providers exhausted. Please try again in a few minutes." 
            });
        }

        // Extract intent and provided fields
        const { intent, providedFields, message } = aiResponseData;
        const requiredFields = ['title', 'description', 'dueDate', 'priority'];
        const missingFields = requiredFields.filter(field => !providedFields?.[field]);

        if (missingFields.length > 0) {
            return res.status(200).json({
                intent,
                taskData: providedFields,
                message: message || `Please provide the following fields: ${missingFields.join(', ')}.`
            });
        }

        let result;
        switch (intent) {
            case 'create':
                result = await createTaskController(providedFields, req);
                break;
            case 'update':
                result = await updateTaskController(providedFields, req);
                break;
            case 'delete':
                result = await deleteTaskController(providedFields, req);
                break;
            default:
                throw new Error('Unknown intent');
        }

        return res.status(200).json({ success: true, taskData: result, message: '' });
    } catch (error) {
        console.error("aiController:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


export default applyMiddleware(async (req: NextApiRequest, res: NextApiResponse) => {
    // console.time("Execution Time");
    try {
      switch (req.method) {
        case 'POST':
          await aiPostHandler(req, res);
          break;
        default:
          res.status(400).json({ success: false, error: 'Method not allowed' });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Server error' });
    }finally {
        // console.timeEnd("Execution Time"); // ✅ Ensure it always runs
    }
});