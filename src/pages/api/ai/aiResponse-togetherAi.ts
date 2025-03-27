import Together from 'together-ai';
const together = new Together();
import axios from "axios";

async function aiResponse(input: string) {
    // console.log('input: ', input)

    try {
        const stream = await together.chat.completions.create({
            model: 'deepseek-ai/DeepSeek-R1',
            messages: [
                {
                    role: "system",
                    content: `
                      You are a task management assistant. Analyze user prompts to extract intent (create, update, delete) and task details (title, description, dueDate, priority).
                      Priority must be 'high', 'medium', or 'low'. 
                  
                      If the intent is 'create', ensure all required fields (title, description, dueDate, priority) are provided. 
                      If any required fields are missing, return a JSON object with:
                      - "intent": (detected intent)
                      - "providedFields": (an object containing only the provided task details)
                      - "message": (a message prompting the user for missing fields).
                  
                      The key containing the task details must always be named **"providedFields"**.
                      Do not use alternative names like "taskDetails" or "taskInfo". 
                      If the model mistakenly tries to use a different name, **correct it to "providedFields" before responding**.
                  
                      Respond only with a valid JSON object, enclosed in triple backticks as follows:
                      
                      \`\`\`json
                      {
                        "intent": "create",
                        "providedFields": {
                          "title": "Task Title",
                          "description": "Task Description",
                          "dueDate": "YYYY-MM-DD",
                          "priority": "high"
                        },
                        "message": "Please provide missing fields if any."
                      }
                      \`\`\`
                    `
                  }
                  ,
              { 
                  role: 'user', 
                  content: input },
            ],
            stream: true,
          });
          

        let fullResponse = ''; // Accumulate response

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            fullResponse += content;
        }
        // console.log("Raw AI Response:", fullResponse);

        // Extract JSON using regex
        const jsonMatch = fullResponse.match(/```json\s*([\s\S]*?)\s*```/);
        if (!jsonMatch) {
            throw new Error("Failed to extract JSON from AI response.");
        }
        // console.log("JSON-MATCH: ", jsonMatch)

        const jsonString = jsonMatch[1]; // Extract JSON part
        // console.log("JSON-STRING: ", jsonString)

        const parsedResponse = JSON.parse(jsonString);
        // console.log("Parsed JSON:", parsedResponse);
        
        return parsedResponse;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("API Error Response: ", error.response?.data || error.message);
        } else {
            console.error("Unexpected Error: ", error);
        }
        throw error;
    }
}

export default aiResponse;
