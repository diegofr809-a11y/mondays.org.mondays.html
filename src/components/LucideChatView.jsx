import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Hash, Users } from 'lucide-react';

const DEFAULT_MESSAGES = {
  general: [
    {
      id: '1',
      user: 'Vortex',
      avatarColor: 'bg-purple-600',
      text: 'Welcome to the Lucide community hub! Clean, private, and unblocked.',
      time: '12:40 PM',
    },
    {
      id: '2',
      user: 'ShadowByte',
      avatarColor: 'bg-emerald-600',
      text: 'Anyone got good HTML5 game links to add to the custom library?',
      time: '12:42 PM',
    },
    {
      id: '3',
      user: 'GhostRider',
      avatarColor: 'bg-blue-600',
      text: 'The cloak popout works smoothly on school chromebooks 👍',
      time: '12:45 PM',
    },
  ],
  gaming: [
    {
      id: 'g1',
      user: 'PixelKnight',
      avatarColor: 'bg-amber-600',
      text: 'What games are you guys testing right now?',
      time: '11:15 AM',
    },
    {
      id: 'g2',
      user: 'Speedy',
      avatarColor: 'bg-rose-600',
      text: 'Added Drift Hunters and Retro Bowl to my custom slots!',
      time: '11:20 AM',
    },
  ],
  music: [
    {
      id: 'm1',
      user: 'BeatsWave',
      avatarColor: 'bg-cyan-600',
      text: 'The Spotify shortcut on the sidebar is super convenient during study sessions.',
      time: '10:05 AM',
    },
  ],
};

export const LucideChatView = () => {
  const [currentChannel, setCurrentChannel] = useState('general');
  const [allMessages, setAllMessages] = useState(DEFAULT_MESSAGES);
  const [input, setInput] = useState('');
  const chatBottomRef = useRef(null);

  const messages = allMessages[currentChannel] || [];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentChannel]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      user: 'You (Guest)',
      avatarColor: 'bg-purple-500',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAllMessages((prev) => ({
      ...prev,
      [currentChannel]: [...(prev[currentChannel] || []), newMsg],
    }));
    setInput('');
  };

  return (
    <div className="flex-1 h-screen flex lucide-bg select-none">
      {/* Channels Sidebar */}
      <div className="w-48 bg-[#090712]/80 border-r border-[#1c172e] flex flex-col p-3 space-y-3">
        <div className="flex items-center gap-2 px-1 text-xs font-bold text-white uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
          <span>Channels</span>
        </div>

        <div className="space-y-1">
          {['general', 'gaming', 'music'].map((channel) => (
            <button
              key={channel}
              onClick={() => setCurrentChannel(channel)}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all text-left ${
                currentChannel === channel
                  ? 'bg-[#1e1738] text-purple-300 border border-[#2f245c]'
                  : 'text-[#847e9e] hover:text-white hover:bg-[#130f24]'
              }`}
            >
              <Hash className="w-3.5 h-3.5 text-[#676182]" />
              <span className="capitalize">{channel}</span>
            </button>
          ))}
        </div>

        <div className="pt-3 border-t border-[#1a152b] text-[10px] text-[#635d7c] space-y-1">
          <div className="flex items-center gap-1 font-semibold text-[#8a84a6]">
            <Users className="w-3 h-3 text-emerald-400" />
            <span>179 Online</span>
          </div>
          <p>School-safe, client-side community chatter.</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Channel Bar */}
        <div className="px-6 py-3 border-b border-[#1c172e] flex items-center justify-between bg-[#090712]/60">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white capitalize">{currentChannel} Channel</h3>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3 group">
              <div
                className={`w-7 h-7 rounded-md ${msg.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}
              >
                {msg.user.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{msg.user}</span>
                  <span className="text-[10px] text-[#625c7c]">{msg.time}</span>
                </div>
                <p className="text-xs text-[#cfcbdc] mt-0.5 leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Composer */}
        <div className="p-4 border-t border-[#1c172e] bg-[#090712]/70">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message #${currentChannel}...`}
              className="flex-1 h-10 pl-3.5 pr-3 bg-[#110e20] hover:bg-[#141026] focus:bg-[#16122b] border border-[#231d3b] focus:border-purple-500/60 rounded-lg text-xs text-white placeholder-[#5c5576] outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="h-10 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-purple-950/40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
