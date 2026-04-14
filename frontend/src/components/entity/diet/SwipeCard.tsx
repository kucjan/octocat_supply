import { useEffect, useRef } from 'react';
import { useTheme } from '../../../context/ThemeContext';

export interface CatFood {
  id: number;
  name: string;
  description: string;
  category: 'wet' | 'dry' | 'treat' | 'supplement';
  proteinSource: string;
  imgName?: string;
  nutritionalInfo?: string;
}

interface SwipeCardProps {
  product: CatFood;
  onLike: () => void;
  onDislike: () => void;
  isActive: boolean;
}

const CATEGORY_LABEL: Record<CatFood['category'], string> = {
  wet: 'Wet food',
  dry: 'Dry food',
  treat: 'Treat',
  supplement: 'Supplement',
};

const PROTEIN_EMOJI: Record<string, string> = {
  chicken: '🐔',
  salmon: '🐟',
  tuna: '🐠',
  beef: '🥩',
  turkey: '🦃',
  rabbit: '🐇',
  venison: '🦌',
};

export default function SwipeCard({ product, onLike, onDislike, isActive }: SwipeCardProps) {
  const { darkMode } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);

  const proteinEmoji = PROTEIN_EMOJI[product.proteinSource] ?? '🍽️';

  let nutritional: Record<string, string> | null = null;
  if (product.nutritionalInfo) {
    try {
      nutritional = JSON.parse(product.nutritionalInfo) as Record<string, string>;
    } catch {
      nutritional = null;
    }
  }

  // Keyboard support: left arrow = dislike, right arrow = like
  useEffect(() => {
    if (!isActive) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onLike();
      else if (e.key === 'ArrowLeft') onDislike();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isActive, onLike, onDislike]);

  return (
    <div
      ref={cardRef}
      role="article"
      aria-label={`Produkt: ${product.name}`}
      className={`w-full max-w-sm mx-auto rounded-2xl shadow-xl overflow-hidden transition-transform duration-200 ${
        darkMode ? 'bg-gray-800 text-light' : 'bg-white text-gray-800'
      }`}
    >
      {/* Card image / icon area */}
      <div className={`h-48 flex items-center justify-center text-7xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        {proteinEmoji}
      </div>

      {/* Card body */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              product.category === 'wet'
                ? 'bg-blue-100 text-blue-700'
                : product.category === 'dry'
                  ? 'bg-yellow-100 text-yellow-700'
                  : product.category === 'treat'
                    ? 'bg-pink-100 text-pink-700'
                    : 'bg-green-100 text-green-700'
            }`}
          >
            {CATEGORY_LABEL[product.category]}
          </span>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Protein: {product.proteinSource}
          </span>
        </div>

        <h3 className="text-lg font-bold mb-2">{product.name}</h3>
        <p className={`text-sm mb-4 line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {product.description}
        </p>

        {nutritional && (
          <div className={`flex gap-3 text-xs mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {nutritional.protein && <span>Protein: {nutritional.protein}</span>}
            {nutritional.fat && <span>Fat: {nutritional.fat}</span>}
            {nutritional.moisture && <span>Moisture: {nutritional.moisture}</span>}
          </div>
        )}

        {/* Like / Dislike buttons */}
        <div className="flex gap-4">
          <button
            onClick={onDislike}
            aria-label="I don't like this product"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-red-300 text-red-500 font-semibold text-sm hover:bg-red-50 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <span aria-hidden="true">✕</span> Dislike
          </button>
          <button
            onClick={onLike}
            aria-label="I like this product"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-primary text-primary font-semibold text-sm hover:bg-green-50 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <span aria-hidden="true">❤️</span> Like
          </button>
        </div>
      </div>
    </div>
  );
}
