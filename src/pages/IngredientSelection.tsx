import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Utensils, ChevronDown, ChevronUp, Plus, Trash } from 'lucide-react'
import { ingredients, cuisines } from '../data/ingredients'
import { IngredientCard } from '../components/IngredientCard'
import { IngredientTagFilter } from '../components/IngredientTagFilter'

export const IngredientSelection = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [selectedCuisine, setSelectedCuisine] = useState<string>('')
  const [temp, setTemp] = useState<string>('')
  const [additionalIngredients, setAdditionalIngredients] = useState<string[]>(
    []
  )
  const [openCategories, setOpenCategories] = useState<string[]>([]) // Multiple open categories
  const navigate = useNavigate()

  const selectedIngredientList = ingredients
    .flatMap((group) => group.items) // Flatten all ingredients from categories
    .filter((ingredient) => selectedIngredients.includes(ingredient.id)) // Match selected IDs

  const handleSelectTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]))
  }

  const handleRemoveTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag))
  }

  const toggleIngredient = (id: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  // Toggle multiple accordions
  const toggleCategory = (category: string) => {
    setOpenCategories(
      (prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category) // Close if already open
          : [...prev, category] // Open if closed
    )
  }

  const handleSubmit = () => {
    if (
      (selectedIngredients.length > 0 || additionalIngredients.length > 0) &&
      selectedCuisine
    ) {
      navigate('/recipe', {
        state: {
          ingredients: selectedIngredients,
          cuisine: selectedCuisine,
          userInputIngredients: additionalIngredients,
        },
      })
    }
  }

  // Add additional ingredient (prevent duplicates & empty values)
  const addAdditionalIngredient = () => {
    if (temp.trim() && !additionalIngredients.includes(temp.trim())) {
      setAdditionalIngredients([...additionalIngredients, temp.trim()])
      setTemp('')
    }
  }

  // Remove additional ingredient
  const removeAdditionalIngredient = (ingredient: string) => {
    setAdditionalIngredients(
      additionalIngredients.filter((item) => item !== ingredient)
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] p-6">
      <div className="max-w-7xl mx-auto">
        <IngredientTagFilter
          ingredients={ingredients}
          selectedTags={selectedTags}
          onSelectTag={handleSelectTag}
          onRemoveTag={handleRemoveTag}
          title="Filter Ingredients by Tags"
        />
        <div className="space-y-4">
          {ingredients.map((group) => {
            // Filter ingredients within this category
            const filteredItems = group.items.filter(
              (ingredient) =>
                selectedTags.length === 0 ||
                selectedTags.some((tag) => ingredient.tags.includes(tag))
            )

            if (filteredItems.length === 0) return null // Skip empty categories

            return (
              <div
                key={group.category}
                className="bg-white rounded-lg shadow-md"
              >
                {/* Category Header (Clickable) */}
                <button
                  onClick={() => toggleCategory(group.category)}
                  className="w-full flex justify-between items-center p-4 font-semibold text-gray-800 hover:bg-gray-100 rounded-lg transition"
                >
                  {group.category}
                  {openCategories.includes(group.category) ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>

                {/* Category Content (Only Show If Open) */}
                <div
                  className={`duration-300 transition-all overflow-hidden ${
                    openCategories.includes(group.category)
                      ? 'max-h-screen p-4'
                      : 'max-h-0'
                  }`}
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {filteredItems.map(
                      (
                        ingredient // ✅ Use filteredItems here
                      ) => (
                        <IngredientCard
                          key={ingredient.id}
                          ingredient={ingredient}
                          selected={selectedIngredients.includes(ingredient.id)}
                          onClick={() => toggleIngredient(ingredient.id)}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Cuisine Selection */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Select Cuisine
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cuisines.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    selectedCuisine === cuisine
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Ingredients */}
          <div className="bg-white rounded-lg p-6 shadow-md flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Selected Ingredients
              </h2>
              {selectedIngredientList.length === 0 ? (
                <p className="text-gray-500">No ingredients selected.</p>
              ) : (
                <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {selectedIngredientList.map((ingredient) => (
                    <li
                      key={ingredient.id}
                      className="flex flex-row justify-between bg-gray-100 rounded-lg items-center"
                    >
                      <img
                        src={ingredient.image}
                        alt={ingredient.name}
                        className="w-20 h-10 object-cover rounded"
                      />
                      <span>{ingredient.name}</span>
                      <button
                        onClick={() => toggleIngredient(ingredient.id)}
                        className="text-red-500 hover:text-red-700 mr-3"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Add Your Own Ingredients
                </h2>
                <p className="text-gray-700 mb-3 text-sm">
                  Only plant-based ingredients will be included. Non-plant-based
                  items will be excluded automatically. 💚
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 justify-start items-center">
                  <input
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    className="w-[300px] rounded-md border-gray-300 shadow-sm py-2 px-4"
                    placeholder="Enter ingredient name"
                  />
                  <button
                    onClick={addAdditionalIngredient}
                    className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Display Additional Ingredients */}
                {additionalIngredients.length > 0 && (
                  <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {additionalIngredients.map((ingredient) => (
                      <li
                        key={ingredient}
                        className="flex justify-between items-center bg-gray-100 py-2 px-3 rounded-md min-w-[150px]"
                      >
                        <span className="text-gray-800">🥣 {ingredient}</span>
                        <button
                          onClick={() => removeAdditionalIngredient(ingredient)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center py-5">
            <button
              onClick={handleSubmit}
              disabled={
                (selectedIngredients.length === 0 &&
                  additionalIngredients.length === 0) ||
                !selectedCuisine
              }
              className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-semibold
                disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
            >
              <Utensils className="w-5 h-5" />
              Ready to Cook!
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
