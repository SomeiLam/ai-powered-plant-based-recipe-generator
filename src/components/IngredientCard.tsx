import React from 'react'
import { Check } from 'lucide-react'
import { Ingredient } from '../types'

interface IngredientCardProps {
  ingredient: Ingredient
  selected: boolean
  onClick: () => void
  showTags: boolean
}

export const IngredientCard: React.FC<IngredientCardProps> = ({
  ingredient,
  selected,
  onClick,
  showTags,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer group transition-all duration-300 transform hover:scale-105 ${
        selected ? 'ring-4 ring-green-700' : ''
      }`}
    >
      <div className="relative rounded-xl overflow-hidden shadow-lg bg-white/90 ">
        {/* Image Container with Gradient Overlay */}
        <div className="relative h-40">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <img
            src={ingredient.image}
            alt={ingredient.name}
            className="w-full h-full object-cover"
          />
          <h3 className="absolute bottom-2 left-3 right-3 text-white font-semibold z-20 text-lg">
            {ingredient.name}
          </h3>
        </div>

        {/* Tags Section */}
        {showTags && (
          <div className="p-3">
            <div className="flex flex-wrap gap-1">
              {ingredient.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-gray-700 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Selection Indicator */}
        {selected && (
          <div className="absolute top-2 right-2 bg-green-700 rounded-full p-1.5 z-30 shadow-lg">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </div>
  )
}
