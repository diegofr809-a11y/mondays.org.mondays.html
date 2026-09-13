import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
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

  // AI Chat endpoint (supports Navy AI key sk-navy-... and Google Gemini with auto-fallback)
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history, systemInstruction, temperature, apiKey } = req.body;

      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'A message prompt is required.' });
      }

      const defaultSystemPrompt =
        systemInstruction ||
        'You are grrmondays AI, an intelligent, helpful, and friendly AI assistant. You assist users with homework, science, history, programming, math formulas, gaming, and general research. Provide direct, informative, well-formatted markdown answers with helpful lists, bold emphasis, and code blocks.';

      const promptText = message.trim();
      const requestedKey = (apiKey && typeof apiKey === 'string' && apiKey.trim()) || '';

      // 1. If user explicitly provided a Navy AI key (sk-navy-...), attempt Navy AI
      if (requestedKey.startsWith('sk-navy-')) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);

          const navyMessages = [
            { role: 'system', content: defaultSystemPrompt },
          ];

          if (Array.isArray(history)) {
            for (const item of history) {
              if (item && item.text && typeof item.text === 'string' && item.text.trim()) {
                navyMessages.push({
                  role:
                    item.role === 'model' || item.role === 'ai' || item.role === 'assistant'
                      ? 'assistant'
                      : 'user',
                  content: item.text.trim(),
                });
              }
            }
          }

          navyMessages.push({
            role: 'user',
            content: promptText,
          });

          const navyResponse = await fetch('https://api.navy/v1/chat/completions', {
            method: 'POST',
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${requestedKey}`,
            },
            body: JSON.stringify({
              model: 'gemini-3.8-flash',
              messages: navyMessages,
              temperature: typeof temperature === 'number' ? Math.max(0, Math.min(2, temperature)) : 0.7,
            }),
          });
          clearTimeout(timeoutId);

          if (navyResponse.ok) {
            const navyData = await navyResponse.json();
            const navyReply = navyData.choices?.[0]?.message?.content;
            if (navyReply && typeof navyReply === 'string' && navyReply.trim()) {
              return res.json({ reply: navyReply.trim(), provider: 'navy' });
            }
          }
        } catch {
          // Gracefully continue to Google Gemini
        }
      }

      // 2. Google Gemini engine with multi-model resilience (3.6 -> 3.8 -> 3.5)
      const geminiApiKey =
        (!requestedKey.startsWith('sk-navy-') && requestedKey) ||
        process.env.GEMINI_API_KEY;

      if (!geminiApiKey) {
        return res.status(400).json({
          error:
            'No valid AI API key available. Please configure your API key in Settings.',
        });
      }

      const ai = new GoogleGenAI({
        apiKey: geminiApiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Format Gemini conversation history
      const contents = [];

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

      contents.push({
        role: 'user',
        parts: [{ text: promptText }],
      });

      // Try high-availability models with gemini-3.6-flash as primary for instant response times
      const candidateModels = ['gemini-3.6-flash', 'gemini-3.8-flash', 'gemini-3.5-flash-lite'];
      let lastGeminiError = null;

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction: defaultSystemPrompt,
              temperature: typeof temperature === 'number' ? Math.max(0, Math.min(2, temperature)) : 0.7,
            },
          });

          const reply = response.text || 'No response content was generated.';
          return res.json({ reply, provider: 'gemini', model: modelName });
        } catch (err) {
          lastGeminiError = err;
          const isRetryable =
            err?.status === 503 ||
            err?.message?.includes('503') ||
            err?.message?.includes('high demand') ||
            err?.message?.includes('UNAVAILABLE') ||
            err?.status === 429 ||
            err?.message?.includes('429');

          if (isRetryable) {
            continue;
          }
          break;
        }
      }

      throw lastGeminiError || new Error('All AI generation models failed.');
    } catch (err) {
      console.error('AI Service Error:', err);
      const errorMessage =
        err?.message || 'An unexpected error occurred while communicating with the AI service.';
      return res.status(500).json({ error: errorMessage });
    }
  });

  // Vite and Static SPA integration
  const distPath = path.join(process.cwd(), 'dist');
  const distIndexHtml = path.join(distPath, 'index.html');

  if (process.env.NODE_ENV === 'production' && fs.existsSync(distIndexHtml)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(distIndexHtml);
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
