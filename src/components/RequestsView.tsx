import React, { useState } from 'react';
import { GameRequest } from '../types';
import {
  MessageSquarePlus,
  ThumbsUp,
  Clock,
  CheckCircle2,
  Plus,
  Search,
} from 'lucide-react';

interface RequestsViewProps {
  requests: GameRequest[];
  onSubmitRequest: (req: GameRequest) => void;
  onVoteRequest: (reqId: string) => void;
  initialTitle?: string;
}

export const RequestsView: React.FC<RequestsViewProps> = ({
  requests,
  onSubmitRequest,
  onVoteRequest,
  initialTitle = '',
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [category, setCategory] = useState('Action');
  const [searchFilter, setSearchFilter] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newReq: GameRequest = {
      id: `req-${Date.now()}`,
      title: title.trim(),
      category,
      votes: 1,
      requestedAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    onSubmitRequest(newReq);
    setTitle('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const filteredRequests = requests.filter(
    (r) =>
      r.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-3 max-w-4xl mx-auto select-none text-xs" id="requests-view-page">
      {/* Top Banner & Submission Box */}
      <div className="bg-[#111319] border border-[#222733] rounded-xs p-3">
        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#1f2430]">
          <div>
            <h2 className="text-sm font-extrabold text-white tracking-tight uppercase">
              Game Wishlist & Requests
            </h2>
            <p className="text-[11px] text-[#6b7994] mt-0.5">
              Vote on requested titles or submit a new game for the unblocked library
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#161a22] text-emerald-400 border border-emerald-500/20">
            {requests.length} Requests
          </span>
        </div>

        {/* Fast Request Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Game title (e.g. Retro Bowl, Run 3, Slope)..."
            className="flex-1 px-3 py-1.5 bg-[#0e1016] text-white placeholder-[#556075] text-xs rounded-xs border border-[#242b3a] focus:outline-none focus:border-emerald-500/60"
            required
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-[#0e1016] text-[#cbd5e1] text-xs rounded-xs border border-[#242b3a] focus:outline-none focus:border-emerald-500/60"
          >
            <option value="Action">Action</option>
            <option value="Arcade">Arcade</option>
            <option value="Puzzle">Puzzle</option>
            <option value="Sports">Sports</option>
            <option value="Racing">Racing</option>
            <option value="Other">Other</option>
          </select>

          <button
            type="submit"
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xs transition-colors flex items-center justify-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Submit Request</span>
          </button>
        </form>

        {submitted && (
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Request recorded! Users can now upvote your submission.</span>
          </div>
        )}
      </div>

      {/* Requests Filter & List */}
      <div className="bg-[#111319] border border-[#222733] rounded-xs p-3">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[10px] font-bold text-[#556075] uppercase tracking-wider">
            Community Upvoted List
          </span>

          <div className="relative w-48">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#556075]" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter requests..."
              className="w-full pl-6 pr-2 py-1 bg-[#0e1016] text-white placeholder-[#556075] text-[11px] rounded-xs border border-[#222733] focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        <div className="divide-y divide-[#1c212c]">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="py-2 flex items-center justify-between gap-3 hover:bg-[#151922] px-1 rounded-xs transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onVoteRequest(req.id)}
                  className="flex items-center gap-1 px-2 py-1 bg-[#161a24] hover:bg-emerald-500/20 text-[#8592a8] hover:text-emerald-400 border border-[#222836] hover:border-emerald-500/40 rounded-xs font-mono text-xs font-bold transition-colors"
                  title="Upvote"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>{req.votes}</span>
                </button>

                <div>
                  <h4 className="text-xs font-bold text-white">{req.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-[#556075] mt-0.5">
                    <span className="text-emerald-400/80 font-semibold">{req.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {req.requestedAt}
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-xs border ${
                  req.status === 'planned'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : req.status === 'in-review'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-[#181c26] text-[#8592a8] border-[#252b3b]'
                }`}
              >
                {req.status}
              </span>
            </div>
          ))}

          {filteredRequests.length === 0 && (
            <div className="py-6 text-center text-xs text-[#556075]">
              No game requests match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
