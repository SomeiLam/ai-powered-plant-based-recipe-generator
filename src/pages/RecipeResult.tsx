import { useLocation, useNavigate } from 'react-router-dom'
import { CookingPot, ChefHat, ArrowLeft, Clock, Users, Bot } from 'lucide-react'
import { ingredients } from '../data/ingredients'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { useEffect, useState } from 'react'

interface Recipe {
  title: string
  time: string
  servings: string
  ingredients: { name: string; portion: string }[]
  additionalIngredients: string[]
  instructions: string[]
  description: string
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

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

  const prompt = `You are an expert vegan chef and recipe generator. Your task is to create a vegan recipe based on the given ingredients, cuisine, and user-provided additional ingredients.

    ### Important Rules:
    1. The recipe must be **completely vegan** (no meat, dairy, eggs, or honey).
    2. Use the given **selected ingredients** and create a **cohesive and flavorful dish**.
    3. Check if the **userInputIngredients** contain plant-based foods. Ignore non-vegan items.
    4. Remove duplicates from **userInputIngredients** that are already in **selectedIngredients**.
    5. If a userInputIngredient is a **valid new plant-based food**, add it to the main ingredients list.
    6. Assign **realistic portion sizes** for each ingredient.
    7. Generate **additional complementary ingredients** (e.g., seasonings, spices, oils).
    8. Generate **realistic cooking instructions** in a structured format.
    9. Provide a **dish name**, **estimated cooking time**, and **number of servings**.
    10. The **output format must follow the exact structure given below in JavaScript**.
    11. Provide a **brief yet engaging description** of the dish, highlighting its key flavors, texture, and appeal.
    
    ---
    
    ### **Input Format:**
    {
      "selectedIngredients": ${selectedIngredients},
      "cuisine": ${cuisine},
      "userInputIngredients": ${userInputIngredients}
    }
    
    ---
    
    ### **Processing Instructions:**
    - **Verify userInputIngredients:** Remove non-plant-based ingredients.
    - **Check for duplicates:** If an item is already in selectedIngredients, do not add it again.
    - **Add valid new ingredients** to the main ingredients list.
    - **Assign portions** to each ingredient based on the type of dish and standard cooking practices.
    
    ---
    
    ### **Expected Output Format (MUST be exactly like this, including syntax and structure):**
    
    const recipe = {
      title: "{{dish name}}",
      description: "{{A short, engaging description of the dish, highlighting its key flavors, texture, and appeal}}",
      time: "{{estimated cooking time}}",
      servings: "{{number of servings}}",
      ingredients: [
        { "name": "{{ingredient 1}}", "portion": "{{portion size}}" },
        { "name": "{{ingredient 2}}", "portion": "{{portion size}}" },
        { "name": "{{ingredient 3}}", "portion": "{{portion size}}" }
      ],
      additionalIngredients: [
        "{{Generated additional ingredient 1}}",
        "{{Generated additional ingredient 2}}",
        "{{Generated additional ingredient 3}}",
        "{{Generated additional ingredient 4}}"
      ],
      instructions: [
        "{{Step 1: Generated cooking step}}",
        "{{Step 2: Generated cooking step}}",
        "{{Step 3: Generated cooking step}}",
        "{{Step 4: Generated cooking step}}",
        "{{Step 5: Generated cooking step}}"
      ]
    };
    
    ---
    
    ### **Response Requirements:**
    - **Title:** A creative and authentic name for the dish based on the cuisine and ingredients.
    - **Description:** A brief summary of the dish, including its taste, texture, and uniqueness.
    - **Time:** A realistic cooking time based on the complexity of the dish.
    - **Servings:** A reasonable portion size for the dish.
    - **Ingredients:** A list of **selectedIngredients** (including valid user-input ingredients) with assigned portions.
    - **Additional Ingredients:** Dynamically generated based on the cuisine (e.g., if it’s an Indian dish, suggest relevant spices).
    - **Instructions:** Clear, logical, and structured, guiding step-by-step from preparation to serving.
    
    ---
    
    ### **Example AI Response (Based on Input Above):**
    
    const recipe = {
      title: "Middle Eastern Chickpea Stew",
      description: "A hearty and aromatic Middle Eastern-inspired chickpea stew, packed with rich flavors of cumin and smoked paprika, simmered in a tomato-based sauce with fresh spinach.",
      time: "35 minutes",
      servings: "4",
      ingredients: [
        { "name": "chickpeas", "portion": "1 cup, cooked" },
        { "name": "tomatoes", "portion": "2 medium, diced" },
        { "name": "spinach", "portion": "2 cups, fresh" },
        { "name": "onion", "portion": "1 small, chopped" },
        { "name": "cumin", "portion": "1 teaspoon" }
      ],
      additionalIngredients: [
        "2 cloves garlic, minced",
        "1 teaspoon smoked paprika",
        "1 tablespoon olive oil",
        "Salt and pepper to taste"
      ],
      instructions: [
        "Wash and chop all vegetables as needed.",
        "Heat olive oil in a large pot over medium heat.",
        "Sauté onion and garlic until fragrant and translucent.",
        "Add chickpeas, tomatoes, spinach, cumin, and smoked paprika.",
        "Simmer for 20 minutes, season with salt and pepper, then serve hot."
      ]
    };
    
    ---
    
    ### **Final Instructions:**
    - **DO NOT** change the structure of the output.
    - **DO NOT** add extra fields.
    - **DO NOT** omit any required fields.
    - **Ensure** all additional ingredients and instructions are meaningful and relevant to the cuisine.
    
    Now generate the **mockRecipe** object using the given ingredients and cuisine.
    `

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const result = await model.generateContent(prompt)
        const resultString = result.response.text()

        // Remove code block formatting (```javascript and ```)
        let cleanedText = resultString
          .replace(/```[\s\S]*?\n/, '') // Remove ```javascript or similar
          .replace(/```/g, '') // Remove remaining ```
          .replace(/const recipe = /, '') // Remove JavaScript variable declaration
          .trim()

        // Ensure object keys are properly quoted
        cleanedText = cleanedText.replace(/([{,])(\s*)(\w+):/g, '$1"$3":')

        // Ensure valid JSON format (attempt to extract JSON only)
        const jsonStart = cleanedText.indexOf('{')
        const jsonEnd = cleanedText.lastIndexOf('}')
        let validJson = cleanedText.substring(jsonStart, jsonEnd + 1)

        // Remove trailing commas before closing brackets (invalid in JSON)
        validJson = validJson.replace(/,\s*([\]}])/g, '$1')

        console.log('Sanitized JSON:', validJson)

        // Attempt to parse the JSON safely
        const recipe = JSON.parse(validJson)
        setRecipe(recipe)
      } catch (error) {
        console.error('Unable to generate recipe:', error)
        setRecipe(null) // Ensure UI handles this gracefully
      } finally {
        setIsLoading(false)
      }
    }

    setIsLoading(true)
    fetchResult()
  }, [prompt])

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
                className="font-bold text-2xl font-mono flex flex-row gap-3 items-center"
                style={{
                  width: 'fit-content',
                  clipPath: 'inset(0 3ch 0 0)',
                  animation: 'loading-animation 1s steps(15) infinite',
                }}
              >
                <Bot />
                Generating recipe...
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
          <div className="bg-white rounded-lg shadow-lg overflow-hidden pt-8 pb-12 sm:px-10">
            <div className="sm:p-6 p-4">
              <div className="flex items-center gap-2 mb-4">
                <CookingPot className="w-6 h-6 text-green-500" />
                <h1 className="text-3xl font-bold text-gray-800">
                  {recipe?.title}
                </h1>
              </div>
              <div className="flex items-center mb-4 py-4 border-b">
                <h4 className="text-gray-700">{recipe?.description}</h4>
              </div>

              <div className="flex gap-4 mb-10">
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
                  <span>{cuisine} cuisine</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-gray-800">
                    Your Ingredients
                  </h2>
                  <ul className="space-y-2">
                    {recipe?.ingredients.map(
                      (
                        ingredient: { name: string; portion: string },
                        index: number
                      ) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {ingredient.name} - {ingredient.portion}
                        </li>
                      )
                    )}
                  </ul>

                  <h2 className="text-xl font-semibold mb-3 mt-6 text-gray-800">
                    Additional Ingredients
                  </h2>
                  <ul className="space-y-2">
                    {recipe?.additionalIngredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-3 text-gray-800">
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
        )}
      </div>
    </div>
  )
}
