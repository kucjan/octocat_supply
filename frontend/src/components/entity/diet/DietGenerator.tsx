import { useState, useCallback } from 'react';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import { API_BASE_URL, api } from '../../../api/config';
import { useTheme } from '../../../context/ThemeContext';
import SwipeCard, { CatFood } from './SwipeCard';
import DietResults, { DietSuggestion } from './DietResults';

type Phase = 'swiping' | 'loading' | 'results' | 'error';

const MIN_LIKED_FOR_GENERATE = 3;

async function fetchCatFoodProducts(): Promise<CatFood[]> {
  const response = await axios.get<CatFood[]>(`${API_BASE_URL}${api.endpoints.dietProducts}`);
  return response.data;
}

async function generateDiet(likedIds: number[], dislikedIds: number[]): Promise<DietSuggestion[]> {
  const response = await axios.post<{ suggestions: DietSuggestion[] }>(
    `${API_BASE_URL}${api.endpoints.dietGenerate}`,
    { likedIds, dislikedIds },
  );
  return response.data.suggestions;
}

export default function DietGenerator() {
  const { darkMode } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [dislikedIds, setDislikedIds] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>('swiping');
  const [suggestions, setSuggestions] = useState<DietSuggestion[]>([]);

  const {
    data: products,
    isLoading,
    error: fetchError,
  } = useQuery<CatFood[]>('catFoodProducts', fetchCatFoodProducts);

  const mutation = useMutation(
    ({ liked, disliked }: { liked: number[]; disliked: number[] }) =>
      generateDiet(liked, disliked),
    {
      onSuccess: (data) => {
        setSuggestions(data);
        setPhase('results');
      },
      onError: () => {
        setPhase('error');
      },
    },
  );

  const handleLike = useCallback(() => {
    if (!products) return;
    const product = products[currentIndex];
    setLikedIds((prev) => [...prev, product.id]);
    setCurrentIndex((prev) => prev + 1);
  }, [products, currentIndex]);

  const handleDislike = useCallback(() => {
    if (!products) return;
    const product = products[currentIndex];
    setDislikedIds((prev) => [...prev, product.id]);
    setCurrentIndex((prev) => prev + 1);
  }, [products, currentIndex]);

  const handleGenerate = useCallback(() => {
    setPhase('loading');
    mutation.mutate({ liked: likedIds, disliked: dislikedIds });
  }, [likedIds, dislikedIds, mutation]);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setLikedIds([]);
    setDislikedIds([]);
    setSuggestions([]);
    setPhase('swiping');
  }, []);

  const allSwiped = products ? currentIndex >= products.length : false;
  const canGenerate = likedIds.length >= MIN_LIKED_FOR_GENERATE || allSwiped && likedIds.length > 0;

  // ─── Loading / Error (data fetch) ───────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse" aria-hidden="true">🐱</div>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Loading products…</p>
        </div>
      </div>
    );
  }

  if (fetchError || !products) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className={`text-center p-6 rounded-xl ${darkMode ? 'bg-gray-800 text-red-400' : 'bg-red-50 text-red-600'}`}>
          <p className="font-semibold">Failed to load products.</p>
          <p className="text-sm mt-1">Check your server connection.</p>
        </div>
      </div>
    );
  }

  // ─── AI Loading ──────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce" aria-hidden="true">🤖</div>
          <p className={`font-semibold text-lg ${darkMode ? 'text-light' : 'text-gray-800'}`}>
            AI is generating your diet plan…
          </p>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Analyzing preferences and preparing suggestions
          </p>
        </div>
      </div>
    );
  }

  // ─── AI Error ────────────────────────────────────────────────────────────
  if (phase === 'error') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className={`text-center p-6 rounded-xl max-w-sm ${darkMode ? 'bg-gray-800 text-red-400' : 'bg-red-50 text-red-600'}`}>
          <div className="text-4xl mb-3" aria-hidden="true">⚠️</div>
          <p className="font-semibold">Failed to generate diet suggestions.</p>
          <p className="text-sm mt-1 mb-4">Make sure the server is configured with a valid GITHUB_TOKEN.</p>
          <button
            onClick={handleReset}
            className="px-5 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // ─── Results ─────────────────────────────────────────────────────────────
  if (phase === 'results') {
    return (
      <div className="py-8">
        <DietResults suggestions={suggestions} onReset={handleReset} />
      </div>
    );
  }

  // ─── Swiping ─────────────────────────────────────────────────────────────
  const progress = products.length > 0 ? Math.round((currentIndex / products.length) * 100) : 0;

  return (
    <div className={`min-h-screen py-8 px-4 ${darkMode ? 'bg-dark' : 'bg-gray-100'}`}>
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className={`text-3xl font-bold mb-1 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
            🐾 Diet Generator
          </h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Rate cat food products and AI will build the perfect diet plan
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-1">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              {currentIndex} / {products.length} products
            </span>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              ❤️ {likedIds.length} likes
            </span>
          </div>
          <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Rating progress"
            />
          </div>
        </div>

        {/* Swipe card or "all done" state */}
        {allSwiped ? (
          <div className={`text-center py-10 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <div className="text-5xl mb-4" aria-hidden="true">🎉</div>
            <p className={`font-bold text-lg mb-1 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
              You've rated all products!
            </p>
            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              You liked {likedIds.length} out of {products.length} products.
            </p>
            {canGenerate ? (
              <button
                onClick={handleGenerate}
                className="px-8 py-3 rounded-xl bg-primary text-white font-bold text-base hover:bg-accent active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                ✨ Generate diet
              </button>
            ) : (
              <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
                Like at least 1 product to generate suggestions.
              </p>
            )}
          </div>
        ) : (
          <>
            <SwipeCard
              product={products[currentIndex]}
              onLike={handleLike}
              onDislike={handleDislike}
              isActive
            />

            <p className={`text-center text-xs mt-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Use ← → arrow keys or the buttons above
            </p>

            {/* Early generate button – available after MIN_LIKED_FOR_GENERATE likes */}
            {canGenerate && (
              <div className="text-center mt-6">
                <button
                  onClick={handleGenerate}
                  className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-accent active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  ✨ Generate diet now ({likedIds.length} likes)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
