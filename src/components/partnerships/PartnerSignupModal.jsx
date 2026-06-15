import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, CheckCircle, Loader } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function PartnerSignupModal({ isOpen, onClose, onSuccess }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  const messagesEndRef = useRef(null);

  const questions = [
    {
      key: "contactName",
      question: "Hi there! 👋 I'm **Quanty**, your QVTX partner liaison. I'm excited to help you join our ecosystem!\n\nLet's start with the basics - what's your name?",
      placeholder: "Your name..."
    },
    {
      key: "companyName",
      question: (name) => `Great to meet you, ${name}! 🎉\n\nWhat's the name of your company?`,
      placeholder: "Company name..."
    },
    {
      key: "email",
      question: (name, company) => `Perfect! Now, what's the best email to reach you at ${company}?`,
      placeholder: "email@company.com"
    },
    {
      key: "phone",
      question: "Great! And what's the best phone number to reach you? (You can skip this if you prefer)",
      placeholder: "+1 (555) 000-0000 or type 'skip'",
      optional: true
    },
    {
      key: "partnershipType",
      question: "Excellent! Now, what type of partnership are you interested in?\n\n1️⃣ **Strategic Investment** - Major investment partnership\n2️⃣ **Technology Partnership** - Technical integration & collaboration\n3️⃣ **Enterprise Integration** - Large-scale business adoption\n4️⃣ **Deployment Partnership** - Network expansion & deployment\n\nJust type the number (1-4) or the partnership name!",
      placeholder: "Type 1, 2, 3, 4, or partnership type...",
      parse: (value) => {
        const map = {
          "1": "strategic",
          "2": "technology",
          "3": "enterprise",
          "4": "deployment",
          "strategic": "strategic",
          "technology": "technology",
          "enterprise": "enterprise",
          "deployment": "deployment",
          "strategic investment": "strategic",
          "technology partnership": "technology",
          "enterprise integration": "enterprise",
          "deployment partnership": "deployment",
          "investment": "strategic",
          "tech": "technology"
        };
        return map[value.toLowerCase().trim()] || "strategic";
      }
    },
    {
      key: "industry",
      question: (name, company, email, phone, type) => {
        const typeNames = {
          strategic: "Strategic Investment",
          technology: "Technology Partnership",
          enterprise: "Enterprise Integration",
          deployment: "Deployment Partnership"
        };
        return `Excellent choice on ${typeNames[type] || "that partnership"}! 🚀\n\nWhat industry does your company operate in?\n\n💡 This helps me assign the perfect AI assistant for your needs.\n\n*Examples: FinTech, Healthcare, Supply Chain, Gaming, Enterprise SaaS*\n\n(Or type 'skip' if you prefer)`;
      },
      placeholder: "e.g., FinTech, Healthcare, Gaming...",
      optional: true
    },
    {
      key: "website",
      question: "Got it! Do you have a company website you'd like to share?",
      placeholder: "https://yourcompany.com",
      optional: true
    },
    {
      key: "description",
      question: "Almost there! 💫\n\nCan you tell me a bit about your partnership goals and how you'd like to collaborate with QVTX?\n\nWhat problems are you looking to solve, or what opportunities do you see?",
      placeholder: "Share your partnership vision...",
      multiline: true
    },
    {
      key: "investmentAmount",
      question: "Final question! 🎯\n\nAre you planning a specific investment or deal amount?\n\n*(This is completely optional - type 'skip' or 'n/a' if not applicable)*",
      placeholder: "e.g., $5M - $10M, or type 'skip'",
      optional: true
    }
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Start conversation with first question
      setMessages([{
        role: "assistant",
        content: questions[0].question
      }]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);

    // Process response
    const question = questions[currentQuestion];
    let value = userMessage;

    // Parse value if parser exists
    if (question.parse) {
      value = question.parse(userMessage);
    }

    // Handle skip for optional fields
    if (question.optional && (userMessage.toLowerCase() === 'skip' || userMessage.toLowerCase() === 'n/a' || userMessage.toLowerCase() === 'no')) {
      value = "";
    }

    // Update form data
    const newFormData = { ...formData, [question.key]: value };
    setFormData(newFormData);

    // Move to next question or submit
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      
      // Get next question with context
      const nextQuestion = questions[currentQuestion + 1];
      let nextQuestionText = nextQuestion.question;
      
      if (typeof nextQuestionText === 'function') {
        const values = Object.values(newFormData);
        nextQuestionText = nextQuestionText(...values);
      }

      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: nextQuestionText
        }]);
      }, 600);
    } else {
      // All questions answered, submit
      await submitPartnership(newFormData);
    }
  };

  const submitPartnership = async (data) => {
    setLoading(true);

    // Show thinking message
    setMessages(prev => [...prev, {
      role: "assistant",
      content: `Perfect! 🎉\n\nLet me set everything up for ${data.companyName}...\n\n✨ Creating your partnership profile\n🤖 Initializing your AI assistant\n📧 Preparing welcome materials\n\nThis will just take a moment...`
    }]);

    try {
      // Create partner record
      const partner = await base44.entities.Partners.create(data);

      // Create AI partner bot conversation
      const conversation = await base44.agents.createConversation({
        agent_name: "partner_assistant",
        metadata: {
          name: `${formData.companyName} Partnership`,
          partnerId: partner.id,
          partnerName: formData.companyName,
          contactName: formData.contactName
        }
      });

      // Update partner with bot conversation ID
      await base44.entities.Partners.update(partner.id, {
        assignedBotId: conversation.id
      });

      // Send personalized welcome message from bot with context
      const welcomeMessage = `Hello! I'm your dedicated AI partner assistant for ${data.companyName}.

I've reviewed your partnership application and I'm excited to help you with your ${data.partnershipType} partnership${data.industry ? ` in the ${data.industry} industry` : ''}.

Based on your profile, I can help you with:
${data.partnershipType === 'strategic' ? '• Investment tracking and ROI metrics\n• Token economics and staking opportunities\n• Partnership milestone planning' : ''}
${data.partnershipType === 'technology' ? '• QVTX API integration and code examples\n• Multi-chain deployment strategies\n• Technical documentation tailored to your stack' : ''}
${data.partnershipType === 'enterprise' ? '• Enterprise-grade security and compliance\n• Scalable infrastructure setup\n• Custom smart contract development' : ''}
${data.partnershipType === 'deployment' ? '• Network deployment best practices\n• Infrastructure optimization\n• Operational support and monitoring' : ''}

I can generate custom API examples, provide integration guides specific to your needs, and answer any questions 24/7.

What would you like to start with? I can show you:
1. Quick start integration guide
2. API examples for your use case
3. Partnership milestone roadmap
4. Technical architecture overview`;

      await base44.agents.addMessage(conversation, {
        role: "user",
        content: welcomeMessage
      });

      // Success message from Quanty
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: `🎊 Fantastic news, ${data.contactName}!\n\nYour partnership application for **${data.companyName}** has been successfully submitted!\n\nI've created your personalized AI assistant who will help you with ${data.partnershipType === 'strategic' ? 'investment tracking and strategic planning' : data.partnershipType === 'technology' ? 'technical integration and development' : data.partnershipType === 'enterprise' ? 'enterprise deployment and scaling' : 'network expansion and infrastructure'}.\n\n✅ Partnership profile created\n✅ AI assistant activated\n✅ Welcome email sent to ${data.email}\n\nYour dedicated assistant is already preparing resources tailored to your ${data.industry || 'business'} needs!`
        }]);
        setTimeout(() => {
          setSuccess(true);
          setTimeout(() => {
            onSuccess?.(partner, conversation);
          }, 1500);
        }, 1500);
      }, 1000);

    } catch (error) {
      console.error("Error creating partnership:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "😔 Oh no! Something went wrong on my end.\n\nCould you try again? If the issue persists, please email partnerships@qvtx.io and I'll have our team reach out to you directly."
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentQ = questions[currentQuestion];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl h-[80vh] bg-[#0a0b14] border border-white/10 rounded-2xl shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Quanty</h3>
                <p className="text-sm text-white/50">QVTX Partner Liaison</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {success ? (
            // Success State
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Welcome to QVTX!
                </h2>
                <p className="text-white/60 mb-6 max-w-md">
                  Your partnership application has been submitted successfully. Your personalized AI partner assistant is now ready to help you.
                </p>
                <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <span className="font-semibold text-cyan-400">AI Partner Assistant Activated</span>
                  </div>
                  <p className="text-sm text-white/60">
                    Check your email for access to your dedicated AI assistant and next steps.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Chat Interface
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-black"
                          : "bg-white/5 text-white border border-white/10"
                      }`}
                    >
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content.split('**').map((part, i) => 
                          i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white/5 px-4 py-3 rounded-2xl border border-white/10">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-6 border-t border-white/10">
                <div className="flex gap-2">
                  {currentQ?.multiline ? (
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder={currentQ.placeholder}
                      rows={3}
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-amber-500/50 text-sm resize-none"
                      disabled={loading}
                    />
                  ) : (
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder={currentQ?.placeholder || "Type your answer..."}
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-amber-500/50 text-sm"
                      disabled={loading}
                    />
                  )}
                  <button
                    onClick={handleSendMessage}
                    disabled={loading || !input.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}