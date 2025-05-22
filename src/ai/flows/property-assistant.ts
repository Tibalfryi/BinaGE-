// 'use server';
/**
 * @fileOverview An AI-powered assistant to help users find apartments based on their specific needs.
 *
 * - propertyAssistant - A function that handles the apartment search process.
 * - PropertyAssistantInput - The input type for the propertyAssistant function.
 * - PropertyAssistantOutput - The return type for the propertyAssistant function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PropertyAssistantInputSchema = z.object({
  preferences: z
    .string()
    .describe(
      'The users preferences for the apartment, including location, price range, number of rooms, and desired amenities.'
    ),
  requirements: z
    .string()
    .optional()
    .describe(
      'Any additional requirements or constraints, such as proximity to public transportation or pet-friendly policies.'
    ),
});
export type PropertyAssistantInput = z.infer<typeof PropertyAssistantInputSchema>;

const PropertyAssistantOutputSchema = z.object({
  apartmentSuggestions: z
    .string()
    .describe(
      'A list of apartment suggestions based on the users preferences and requirements, including key details such as address, price, and number of rooms.'
    ),
  nextQuestions: z
    .string()
    .optional()
    .describe(
      'Follow-up questions to further refine the search, such as preferred neighborhood or specific amenities.'
    ),
});
export type PropertyAssistantOutput = z.infer<typeof PropertyAssistantOutputSchema>;

export async function propertyAssistant(input: PropertyAssistantInput): Promise<PropertyAssistantOutput> {
  return propertyAssistantFlow(input);
}

const propertyAssistantPrompt = ai.definePrompt({
  name: 'propertyAssistantPrompt',
  input: {schema: PropertyAssistantInputSchema},
  output: {schema: PropertyAssistantOutputSchema},
  prompt: `You are an AI-powered apartment search assistant for BinaGE, a service for finding apartments in Batumi.

  Your goal is to help users find the most suitable apartments based on their needs.
  Start by understanding their preferences and requirements, and then provide apartment suggestions.
  If needed, ask follow-up questions to refine the search.

  User Preferences: {{{preferences}}}
  User Requirements: {{{requirements}}}

  Provide apartment suggestions based on the user's preferences and requirements.
  Include key details such as address, price, and number of rooms.

  If you need more information, ask follow-up questions to refine the search, such as preferred neighborhood or specific amenities.
  Remember to keep the conversation concise and focused on finding the best apartments for the user.
  `,
});

const propertyAssistantFlow = ai.defineFlow(
  {
    name: 'propertyAssistantFlow',
    inputSchema: PropertyAssistantInputSchema,
    outputSchema: PropertyAssistantOutputSchema,
  },
  async input => {
    const {output} = await propertyAssistantPrompt(input);
    return output!;
  }
);
