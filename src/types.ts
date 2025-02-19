export interface Ingredient {
  id: string;
  name: string;
  image: string;
  tags: string[];
}

export interface Recipe {
  title: string;
  cuisine: string;
  ingredients: string[];
  instructions: string[];
  additionalIngredients: string[];
  image: string;
}