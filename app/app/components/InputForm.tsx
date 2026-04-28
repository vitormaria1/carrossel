'use client';

import { useCarouselStore } from '@/lib/store';
import { DocumentUpload } from './DocumentUpload';
import { InputFormSkeleton } from './LoadingSkeleton';
import { useState } from 'react';

interface InputFormProps {
  onGenerate: () => void;
  isLoading: boolean;
}

const CAROUSEL_TYPES = [
  { value: 'auto', label: '🎯 Detectar Automaticamente', desc: 'Claude escolhe o melhor tipo' },
  { value: 'transformacao', label: '🚀 Transformação', desc: 'Jornada de mudança e resultado' },
  { value: 'autoridade', label: '🏆 Autoridade', desc: 'Expertise e conhecimento profundo' },
  { value: 'ideologico', label: '💡 Ideológico', desc: 'Visão e princípios' },
  { value: 'educacional', label: '📚 Educacional', desc: 'Aprender conceitos e técnicas' },
  { value: 'vendas', label: '💰 Vendas', desc: 'Problema → Solução → Ação' },
];

export function InputForm({ onGenerate, isLoading }: InputFormProps) {
  const { idea, setIdea, prompt, setPrompt, totalCards, setTotalCards, carouselType, setCarouselType } = useCarouselStore();
  const [error, setError] = useState<string>('');

  // 🟡 Mostrar skeleton enquanto gera
  if (isLoading) {
    return <InputFormSkeleton />;
  }

  const MAX_IDEA_LENGTH = 2000;
  const MAX_PROMPT_LENGTH = 500;
  const MIN_IDEA_LENGTH = 20;

  const validateInputs = (): boolean => {
    if (!idea.trim()) {
      setError('Por favor, insira uma ideia');
      return false;
    }
    if (idea.length < MIN_IDEA_LENGTH) {
      setError(`A ideia precisa ter pelo menos ${MIN_IDEA_LENGTH} caracteres`);
      return false;
    }
    if (totalCards < 3 || totalCards > 20) {
      setError('Selecione entre 3 e 20 cards');
      return false;
    }
    setError('');
    return true;
  };

  const handleGenerate = () => {
    if (validateInputs()) {
      onGenerate();
    }
  };

  const handleIdeaChange = (text: string) => {
    if (text.length <= MAX_IDEA_LENGTH) {
      setIdea(text);
      setError('');
    }
  };

  const ideaPercentage = Math.round((idea.length / MAX_IDEA_LENGTH) * 100);

  return (
    <div className="space-y-4">
      <DocumentUpload />

      <div className="border-t border-gray-200 pt-4"></div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800 animate-pulse">
          ⚠️ {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">
          📋 Tipo de Carrossel
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CAROUSEL_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setCarouselType(type.value as any)}
              className={`p-3 rounded-lg border-2 transition text-left ${
                carouselType === type.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-sm">{type.label}</div>
              <div className="text-xs text-gray-600">{type.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
          💡 Sua Ideia <span className="text-red-600">*</span>
        </label>
        <textarea
          value={idea}
          onChange={(e) => handleIdeaChange(e.target.value)}
          placeholder="Cole aqui o conceito, artigo ou ideia que quer transformar em carrossel..."
          maxLength={MAX_IDEA_LENGTH}
          className={`w-full p-4 border rounded-lg resize-none h-24 text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-white transition ${
            error && !idea ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-600'
          }`}
        />
        <div className="flex justify-between items-center mt-2">
          <p className={`text-xs ${idea.length < MIN_IDEA_LENGTH ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
            {idea.length}/{MAX_IDEA_LENGTH} caracteres
            {idea.length < MIN_IDEA_LENGTH && ` (mínimo ${MIN_IDEA_LENGTH})`}
          </p>
          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${ideaPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
          ✨ Customize (opcional)
        </label>
        <textarea
          value={prompt}
          onChange={(e) => {
            if (e.target.value.length <= MAX_PROMPT_LENGTH) {
              setPrompt(e.target.value);
            }
          }}
          placeholder="Ex: Tom mais agressivo | Foco em vendas | Narrativa educacional"
          maxLength={MAX_PROMPT_LENGTH}
          className="w-full p-4 border border-gray-300 rounded-lg resize-none h-16 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white transition"
        />
        <p className="text-xs text-gray-500 mt-1">{prompt.length}/{MAX_PROMPT_LENGTH} caracteres</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">
          📊 Quantos cards?
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={1}
            max={20}
            value={totalCards}
            onChange={(e) => setTotalCards(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full font-bold text-sm min-w-12 text-center">
            {totalCards}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Escolha entre 1 e 20 cards</p>
      </div>

      <button
        onClick={handleGenerate}
        disabled={!idea.trim() || isLoading || idea.length < MIN_IDEA_LENGTH}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition transform hover:scale-105 disabled:hover:scale-100 shadow-md hover:shadow-lg"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⚡</span>
            Gerando carrossel...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            🚀 Gerar Carrossel
          </span>
        )}
      </button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
        <p className="font-semibold mb-1">⏱️ Dica: Em média 30 segundos</p>
        <p>Quanto mais específica sua ideia, melhor o resultado.</p>
      </div>
    </div>
  );
}
