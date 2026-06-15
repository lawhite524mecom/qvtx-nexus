import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Maximize2,
  Sparkles,
  Loader2
} from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function UniversalAssistant({ 
  context = "general", 
  userData = {},
  initialMinimized = true 
}) {
  const [isOpen, setIsOpen] = useState(!initialMinimized);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: getContextualGreeting(context)
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function getContextualGreeting(ctx) {
    const greetings = {
      wallet: "👋 Hi! I'm your wallet assistant. I can help you understand your balances, execute swaps, or answer questions about transactions.",
      portfolio: "📊 Hello! I'm here to help analyze your portfolio, explain asset allocations, and provide insights on your investments.",
      staking: "💎 Welcome! I can help you with staking rewards, APY calculations, and guide you through the staking process.",
      general: "✨ Hi! I'm your QVTX AI assistant. Ask me anything about your assets, DeFi features, or how to use the platform."
    };
    return greetings[ctx] || greetings.general;
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      // Build context for AI
      const contextInfo = buildContextInfo(context, userData);
      
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a helpful QVTX DeFi assistant. 
        
Context: ${context} page
User Data: ${JSON.stringify(contextInfo, null, 2)}

User Question: ${userMessage}

Provide a helpful, concise response. If asked about specific balances or data, reference the user data provided. Keep responses under 150 words unless more detail is requested.`,
        add_context_from_internet: false
      });

      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: response 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I apologize, I'm having trouble processing your request right now. Please try again." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  function buildContextInfo(ctx, data) {
    const info = { context: ctx };
    
    if (ctx === "wallet") {
      info.balances = data.balances;
      info.totalValue = data.totalValue;
      info.connectedAddress = data.address;
    } else if (ctx === "portfolio") {
      info.assets = data.assets;
      info.totalValue = data.totalValue;
      info.allocation = data.allocation;
    } else if (ctx === "staking") {
      info.stakedBalance = data.stakedBalance;
      info.pendingRewards = data.pendingRewards;
      info.apy = data.apy;
    }
    
    return info;
  }

  const quickPrompts = getQuickPrompts(context);

  function getQuickPrompts(ctx) {
    const prompts = {
      wallet: [
        "What's my total balance?",
        "How do I swap tokens?",
        "Explain gas fees"
      ],
      portfolio: [
        "Analyze my portfolio",
        "Diversification tips",
        "Risk assessment"
      ],
      staking: [
        "How much will I earn?",
        "When can I unstake?",
        "Explain APY"
      ],
      general: [
        "What is QVTX?",
        "How to get started?",
        "Supported networks"
      ]
    };
    return prompts[ctx] || prompts.general;
  }

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all flex items-center justify-center group z-50"
      >
        <MessageCircle className="w-6 h-6 text-black group-hover:scale-110 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        height: isMinimized ? "60px" : "600px"
      }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 w-96 bg-[#0d0e16] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Assistant</h3>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white/50">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-white/60" />
            ) : (
              <Minimize2 className="w-4 h-4 text-white/60" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <div className="h-[420px] overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-black"
                      : "bg-white/5 border border-white/10 text-white"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5">
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length === 1 && (
            <div className="px-4 pb-3">
              <p className="text-xs text-white/40 mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(prompt);
                      setTimeout(() => inputRef.current?.focus(), 0);
                    }}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-white/5">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}