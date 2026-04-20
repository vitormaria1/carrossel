'use client';

import { useUserContext, ToneOfVoice, Objective, Audience } from '@/lib/user-context';
import { useState } from 'react';

interface UserContextFormProps {
  onComplete?: () => void;
}

export function UserContextForm({ onComplete }: UserContextFormProps) {
  const {
    expertise,
    yearsExperience,
    mainAchievement,
    productName,
    productDescription,
    productPrice,
    uniqueDifferential,
    problemSolves,
    targetAudience,
    audiencePainPoints,
    toneOfVoice,
    objective,
    setExpertise,
    setProduct,
    setAudience,
    setPreferences,
  } = useUserContext();

  const [isExpanded, setIsExpanded] = useState(false);

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 font-bold hover:bg-blue-100 transition"
      >
        📋 Personalizar seu perfil (recomendado)
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Seu Perfil Profissional</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>

      {/* EXPERTISE */}
      <div className="space-y-3 border-b pb-4">
        <h4 className="font-semibold text-sm text-gray-700">EXPERTISE</h4>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Sua área de expertise</label>
          <input
            type="text"
            value={expertise}
            onChange={(e) => setExpertise(e.target.value, yearsExperience, mainAchievement)}
            placeholder="Ex: Marketing Digital, Design Gráfico, Vendas"
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">{expertise.length}/100</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Anos de experiência</label>
          <input
            type="number"
            value={yearsExperience}
            onChange={(e) => setExpertise(expertise, parseInt(e.target.value) || 0, mainAchievement)}
            min="0"
            max="50"
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Principal conquista/resultado</label>
          <input
            type="text"
            value={mainAchievement}
            onChange={(e) => setExpertise(expertise, yearsExperience, e.target.value)}
            placeholder="Ex: Gerou $500k em vendas | Treinou 1000+ alunos"
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={100}
          />
        </div>
      </div>

      {/* PRODUTO */}
      <div className="space-y-3 border-b pb-4">
        <h4 className="font-semibold text-sm text-gray-700">SEU PRODUTO/SERVIÇO</h4>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Nome do produto/serviço</label>
          <input
            type="text"
            value={productName}
            onChange={(e) =>
              setProduct(e.target.value, productDescription, uniqueDifferential, problemSolves, productPrice)
            }
            placeholder="Ex: Curso de Copywriting, Serviço de Consultoria"
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Descrição breve</label>
          <textarea
            value={productDescription}
            onChange={(e) =>
              setProduct(productName, e.target.value, uniqueDifferential, problemSolves, productPrice)
            }
            placeholder="O que é, para quem é"
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent h-16 resize-none"
            maxLength={200}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Seu diferencial (por que é melhor?)</label>
          <input
            type="text"
            value={uniqueDifferential}
            onChange={(e) =>
              setProduct(productName, productDescription, e.target.value, problemSolves, productPrice)
            }
            placeholder="Ex: 1-on-1 personalizado, Garantia de 30 dias"
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={150}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Qual problema você resolve?</label>
          <input
            type="text"
            value={problemSolves}
            onChange={(e) =>
              setProduct(productName, productDescription, uniqueDifferential, e.target.value, productPrice)
            }
            placeholder="Ex: Dificuldade em vender online, Falta de liderança"
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={150}
          />
        </div>
      </div>

      {/* AUDIENCE */}
      <div className="space-y-3 border-b pb-4">
        <h4 className="font-semibold text-sm text-gray-700">SEU PÚBLICO</h4>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-2">Quem é seu público-alvo?</label>
          <div className="grid grid-cols-2 gap-2">
            {(['empreendedores', 'corporativo', 'criadores', 'estudantes'] as Audience[]).map((type) => (
              <button
                key={type}
                onClick={() => setAudience(type, audiencePainPoints)}
                className={`p-2 rounded-lg text-xs font-semibold transition ${
                  targetAudience === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Principais dores do seu público</label>
          <textarea
            value={audiencePainPoints}
            onChange={(e) => setAudience(targetAudience, e.target.value)}
            placeholder="Ex: Falta de tempo, Medo de começar, Sem dinheiro"
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12 resize-none"
            maxLength={150}
          />
        </div>
      </div>

      {/* PREFERENCES */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-gray-700">PREFERÊNCIAS</h4>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-2">Tom de voz desejado</label>
          <div className="grid grid-cols-2 gap-2">
            {(['formal', 'casual', 'inspirador', 'urgente'] as ToneOfVoice[]).map((tone) => (
              <button
                key={tone}
                onClick={() => setPreferences(tone, objective)}
                className={`p-2 rounded-lg text-xs font-semibold transition ${
                  toneOfVoice === tone
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-2">Objetivo principal</label>
          <div className="grid grid-cols-2 gap-2">
            {(['leads', 'vendas', 'awareness', 'engagement'] as Objective[]).map((obj) => (
              <button
                key={obj}
                onClick={() => setPreferences(toneOfVoice, obj)}
                className={`p-2 rounded-lg text-xs font-semibold transition ${
                  objective === obj
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {obj}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          setIsExpanded(false);
          onComplete?.();
        }}
        className="w-full p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
      >
        ✓ Pronto! Vamos gerar carrosséis
      </button>
    </div>
  );
}
