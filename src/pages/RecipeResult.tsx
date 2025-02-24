import { useLocation, useNavigate } from 'react-router-dom'
import { CookingPot, ChefHat, ArrowLeft, Clock, Users, Bot } from 'lucide-react'
import { ingredients } from '../data/ingredients'
import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_BACKEND_API

interface Recipe {
  title: string
  time: string
  servings: string
  cuisine: string
  ingredients: { name: string; portion: string }[]
  additionalIngredients: string[]
  instructions: string[]
  description: string
}

export const RecipeResult = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const {
    ingredients: selectedIngredientIds,
    cuisine,
    userInputIngredients,
  } = location.state || {
    ingredients: [],
    cuisine: '',
    userInputIngredients: [],
  }

  // Flatten all ingredients into a single array for lookup
  const allIngredients = ingredients.flatMap((group) => group.items)
  const selectedIngredients = allIngredients
    .filter((item) => selectedIngredientIds.includes(item.id))
    .map((item) => item.name)

  useEffect(() => {
    let isMounted = true // Prevent multiple fetches

    const fetchResult = async () => {
      try {
        setIsLoading(true)

        const response = await fetch(`${API_URL}/generate-vegan-recipe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            selectedIngredients,
            cuisine,
            userInputIngredients,
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        if (isMounted) {
          setRecipe(data.recipe)
        }
      } catch (error) {
        console.error('Error fetching recipe:', error)
        if (isMounted) {
          setRecipe(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchResult()

    return () => {
      isMounted = false // Cleanup to prevent multiple calls
    }
  }, []) // Empty dependency array ensures it runs only ONCE

  if (!location.state) {
    return (
      <div className="min-h-screen  bg-[#FAFAF8] p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            No Recipe Selected
          </h1>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Go back to ingredient selection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#FAFAF8] p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to ingredients
        </button>

        {isLoading ? (
          <div className="min-h-[500px] bg-gray-50 flex items-center justify-center">
            <div className="min-h-[500px] bg-gray-50 flex items-center justify-center">
              <div
                className="font-bold sm:text-2xl font-mono flex flex-row gap-3 items-center"
                style={{
                  width: 'fit-content',
                  clipPath: 'inset(0 3ch 0 0)',
                  animation: 'loading-animation 1s steps(15) infinite',
                }}
              >
                <Bot className="spin-animation" />
                Generating your AI-powered recipe...
              </div>

              <style>
                {`
                  @keyframes loading-animation {
                    to { clip-path: inset(0 -1ch 0 0); }
                  }
                `}
              </style>
            </div>

            <style>
              {`
              @keyframes loading-animation {
                to { clip-path: inset(0 -1ch 0 0); }
              }
            `}
            </style>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden pt-2 sm:pt-8 pb-12 sm:px-10 mb-6">
              <div className="sm:p-6 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <CookingPot className="min-w-6 min-h-6 text-green-500" />
                  <h1 className="text-xl sm:text-3xl font-bold text-gray-800">
                    {recipe?.title}
                  </h1>
                </div>
                <div className="flex items-center mb-4 py-4 border-b">
                  <h4 className="text-gray-700">{recipe?.description}</h4>
                </div>

                <div className="flex flex-wrap gap-4 mb-10">
                  <div className="flex items-center gap-1">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span>{recipe?.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-5 h-5 text-gray-500" />
                    <span>{recipe?.servings} servings</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChefHat className="w-5 h-5 text-gray-500" />
                    <span>{recipe?.cuisine || cuisine} cuisine</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
                      Your Ingredients
                    </h2>
                    <ul className="space-y-2">
                      {recipe?.ingredients.map(
                        (
                          ingredient: { name: string; portion: string },
                          index: number
                        ) => (
                          <li key={index} className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            {ingredient.name} - {ingredient.portion}
                          </li>
                        )
                      )}
                    </ul>

                    <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                      Additional Ingredients
                    </h2>
                    <ul className="space-y-2">
                      {recipe?.additionalIngredients.map(
                        (ingredient, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            {ingredient}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
                      Instructions
                    </h2>
                    <ol className="space-y-4">
                      {recipe?.instructions.map((instruction, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-500 rounded-full flex items-center justify-center font-semibold">
                            {index + 1}
                          </span>
                          <p className="text-gray-700">{instruction}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-gray-600 leading-relaxed">
                Please note that while the AI carefully considers your selected
                ingredients and preferences, the final result may include slight
                variations or additional ingredients to enhance flavor and
                balance. Feel free to adjust the recipe to suit your taste! 🌿
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
