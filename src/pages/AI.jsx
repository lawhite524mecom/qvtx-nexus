import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  MessageSquare,
  Shield,
  Sparkles,
  Send,
  User,
  Bot,
  RefreshCw,
  BarChart3,
  AlertCircle
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import StatCard from "../components/ui/StatCard";
import { base44 } from "@/api/base44Client";

export default function AI() {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your QVTX AI assistant. I can help with trading analysis, portfolio insights, market predictions, and smart contract audits. What would you like to know?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzingPortfolio, setAnalyzingPortfolio] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [auditingContract, setAuditingContract] = useState(false);
  const [contractAddress, setContractAddress] = useState("");

  const aiFeatures = [
    {
      id: "chat",
      title: "AI Assistant",
      description: "Chat with AI for trading advice and market insights",
      icon: MessageSquare,
      color: "from-cyan-500 to-blue-500"
    },
    {
      id: "portfolio",
      title: "Portfolio Analyzer",
      description: "Get AI-powered portfolio optimization suggestions",
      icon: BarChart3,
      color: "from-emerald-500 to-teal-500"
    },
    {
      id: "predictions",
      title: "Market Predictions",
      description: "AI-driven price predictions and trend analysis",
      icon: TrendingUp,
      color: "from-violet-500 to-purple-500"
    },
    {
      id: "audit",
      title: "Contract Auditor",
      description: "Automated smart contract security analysis",
      icon: Shield,
      color: "from-amber-500 to-orange-500"
    }
  ];

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages([...messages, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a cryptocurrency trading and DeFi expert assistant for QVTX ecosystem. Provide helpful, accurate, and concise advice about trading, staking, DeFi strategies, and market analysis. User question: ${userMessage}`,
        add_context_from_internet: true
      });

      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const analyzePortfolio = async () => {
    setAnalyzingPortfolio(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze a crypto portfolio containing QVTX tokens across multiple chains (QVTX Chain, Polygon, BSC, Base). Provide optimization suggestions, risk assessment, and diversification recommendations. Format as JSON.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            risk_score: { type: "number" },
            risk_level: { type: "string" },
            diversification_score: { type: "number" },
            recommendations: {
              type: "array",
              items: { type: "string" }
            },
            opportunities: {
              type: "array",
              items: { type: "string" }
            },
            warnings: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setAnalysisResult(response);
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyzingPortfolio(false);
    }
  };

  const auditContract = async () => {
    if (!contractAddress.trim()) return;

    setAuditingContract(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Perform a security audit on smart contract at address ${contractAddress}. Analyze for common vulnerabilities like reentrancy, overflow/underflow, access control issues, and gas optimization. Provide a security score and detailed findings. Format as JSON.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            security_score: { type: "number" },
            risk_level: { type: "string" },
            vulnerabilities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  severity: { type: "string" },
                  issue: { type: "string" },
                  recommendation: { type: "string" }
                }
              }
            },
            gas_optimization: {
              type: "array",
              items: { type: "string" }
            },
            best_practices: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setAuditResult(response);
    } catch (error) {
      console.error(error);
    } finally {
      setAuditingContract(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
              QVTX AI
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            Advanced AI-powered tools for trading, analysis, and portfolio management
          </motion.p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <StatCard
            title="Analysis Today"
            value="1.2K"
            icon={BarChart3}
            accentColor="emerald"
            gradient="from-emerald-500/10 to-emerald-500/5"
          />
          <StatCard
            title="Predictions"
            value="89%"
            subtitle="Accuracy"
            icon={TrendingUp}
            accentColor="violet"
            gradient="from-violet-500/10 to-violet-500/5"
          />
          <StatCard
            title="Audits Run"
            value="856"
            icon={Shield}
            accentColor="amber"
            gradient="from-amber-500/10 to-amber-500/5"
          />
        </div>

        {/* Feature Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {aiFeatures.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setActiveTab(feature.id)}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === feature.id
                  ? `bg-gradient-to-r ${feature.color} text-black`
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <feature.icon className="w-4 h-4" />
              {feature.title}
            </button>
          ))}
        </div>

        {/* AI Assistant Chat */}
        {activeTab === "chat" && (
          <GlassCard>
            <div className="h-[500px] sm:h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2 sm:p-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                     className={`max-w-[85%] sm:max-w-[80%] px-3 sm:px-4 py-2 sm:py-3 rounded-xl ${
                       msg.role === "user"
                         ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-black"
                         : "bg-white/5 text-white"
                     }`}
                    >
                     <p className="text-xs sm:text-sm leading-relaxed">{msg.content}</p>
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white/5 px-4 py-3 rounded-xl">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 px-2 sm:px-0">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask about trading, DeFi..."
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/50 text-sm"
                  disabled={loading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading || !input.trim()}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Portfolio Analyzer */}
        {activeTab === "portfolio" && (
          <GlassCard>
            <div className="text-center py-8">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
              <h3 className="text-xl font-bold mb-2">AI Portfolio Analysis</h3>
              <p className="text-white/50 mb-6 max-w-md mx-auto">
                Get personalized recommendations to optimize your portfolio and reduce risk
              </p>
              
              <button
                onClick={analyzePortfolio}
                disabled={analyzingPortfolio}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                {analyzingPortfolio ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze My Portfolio
                  </>
                )}
              </button>

              {analysisResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 text-left space-y-4"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-sm text-white/50 mb-1">Risk Score</p>
                      <p className="text-2xl font-bold text-cyan-400">
                        {analysisResult.risk_score}/10
                      </p>
                      <p className="text-sm text-white/60 mt-1">{analysisResult.risk_level}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-sm text-white/50 mb-1">Diversification</p>
                      <p className="text-2xl font-bold text-emerald-400">
                        {analysisResult.diversification_score}/10
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <h4 className="font-semibold mb-2 text-emerald-400">Recommendations</h4>
                    <ul className="space-y-2 text-sm">
                      {analysisResult.recommendations?.map((rec, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-emerald-400">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {analysisResult.warnings?.length > 0 && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                      <h4 className="font-semibold mb-2 text-amber-400">Warnings</h4>
                      <ul className="space-y-2 text-sm">
                        {analysisResult.warnings.map((warn, idx) => (
                          <li key={idx} className="flex gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                            <span>{warn}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </GlassCard>
        )}

        {/* Market Predictions */}
        {activeTab === "predictions" && (
          <GlassCard>
            <div className="text-center py-8">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-violet-400" />
              <h3 className="text-xl font-bold mb-2">AI Market Predictions</h3>
              <p className="text-white/50 mb-6 max-w-md mx-auto">
                Coming soon: Real-time market predictions and trend analysis powered by advanced AI models
              </p>
              <div className="max-w-md mx-auto space-y-3">
                <div className="p-4 bg-white/5 rounded-xl flex justify-between items-center">
                  <span>QVTX/USD</span>
                  <span className="text-emerald-400">↑ Bullish</span>
                </div>
                <div className="p-4 bg-white/5 rounded-xl flex justify-between items-center">
                  <span>24h Prediction</span>
                  <span className="text-cyan-400">$5.45 - $5.67</span>
                </div>
                <div className="p-4 bg-white/5 rounded-xl flex justify-between items-center">
                  <span>Confidence</span>
                  <span className="text-violet-400">89%</span>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Smart Contract Auditor */}
        {activeTab === "audit" && (
          <GlassCard>
            <div className="py-8">
              <div className="text-center mb-8">
                <Shield className="w-16 h-16 mx-auto mb-4 text-amber-400" />
                <h3 className="text-xl font-bold mb-2">AI Contract Auditor</h3>
                <p className="text-white/50 max-w-md mx-auto">
                  Automated security analysis for smart contracts
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-4">
                <div>
                  <label className="text-sm text-white/60 mb-2 block">
                    Contract Address
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={contractAddress}
                      onChange={(e) => setContractAddress(e.target.value)}
                      placeholder="0x..."
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-amber-500/50 font-mono text-sm"
                    />
                    <button
                      onClick={auditContract}
                      disabled={auditingContract || !contractAddress.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {auditingContract ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Auditing...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          Audit
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {auditResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold">Security Score</h4>
                        <span className={`text-2xl font-bold ${
                          auditResult.security_score >= 80 ? "text-emerald-400" :
                          auditResult.security_score >= 60 ? "text-amber-400" : "text-rose-400"
                        }`}>
                          {auditResult.security_score}/100
                        </span>
                      </div>
                      <p className={`text-sm ${
                        auditResult.risk_level === "Low" ? "text-emerald-400" :
                        auditResult.risk_level === "Medium" ? "text-amber-400" : "text-rose-400"
                      }`}>
                        {auditResult.risk_level} Risk
                      </p>
                    </div>

                    {auditResult.vulnerabilities?.length > 0 && (
                      <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                        <h4 className="font-semibold mb-3 text-rose-400">Vulnerabilities Found</h4>
                        <div className="space-y-3">
                          {auditResult.vulnerabilities.map((vuln, idx) => (
                            <div key={idx} className="p-3 bg-white/5 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  vuln.severity === "High" ? "bg-rose-500/20 text-rose-400" :
                                  vuln.severity === "Medium" ? "bg-amber-500/20 text-amber-400" :
                                  "bg-cyan-500/20 text-cyan-400"
                                }`}>
                                  {vuln.severity}
                                </span>
                                <span className="text-sm font-medium">{vuln.issue}</span>
                              </div>
                              <p className="text-xs text-white/60 mt-1">{vuln.recommendation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {auditResult.gas_optimization?.length > 0 && (
                      <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                        <h4 className="font-semibold mb-2 text-cyan-400">Gas Optimization</h4>
                        <ul className="space-y-1 text-sm">
                          {auditResult.gas_optimization.map((opt, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-cyan-400">•</span>
                              <span>{opt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}