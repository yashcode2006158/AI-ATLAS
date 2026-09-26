import React, { useState, useMemo } from 'react';
import { Sparkles, Hash, Code, Layers, FileText, Info } from 'lucide-react';
import { TokenItem } from '../../types/simulation';
import { CollapsibleSection } from '../ui/Toggle';
import { DocHeading, DocParagraph, DocList, DocNote } from '../docs/Documentation';

const PASTEL_COLORS = [
  'bg-blue-500/15 border-blue-500/30 text-blue-400',
  'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
  'bg-amber-500/15 border-amber-500/30 text-amber-400',
  'bg-purple-500/15 border-purple-500/30 text-purple-400',
  'bg-pink-500/15 border-pink-500/30 text-pink-400',
  'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
  'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
  'bg-rose-500/15 border-rose-500/30 text-rose-400',
];

export const TokenizerExplorer: React.FC = () => {
  const [inputText, setInputText] = useState(
    'Retrieval-Augmented Generation (RAG) accelerates enterprise AI adoption in 2026!'
  );

  const conceptExplainer = {
    heading: 'What is a Tokenizer?',
    intro: 'A tokenizer is the component that converts raw text into numerical tokens that a language model can process. Modern tokenizers use Byte-Pair Encoding (BPE), which starts with individual characters and progressively merges the most frequent pairs into larger subword units. This balances vocabulary coverage with model efficiency.',
    keyPoints: [
      'Tokenization: Breaking text into discrete units (tokens) that the model can process.',
      'BPE Algorithm: Iteratively merges the most frequent character pairs into subword tokens.',
      'Vocabulary Size: Larger vocabularies capture more text in fewer tokens but require more model parameters.',
      'Token IDs: Each vocabulary entry has a unique numeric identifier used for embedding lookup.',
      'Byte-Level Encoding: Handles all Unicode characters, including rare ones, by encoding bytes.',
    ],
    definition: 'Key Term: Subword Token - a piece of a word (like "un" or "fore" in "unforeseen") that allows the model to handle words not in its vocabulary.',
  };

  // Simulated Byte-Pair Encoding (BPE) token breakdown
  const tokens: TokenItem[] = useMemo(() => {
    if (!inputText) return [];

    // Realistic tokenization heuristics (common subwords, punctuation, whitespace)
    const regex = /(\s+|[A-Z][a-z]+|[A-Z]+|[a-z]+|[0-9]+|[^\s\w]+)/g;
    const matches = inputText.match(regex) || [inputText];
    
    return matches.map((chunk, index) => {
      // Deterministic pseudo-random token ID based on string hash
      let hash = 0;
      for (let i = 0; i < chunk.length; i++) {
        hash = (hash << 5) - hash + chunk.charCodeAt(i);
        hash |= 0;
      }
      const tokenId = Math.abs(hash % 98000) + 1024;
      const bytes = Array.from(new TextEncoder().encode(chunk))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join(' ');

      return {
        id: tokenId,
        text: chunk,
        bytes,
        colorIndex: index % PASTEL_COLORS.length,
      };
    });
  }, [inputText]);

  const charCount = inputText.length;
  const tokenCount = tokens.length;
  const ratio = tokenCount > 0 ? (charCount / tokenCount).toFixed(2) : '0.0';

  return (
    <div className="space-y-5 text-xs">
      {/* Concept Explainer - W3Schools Style */}
      <CollapsibleSection
        title="Learn: What is a Tokenizer?"
        icon={<DocHeading level={4} className="!mt-0 !mb-0">📚</DocHeading>}
        badge="Concept"
        defaultOpen={false}
      >
        <div className="space-y-3">
          <DocHeading level={3}>{conceptExplainer.heading}</DocHeading>
          <DocParagraph>{conceptExplainer.intro}</DocParagraph>
          <DocList items={conceptExplainer.keyPoints} />
          <DocNote type="tip" title="Key Term">
            {conceptExplainer.definition}
          </DocNote>
        </div>
      </CollapsibleSection>

      {/* Top Input Bar */}
      <div className="p-4 rounded-xl bg-surface border border-hairline space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-accent" />
            Input Text for Live BPE Tokenization
          </label>
          <span className="text-[10px] font-mono text-text-secondary">
            Type anything in any language
          </span>
        </div>
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to observe byte-pair encoding boundaries..."
          className="w-full p-3 rounded-lg bg-elevated border border-hairline font-mono text-xs text-text-primary focus:outline-none focus:border-accent resize-none"
        />
      </div>

      {/* Metrics Header Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-3 rounded-xl bg-surface border border-hairline">
          <div className="text-[10px] text-text-secondary uppercase">Token Count</div>
          <div className="text-lg font-bold text-accent mt-0.5">{tokenCount}</div>
        </div>
        <div className="p-3 rounded-xl bg-surface border border-hairline">
          <div className="text-[10px] text-text-secondary uppercase">Character Count</div>
          <div className="text-lg font-bold text-text-primary mt-0.5">{charCount}</div>
        </div>
        <div className="p-3 rounded-xl bg-surface border border-hairline">
          <div className="text-[10px] text-text-secondary uppercase">Chars / Token Ratio</div>
          <div className="text-lg font-bold text-success mt-0.5">{ratio}</div>
        </div>
        <div className="p-3 rounded-xl bg-surface border border-hairline">
          <div className="text-[10px] text-text-secondary uppercase">Encoding Scheme</div>
          <div className="text-lg font-bold text-warning mt-0.5">cl100k_base</div>
        </div>
      </div>

      {/* Visual Token Boundaries Console */}
      <div className="p-5 rounded-xl bg-surface border border-hairline space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-hairline">
          <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            Segmented Token Badges (Hover to Inspect Token ID)
          </span>
          <span className="text-[10px] font-mono text-text-secondary">
            Leading spaces indicated with ␣
          </span>
        </div>

        <div className="min-h-[90px] p-3 rounded-lg bg-elevated/40 border border-hairline flex flex-wrap gap-1.5 items-center leading-loose">
          {tokens.map((token, idx) => (
            <span
              key={idx}
              className={`px-2 py-1 rounded-md border font-mono text-xs cursor-pointer transition-all hover:scale-105 hover:shadow-sm ${
                PASTEL_COLORS[token.colorIndex]
              }`}
              title={`Token #${idx + 1} | ID: ${token.id} | Bytes: ${token.bytes}`}
            >
              {token.text.replace(/ /g, '␣')}
            </span>
          ))}
        </div>
      </div>

      {/* Detailed Token Matrix Breakdown Table */}
      <div className="p-5 rounded-xl bg-surface border border-hairline space-y-3">
        <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5 text-accent" />
          Token ID & Latent Embedding Vector Preview
        </span>

        <div className="max-h-64 overflow-y-auto border border-hairline rounded-lg overflow-hidden">
          <table className="w-full text-left font-mono text-[11px]">
            <thead className="bg-elevated text-text-secondary border-b border-hairline sticky top-0">
              <tr>
                <th className="p-2.5">Idx</th>
                <th className="p-2.5">String Chunk</th>
                <th className="p-2.5">Token ID</th>
                <th className="p-2.5">Hex Bytes</th>
                <th className="p-2.5">8D Latent Slice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {tokens.map((token, i) => (
                <tr key={i} className="hover:bg-elevated/40 transition-colors">
                  <td className="p-2.5 text-text-secondary">#{i + 1}</td>
                  <td className="p-2.5 font-bold text-text-primary">
                    {token.text.replace(/ /g, '␣')}
                  </td>
                  <td className="p-2.5 text-accent font-semibold">{token.id}</td>
                  <td className="p-2.5 text-text-secondary">{token.bytes}</td>
                  <td className="p-2.5 text-success">
                    [{((token.id % 97) / 100).toFixed(2)}, {(-((token.id % 83) / 100)).toFixed(2)}, 0.42, ...]
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
