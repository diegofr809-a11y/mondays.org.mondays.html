import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Trash2,
  Lightbulb,
  Copy,
  Check,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

const INITIAL_MESSAGES = [
  {
    id: 'welcome',
    sender: 'ai',
    text: "Hello! I am **grrmondays AI**, powered by **Google Gemini & Navy AI**. Ask me anything—from homework explanations, math problem solving, and writing essays to coding, gaming tips, or general curiosity.",
    timestamp: 'Just now',
  },
];

const PROMPT_SUGGESTIONS = [
  "What is the capital of France?",
  "Explain Newton's Laws simply",
  "Write a Python script to calculate Fibonacci numbers",
  "Step-by-step algebra helper",
  "Summarize the French Revolution",
];

export const LucideAiView = ({ settings }) => {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('grrmondays_ai_chat');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_MESSAGES;
  });

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [lastErrorPrompt, setLastErrorPrompt] = useState(null);
  const chatEndRef = useRef(null);

  // Save conversation to local storage
  useEffect(() => {
    try {
      localStorage.setItem('grrmondays_ai_chat', JSON.stringify(messages));
    } catch {
      // ignore storage quota errors
    }
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const copyMessage = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages(INITIAL_MESSAGES);
    setLastErrorPrompt(null);
    try {
      localStorage.removeItem('grrmondays_ai_chat');
    } catch {
      // ignore
    }
  };

  const handleSend = async (textToSend) => {
    const text = (textToSend ?? input).trim();
    if (!text || isThinking) return;

    setLastErrorPrompt(null);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: now,
    };

    // Update message state
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (!textToSend) setInput('');
    setIsThinking(true);

    // Build chat history for Gemini multi-turn context
    const historyPayload = nextMessages
      .slice(1, -1)
      .filter((m) => !m.isError)
      .slice(-10)
      .map((m) => ({
        role: m.sender === 'ai' ? 'model' : 'user',
        text: m.text,
      }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          systemInstruction: settings?.aiSystemInstructions,
          temperature: settings?.aiTemperature ?? 0.7,
          apiKey: settings?.aiCustomApiKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error ${response.status}`);
      }

      const aiReply = data.reply || 'No response received from Gemini.';

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Failed to get Gemini response:', err);
      setLastErrorPrompt(text);
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: `**Gemini AI encountered an issue:**\n${err?.message || 'Unable to connect to the Gemini API service. Please try again in a moment.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex-1 h-screen flex flex-col lucide-bg select-none">
      {/* Header */}
      <div className="h-14 px-4 sm:px-6 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-surface)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--badge-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent-color)] shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[var(--text-main)]">grrmondays AI</h2>
              {settings?.aiCustomApiKey?.startsWith('sk-navy-') ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-semibold text-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Navy AI & Gemini Flash
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-[10px] font-semibold text-blue-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  Google Gemini Flash
                </span>
              )}
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Real-time AI assistance for homework, coding, research, and answers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[11px] text-[var(--text-dim)] font-mono">
            Temp: {settings?.aiTemperature ?? 0.7}
          </span>
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-[var(--text-dim)] hover:text-red-400 hover:bg-[var(--bg-hover)] border border-transparent hover:border-red-500/20 transition-all"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isErr = msg.isError;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 group ${isUser ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-[var(--accent-color)] text-white shadow-xs'
                      : isErr
                      ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                      : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--accent-color)] shadow-xs'
                  }`}
                >
                  {isUser ? (
                    <User className="w-3.5 h-3.5" />
                  ) : isErr ? (
                    <AlertCircle className="w-3.5 h-3.5" />
                  ) : (
                    <Bot className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-xl p-3.5 text-xs leading-relaxed transition-all relative ${
                    isUser
                      ? 'bg-[var(--accent-color)] text-white shadow-sm'
                      : isErr
                      ? 'bg-red-950/40 border border-red-500/40 text-red-200'
                      : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] shadow-xs'
                  }`}
                >
                  {isUser ? (
                    <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                  ) : (
                    <div className="space-y-2 prose-invert font-sans">
                      <Markdown
                        components={{
                          h1: ({ ...props }) => (
                            <h1 className="text-sm font-bold text-[var(--text-main)] mt-2 mb-1" {...props} />
                          ),
                          h2: ({ ...props }) => (
                            <h2 className="text-xs font-bold text-[var(--text-main)] mt-2 mb-1" {...props} />
                          ),
                          h3: ({ ...props }) => (
                            <h3 className="text-xs font-semibold text-[var(--text-main)] mt-1.5 mb-1" {...props} />
                          ),
                          p: ({ ...props }) => (
                            <p className="mb-1.5 last:mb-0 leading-relaxed" {...props} />
                          ),
                          ul: ({ ...props }) => (
                            <ul className="list-disc pl-4 space-y-1 mb-2" {...props} />
                          ),
                          ol: ({ ...props }) => (
                            <ol className="list-decimal pl-4 space-y-1 mb-2" {...props} />
                          ),
                          li: ({ ...props }) => <li className="leading-relaxed" {...props} />,
                          code: ({ className, children, ...props }) => {
                            const isInline = !className;
                            return isInline ? (
                              <code
                                className="px-1.5 py-0.5 rounded bg-black/30 font-mono text-[11px] text-purple-300 border border-white/10"
                                {...props}
                              >
                                {children}
                              </code>
                            ) : (
                              <pre className="p-3 rounded-lg bg-black/50 overflow-x-auto border border-white/10 my-2 font-mono text-[11px] text-emerald-300 leading-normal">
                                <code>{children}</code>
                              </pre>
                            );
                          },
                          strong: ({ ...props }) => (
                            <strong className="font-bold text-[var(--accent-color)]" {...props} />
                          ),
                        }}
                      >
                        {msg.text}
                      </Markdown>
                    </div>
                  )}

                  {/* Bubble Footer */}
                  <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-white/10 text-[9px]">
                    <span className={isUser ? 'text-white/70' : 'text-[var(--text-dim)]'}>
                      {msg.timestamp}
                    </span>

                    {!isUser && (
                      <button
                        onClick={() => copyMessage(msg.id, msg.text)}
                        className="opacity-60 hover:opacity-100 transition-opacity p-0.5 flex items-center gap-1 text-[var(--text-dim)] hover:text-[var(--text-main)]"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-2.5 h-2.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-2.5 h-2.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Thinking Indicator */}
          {isThinking && (
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent-color)] shrink-0">
                <Bot className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3.5 text-xs text-[var(--text-muted)] flex items-center gap-2.5 shadow-xs">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-bounce" />
                </div>
                <span>Gemini is generating response...</span>
              </div>
            </div>
          )}

          {/* Retry on Error */}
          {lastErrorPrompt && !isThinking && (
            <div className="flex justify-center pt-1">
              <button
                onClick={() => handleSend(lastErrorPrompt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-300 transition-all shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry message</span>
              </button>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Suggestion Chips */}
      {messages.length <= 2 && (
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 mb-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          {PROMPT_SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] hover:border-[var(--accent-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] shrink-0 transition-all shadow-xs"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <div className="p-3 sm:p-4 border-t border-[var(--border-color)] bg-[var(--bg-surface)] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="max-w-3xl mx-auto flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isThinking}
            placeholder="Ask Gemini AI anything (e.g. 'What is the capital of France?')..."
            className="flex-1 h-10 px-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-[var(--accent-color)] text-xs text-[var(--text-main)] placeholder-[var(--text-dim)] outline-none transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="h-10 px-4 rounded-lg bg-[var(--accent-color)] hover:opacity-90 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-sm shrink-0"
            title="Send prompt"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
