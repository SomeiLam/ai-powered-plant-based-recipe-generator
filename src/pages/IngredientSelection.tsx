import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Utensils, Plus, Trash } from 'lucide-react'
import { ingredients, cuisines } from '../data/ingredients'
import { IngredientCard } from '../components/IngredientCard'
import { IngredientTagFilter } from '../components/IngredientTagFilter'

export const IngredientSelection = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [selectedCuisine, setSelectedCuisine] = useState<string>('')
  const [temp, setTemp] = useState<string>('')
  const [customCuisine, setCustomCuisine] = useState('')
  const [additionalIngredients, setAdditionalIngredients] = useState<string[]>(
    []
  )
  const [activeTab, setActiveTab] = useState<string>(
    ingredients[0]?.category || ''
  )
  const [showTags, setShowTags] = useState(false)
  const ready =
    (selectedIngredients.length || additionalIngredients.length) &&
    (Boolean(selectedCuisine) || customCuisine)

  const navigate = useNavigate()

  const handleToggleShowTags = () => {
    if (showTags) setSelectedTags([])
    setShowTags(!showTags)
  }

  // ✅ Get selected ingredient details
  const selectedIngredientList = ingredients
    .flatMap((group) => group.items)
    .filter((ingredient) => selectedIngredients.includes(ingredient.id))

  // ✅ Toggle Tag Selection
  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  // ✅ Toggle Ingredient Selection
  const toggleIngredient = (id: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  // ✅ Handle Recipe Submission
  const handleSubmit = () => {
    if (ready) {
      navigate('/recipe', {
        state: {
          ingredients: selectedIngredients,
          cuisine: selectedCuisine || customCuisine,
          userInputIngredients: additionalIngredients,
        },
      })
    }
  }

  // ✅ Add Additional Ingredient
  const addAdditionalIngredient = () => {
    if (temp.trim() && !additionalIngredients.includes(temp.trim())) {
      setAdditionalIngredients([...additionalIngredients, temp.trim()])
      setTemp('')
    }
  }

  // ✅ Remove Additional Ingredient
  const removeAdditionalIngredient = (ingredient: string) => {
    setAdditionalIngredients(
      additionalIngredients.filter((item) => item !== ingredient)
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] p-6">
      <div className="max-w-7xl mx-auto">
        {/* ✅ Ingredient Tag Filter */}
        <IngredientTagFilter
          ingredients={ingredients}
          selectedTags={selectedTags}
          onToggleTag={handleToggleTag}
          title="Filter Ingredients by Tags"
          showTags={showTags}
          handleToggleShowTags={handleToggleShowTags}
        />

        <div className="space-y-4">
          {/* Tabs Navigation with Counts */}
          <div className="flex flex-wrap border-b mb-6">
            {ingredients.map((group) => {
              // Count matching items for this category
              const matchingItems = group.items.filter(
                (ingredient) =>
                  selectedTags.length === 0 ||
                  selectedTags.some((tag) => ingredient.tags.includes(tag))
              ).length

              return (
                <button
                  key={group.category}
                  className={`px-4 py-2 text-lg font-semibold text-nowrap ${
                    activeTab === group.category
                      ? 'border-b-2 border-green-500 text-green-600'
                      : 'text-gray-600'
                  }`}
                  onClick={() => setActiveTab(group.category)}
                >
                  {group.category}{' '}
                  {matchingItems > 0 ? `(${matchingItems})` : ''}
                </button>
              )
            })}
          </div>

          {/* Ingredients Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(() => {
              const filteredItems =
                ingredients
                  .find((group) => group.category === activeTab)
                  ?.items.filter(
                    (ingredient) =>
                      selectedTags.length === 0 ||
                      selectedTags.some((tag) => ingredient.tags.includes(tag))
                  ) || []

              return filteredItems.length > 0 ? (
                filteredItems.map((ingredient) => (
                  <IngredientCard
                    key={ingredient.id}
                    ingredient={ingredient}
                    selected={selectedIngredients.includes(ingredient.id)}
                    onClick={() => toggleIngredient(ingredient.id)}
                    showTags={showTags}
                  />
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center pt-10 pb-20">
                  No matches found.
                </p>
              )
            })()}
          </div>

          {/* ✅ Cuisine Selection */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Select Cuisine
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cuisines.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => {
                    setCustomCuisine('')
                    setSelectedCuisine(cuisine)
                  }}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    selectedCuisine === cuisine
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
              <input
                value={customCuisine}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedCuisine('')
                  }
                  setCustomCuisine(e.target.value)
                }}
                className="rounded-md border-gray-300 shadow-sm py-2 px-4"
                placeholder="Enter your cuisine"
              />
            </div>
          </div>

          {/* ✅ Selected Ingredients */}
          <div className="bg-white rounded-lg p-6 shadow-md">
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
                    className="flex gap-1 justify-between bg-gray-100 rounded-lg p-2 items-center"
                  >
                    <img
                      src={ingredient.image}
                      alt={ingredient.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <span>{ingredient.name}</span>
                    <button
                      onClick={() => toggleIngredient(ingredient.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ✅ Additional Ingredients */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-800">
              Add Your Own Ingredients
            </h2>
            <p className="text-gray-700 mb-3 text-sm">
              Only plant-based ingredients will be included. Non-plant-based
              items will be excluded automatically. 💚
            </p>
            <div className="flex flex-row gap-2 items-center">
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

            {additionalIngredients.length > 0 && (
              <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {additionalIngredients.map((ingredient) => (
                  <li
                    key={ingredient}
                    className="flex justify-between bg-gray-100 py-2 px-3 rounded-md min-w-[150px]"
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

          {/* ✅ Submit Button */}
          <div className="text-center py-5 flex items-center justify-center">
            <button
              onClick={handleSubmit}
              disabled={!ready}
              className="bg-green-500 text-white px-8 py-3 rounded-lg flex flex-row gap-3 items-center justify-center text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
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
