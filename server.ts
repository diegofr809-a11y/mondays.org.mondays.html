import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parser for API requests
  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Gemini AI Chat endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history, systemInstruction, temperature, apiKey } = req.body;

      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'A message prompt is required.' });
      }

      const effectiveKey = apiKey?.trim() || process.env.GEMINI_API_KEY;

      if (!effectiveKey) {
        return res.status(400).json({
          error:
            'Gemini API key is not configured. Please ensure GEMINI_API_KEY is configured in your project settings, or supply an API key in the grrmondays Settings menu.',
        });
      }

      const ai = new GoogleGenAI({
        apiKey: effectiveKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Format multi-turn conversation history
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history) {
          if (item && item.text && typeof item.text === 'string' && item.text.trim()) {
            contents.push({
              role:
                item.role === 'model' || item.role === 'ai' || item.role === 'assistant'
                  ? 'model'
                  : 'user',
              parts: [{ text: item.text.trim() }],
            });
          }
        }
      }

      // Add the current prompt
      contents.push({
        role: 'user',
        parts: [{ text: message.trim() }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction:
            systemInstruction ||
            'You are grrmondays AI, an intelligent, helpful, and friendly AI assistant powered by Google Gemini. You assist users with homework, science, history, programming, math formulas, gaming, and general research. Provide direct, informative, well-formatted markdown answers with helpful lists, bold emphasis, and code blocks.',
          temperature: typeof temperature === 'number' ? Math.max(0, Math.min(2, temperature)) : 0.7,
        },
      });

      const reply = response.text || 'No response content was generated.';
      return res.json({ reply });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      const errorMessage = err?.message || 'An unexpected error occurred while communicating with Gemini AI.';
      return res.status(500).json({ error: errorMessage });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
