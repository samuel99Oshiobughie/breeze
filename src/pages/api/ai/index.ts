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

async function aiPostHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { prompt } = req.body;

        let aiResponseData = null;

        try {
            // console.log('i am in one')
            aiResponseData = await aiResponse(prompt);
            // console.log("AI Response from Together.AI:", aiResponseData);
        } catch (error) {
            if (error instanceof Error && "status" in error && typeof error.status === "number") {
                if (error.status === 429) {
                    console.warn("Together.AI rate limit exceeded. Falling back to AIMLAPI...");
                } else {
                    throw error; // Only throw unexpected errors
                }
            } else {
                throw new Error("An unknown error occurred.");
            }
        }
        
        if (!aiResponseData) {
            try {
                // console.log('i am in two')
                aiResponseData = await aiSecondResponse(prompt);
                // console.log("AI Response from OpenRouter API:", aiResponseData);
            } catch (error) {
                if (error instanceof Error && "status" in error && typeof error.status === "number") {
                    if (error.status === 429) {
                        console.warn("OpenRouter API rate limit exceeded. Falling back to AIMLAPI...");
                    } else {
                        throw error; // Only throw unexpected errors
                    }
                } else {
                    throw new Error("An unknown error occurred.");
                }
            }
        }

        if (!aiResponseData) {
            try {
                // console.log('i am in three')
                aiResponseData = await aiLastResponse(prompt);
                // console.log("AI Response from AIMLAPI:", aiResponseData);
            } catch (error) {
                if (error instanceof Error && "status" in error && typeof error.status === "number") {
                    if (error.status === 429) {
                        console.warn("AIMLAPI rate limit exceeded. No AI providers available.");
                        // console.log('three is exhausted')
                        return res.status(503).json({ 
                            success: false, 
                            message: "Server temporarily down, please try again in 4 minutes." 
                        });
                    } else {
                        throw error; // Only throw unexpected errors
                    }
                } else {
                    throw new Error("An unknown error occurred.");
                }
            }
        }

        if (!aiResponseData) {
            return res.status(503).json({ 
                success: false, 
                message: "Server temporarily down, please try again in 4 minutes." 
            });
        }

        // Proceed with normal intent processing if AI response is valid
        // console.log('ai-Res:', aiResponseData);

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
    }
});