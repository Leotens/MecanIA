//The AI Chatbot flow provides expert maintenance assistance to technicians.
//- chatbotAssistance - A function that handles the chatbot assistance process.
//- ChatbotAssistanceInput - The input type for the chatbotAssistance function.
//- ChatbotAssistanceOutput - The return type for the chatbotAssistance function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatbotAssistanceInputSchema = z.object({
  userQuery: z.string().describe('The user query about industrial machine maintenance.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The chat history between the user and the assistant.'),
});
export type ChatbotAssistanceInput = z.infer<typeof ChatbotAssistanceInputSchema>;

const ChatbotAssistanceOutputSchema = z.object({
  response: z.string().describe('The AI chatbot response to the user query.'),
});
export type ChatbotAssistanceOutput = z.infer<typeof ChatbotAssistanceOutputSchema>;

export async function chatbotAssistance(input: ChatbotAssistanceInput): Promise<ChatbotAssistanceOutput> {
  return chatbotAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotAssistancePrompt',
  input: {
    schema: ChatbotAssistanceInputSchema,
  },
  output: {
    schema: ChatbotAssistanceOutputSchema,
  },
  prompt: `You are an expert AI chatbot assistant specialized in industrial machine maintenance.
  Your role is to provide guidance and advice to maintenance technicians to help them troubleshoot industrial machines.
  Consider the existing chat history to provide context-aware responses.

  Chat History:
  {{#each chatHistory}}
    {{#if (eq role \"user\")}}
      User: {{{content}}}
    {{else}}
      Assistant: {{{content}}}
    {{/if}}
  {{/each}}

  User Query: {{{userQuery}}}

  Response:`, //The prompt is now formatted with Handlebars.
});

const chatbotAssistanceFlow = ai.defineFlow(
  {
    name: 'chatbotAssistanceFlow',
    inputSchema: ChatbotAssistanceInputSchema,
    outputSchema: ChatbotAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
