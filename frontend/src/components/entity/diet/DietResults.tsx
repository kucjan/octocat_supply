import { useTheme } from '../../../context/ThemeContext';

export interface DietSuggestion {
  name: string;
  ingredients: string[];
  description: string;
  feedingTips: string;
}

interface DietResultsProps {
  suggestions: DietSuggestion[];
  onReset: () => void;
}

export default function DietResults({ suggestions, onReset }: DietResultsProps) {
  const { darkMode } = useTheme();

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3" aria-hidden="true">🐱</div>
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
          Diet suggestions for your cat
        </h2>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Based on your preferences, AI generated the following diet compositions:
        </p>
      </div>

      {suggestions.length === 0 ? (
        <div className={`text-center py-10 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Could not generate suggestions. Please try again.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
          {suggestions.map((suggestion, index) => (
            <article
              key={index}
              className={`rounded-2xl shadow-md p-6 border-l-4 border-primary ${
                darkMode ? 'bg-gray-800 text-light' : 'bg-white text-gray-800'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl" aria-hidden="true">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </span>
                <h3 className="text-lg font-bold leading-tight">{suggestion.name}</h3>
              </div>

              {suggestion.ingredients.length > 0 && (
                <div className="mb-3">
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Ingredients
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.ingredients.map((ingredient, i) => (
                      <span
                        key={i}
                        className={`text-xs px-2 py-1 rounded-full ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {suggestion.description}
              </p>

              {suggestion.feedingTips && (
                <div className={`rounded-lg p-3 text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-green-50 text-green-800'}`}>
                  <span className="font-semibold">💡 Tips: </span>
                  {suggestion.feedingTips}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <button
          onClick={onReset}
          className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-accent active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
