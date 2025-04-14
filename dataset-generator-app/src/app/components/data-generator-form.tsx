'use client';

import { useFormStatus } from 'react-dom';
import { useChatHistory } from '../hooks/use-chat-history';
import { useRef } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Generating...' : 'Send'}
    </button>
  );
}

export function DataGeneratorForm({ 
  generateData
}: { 
  generateData: (formData: FormData) => Promise<{ data?: unknown; error?: string; }>;
}) {
  const { messages, addMessages, clearHistory } = useChatHistory();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    const prompt = formData.get('prompt')?.toString() || '';
    const result = await generateData(formData);
    
    addMessages([
      { role: 'user', content: prompt },
      { 
        role: 'assistant', 
        content: JSON.stringify(result.data || result.error, null, 2)
      }
    ]);

    formRef.current?.reset();
  }

  return (
    <div className="flex flex-col min-h-screen p-4">
      <header className="text-center py-4">
        <h1 className="text-2xl font-bold">AI Test Data Generator</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Describe the data you need, and I&apos;ll generate it for you
        </p>
      </header>

      <div className="flex-1 max-w-3xl mx-auto w-full">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Chat History</h2>
          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
            >
              Clear History
            </button>
          )}
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4 h-[60vh] overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No messages yet. Start a conversation!
            </p>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-800'
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {message.content}
                  </pre>
                </div>
              </div>
            ))
          )}
        </div>

        <form 
          ref={formRef}
          action={handleSubmit}
          className="flex gap-2"
        >
          <input
            type="text"
            name="prompt"
            placeholder="Describe the test data you need..."
            className="flex-1 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}