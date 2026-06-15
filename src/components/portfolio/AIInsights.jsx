import React, { useState } from "react";
import { Brain, RefreshCw, Sparkles } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import { Button } from "../ui/button";
import { base44 } from "@/api/base44Client";

export default function AIInsights({ portfolio, onInsightsUpdate }) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(portfolio.aiInsights || null);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const prompt = `Analyze this cryptocurrency portfolio and provide diversification insights:
      
Total Value: $${portfolio.totalValue}
Asset Categories: ${JSON.stringify(portfolio.allocation)}
Number of Assets: ${portfolio.assets?.length}

Assets:
${portfolio.assets?.map(a => `- ${a.name} (${a.symbol}): $${a.valueUSD} in ${a.category}`).join('\n')}

Provide:
1. Diversification score (1-10)
2. Risk assessment
3. 3 specific recommendations to improve portfolio balance
4. Opportunities in underrepresented categories

Keep response concise and actionable.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: false
      });

      setInsights(result);
      if (onInsightsUpdate) {
        onInsightsUpdate(result);
      }
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-transparent">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-violet-400">AI Portfolio Insights</h3>
            <p className="text-xs text-white/40">Powered by advanced analytics</p>
          </div>
        </div>
        <Button
          onClick={generateInsights}
          disabled={loading}
          size="sm"
          className="bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 border-violet-500/30"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate
            </>
          )}
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 text-violet-400 animate-spin" />
            <p className="text-sm text-white/50">Analyzing your portfolio...</p>
          </div>
        </div>
      )}

      {!loading && insights && (
        <div className="prose prose-sm prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-white/70 leading-relaxed">
            {insights}
          </div>
        </div>
      )}

      {!loading && !insights && (
        <div className="text-center py-8">
          <p className="text-white/50 mb-4">
            Get AI-powered insights on your portfolio diversification and risk profile
          </p>
          <Button
            onClick={generateInsights}
            className="bg-gradient-to-r from-violet-500 to-purple-500 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Insights
          </Button>
        </div>
      )}
    </GlassCard>
  );
}