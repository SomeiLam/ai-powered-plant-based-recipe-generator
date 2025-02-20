import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface Ingredient {
  id: string
  name: string
  tags: string[]
}

interface Category {
  category: string
  items: Ingredient[]
}

interface IngredientTagFilterProps {
  ingredients: Category[]
  selectedTags: string[]
  onToggleTag: (tag: string) => void // Toggle instead of separate select/remove
  title: string
  showTags: boolean
  handleToggleShowTags: () => void
}

export function IngredientTagFilter({
  ingredients,
  selectedTags,
  onToggleTag,
  title,
  showTags,
  handleToggleShowTags,
}: IngredientTagFilterProps) {
  const [showMore, setShowMore] = useState(false)
  // Extract unique tags from all ingredients (flattened from categories)
  const allTags = Array.from(
    new Set(
      ingredients.flatMap((group) =>
        group.items.flatMap((ingredient) => ingredient.tags)
      )
    )
  )

  const displayedTags = showMore ? allTags : allTags.slice(0, 8)

  return (
    <div className="mb-8">
      <div className="flex flex-row items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button onClick={handleToggleShowTags}>
          {showTags ? (
            <EyeOff className="hover:text-indigo-500" />
          ) : (
            <Eye className="hover:text-indigo-500" />
          )}
        </button>
      </div>
      {/* Display all available tags */}
      {showTags && (
        <>
          <div className="flex flex-wrap gap-2">
            {displayedTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onToggleTag(tag)} // Toggle behavior
                className={`px-3 py-1 rounded-full text-sm border border-gray-300 transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-green-500 text-white'
                    : 'hover:border-green-500 hover:text-green-500'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <button
            className="bg-transparent p-2 hover:underline text-sm mt-2"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? 'Show less' : 'Show more...'}
          </button>
        </>
      )}
    </div>
  )
}
