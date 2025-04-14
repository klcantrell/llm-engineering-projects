import { HfInference } from '@huggingface/inference';
import { DataGeneratorForm } from './components/data-generator-form';

async function generateData(formData: FormData) {
  'use server';
  
  const prompt = formData.get('prompt')?.toString();
  
  if (!prompt) {
    return { error: 'Prompt is required' };
  }

  try {
    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
    const messages = [
      {"role": "system", "content": "Generate JSON test data based on the user's description. Only return JSON."},
      {"role": "user", "content": prompt},
    ]
    const result = await hf.chatCompletion({
      model: 'Qwen/Qwen2.5-1.5B-Instruct',
      messages,
      max_new_tokens: 500,
      temperature: 0.7,
      return_full_text: false,
    });

    try {
      return { data: JSON.parse(result.choices[0].message.content ?? '') };
    } catch {
      return { error: 'TODO: Could not generate valid JSON data' };
    }
  } catch (error) {
    console.error('Error generating data:', error);
    return { error: 'Failed to generate data' };
  }
}

export default function Home() {
  return (
    <DataGeneratorForm generateData={generateData} />
  );
}
