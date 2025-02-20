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
}

export function IngredientTagFilter({
  ingredients,
  selectedTags,
  onToggleTag,
  title,
}: IngredientTagFilterProps) {
  // Extract unique tags from all ingredients (flattened from categories)
  const allTags = Array.from(
    new Set(
      ingredients.flatMap((group) =>
        group.items.flatMap((ingredient) => ingredient.tags)
      )
    )
  )

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {/* Display all available tags */}
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
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
    </div>
  )
}
