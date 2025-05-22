// @/components/ai/ai-assistant-dialog.tsx
"use client";

import React, { useState } from 'react';
import { propertyAssistant, type PropertyAssistantInput, type PropertyAssistantOutput } from '@/ai/flows/property-assistant';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  type: 'user' | 'ai';
  text: string;
}

export function AIAssistantDialog({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newUserMessage: Message = { type: 'user', text: userInput };
    setConversation(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    setUserInput('');

    try {
      // For simplicity, we'll treat all user input as 'preferences' for now.
      // A more sophisticated approach would parse 'preferences' and 'requirements' distinctly.
      const input: PropertyAssistantInput = {
        preferences: userInput,
        // requirements: "Optional additional requirements" // Could be a separate field
      };
      const result: PropertyAssistantOutput = await propertyAssistant(input);
      
      let aiResponseText = result.apartmentSuggestions;
      if (result.nextQuestions) {
        aiResponseText += `\n\nNext steps: ${result.nextQuestions}`;
      }
      
      const newAiMessage: Message = { type: 'ai', text: aiResponseText };
      setConversation(prev => [...prev, newAiMessage]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      const errorMessage: Message = { type: 'ai', text: "Sorry, I encountered an error. Please try again." };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            AI Property Assistant
          </DialogTitle>
          <DialogDescription>
            Describe your ideal apartment, and I'll help you find it.
            E.g., "I'm looking for a 2-room apartment near the sea, pet-friendly, under $700."
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow my-4 pr-6 min-h-[200px] max-h-[40vh]">
          <div className="space-y-4">
            {conversation.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-[80%] ${
                  msg.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-lg bg-muted text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="mt-auto space-y-2">
          <Textarea
            id="userInput"
            placeholder="Type your preferences here..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            rows={3}
            disabled={isLoading}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button type="button" onClick={handleSendMessage} disabled={isLoading || !userInput.trim()} className="w-full">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Wand2 className="h-4 w-4 mr-2" />}
            Ask AI
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
