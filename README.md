# 🌱 Plant-Based AI Recipe Generator

**Plant-Based AI Recipe Generator** is an intelligent recipe creation tool that helps you generate delicious, fully plant-based recipes based on selected ingredients and cuisine preferences. Whether you're looking for a quick vegan meal or experimenting with new plant-based flavors, this AI-powered app has you covered.

## 🚀 Features

- **AI-Generated Vegan Recipes** – Get creative and unique plant-based recipes instantly.
- **Ingredient Selection** – Choose from a variety of plant-based ingredients, including legumes, vegetables, grains, and nuts.
- **Cuisine Customization** – Select a preferred cuisine style, such as Italian, Mediterranean, or Asian.
- **Smart Filtering** – Non-plant-based ingredients are automatically excluded.
- **Additional Ingredients** – AI suggests complementary seasonings, herbs, and essential additions.
- **Step-by-Step Instructions** – Clear and structured cooking guidance for every recipe.

## 🥦 How It Works

1. **Select Your Ingredients** – Choose plant-based ingredients from categorized options.
2. **Pick a Cuisine** – Define the cuisine style to tailor the recipe.
3. **Add Your Own Ingredients (Optional)** – Input additional ingredients, and the system will filter out non-plant-based items.
4. **Generate Recipe** – The AI creates a structured, step-by-step recipe along with an image of the dish.
5. **Cook & Enjoy** – Follow the instructions and enjoy your plant-based meal!

## 🛠️ Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI Model**: Google Gemini AI for recipe
- **Deployment**: Vercel

## 📸 Example Recipe Output

```javascript
const recipe = {
  title: 'Spicy Tofu and Chili Italian Scramble',
  description:
    'A vibrant and flavorful Italian-inspired scramble featuring firm tofu, spicy chili, and aromatic herbs. This dish offers a delightful combination of textures and tastes, perfect for a quick and satisfying vegan meal.',
  time: '25 minutes',
  servings: '2',
  ingredients: ['Tofu', 'Chili', 'Onion', 'Cherry Tomatoes'],
  additionalIngredients: [
    '2 cloves garlic, minced',
    '1 tablespoon olive oil',
    '1 teaspoon dried oregano',
    '1/2 teaspoon dried basil',
    'Salt and black pepper to taste',
    '1/4 cup nutritional yeast (optional, for cheesy flavor)',
    'Fresh parsley, chopped (for garnish)',
  ],
  instructions: [
    'Press the tofu to remove excess water. Crumble it into a bowl.',
    'Heat olive oil in a large skillet over medium heat. Add the onion and garlic, sauté until softened (about 3 minutes).',
    'Add the crumbled tofu and chili to the skillet. Cook for 5-7 minutes, stirring occasionally, until heated through and slightly browned.',
    'Stir in the halved cherry tomatoes, oregano, basil, salt, and pepper. Cook for another 3-5 minutes, until the tomatoes are softened.',
    'If using, stir in nutritional yeast for a cheesy flavor. Serve immediately, garnished with fresh parsley.',
  ],
}
```
