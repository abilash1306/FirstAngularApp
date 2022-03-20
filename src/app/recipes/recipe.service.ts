import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredients.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable({
    providedIn: 'root'
})
export class RecipeService{

    recipesChanged = new Subject<Recipe[]>();
    recipeSelected = new EventEmitter<Recipe>();
    
    private  recipes : Recipe[] = [
        // new Recipe('A Test Recipe 1',
        // 'Very Tasty 1',
        // 'https://www.tasteofhome.com/wp-content/uploads/2018/01/Colcannon-Potatoes_EXPS_SDFM18_29291_D10_03_1b-696x696.jpg',
        // [
        //     new Ingredient('Maggie ',1),
        //     new Ingredient('Bread',2)
        // ]),
        // new Recipe('A Test Recipe 2',
        // 'Very Tasty 2',
        // 'https://www.tasteofhome.com/wp-content/uploads/2018/01/Colcannon-Potatoes_EXPS_SDFM18_29291_D10_03_1b-696x696.jpg',
        // [
        //     new Ingredient('Peanut butter',1),
        //     new Ingredient('Egg',2)
        // ])
   ];

   constructor(private slService : ShoppingListService){}

   getRecipes(){
       return this.recipes.slice();
   }

   getRecipe(index : number){
       return this.recipes[index];
   }

   addIngredient(newRecipe : Recipe){
       this.recipes.push(newRecipe);
       this.recipesChanged.next(this.recipes);
   }

   updateIngredient(index : number ,newRecipe : Recipe){
       this.recipes[index] = newRecipe;
       this.recipesChanged.next(this.recipes);
   }

   onAddToShoppingList(ingredients : Ingredient[]){
       this.slService.addRecipeIngredients(ingredients);
   }

   deleteRecipe(index : number){
       this.recipes.splice(index,1);
       this.recipesChanged.next(this.recipes);
   }

   setRecipes(recipes : Recipe[]){
       this.recipes = recipes;
       this.recipesChanged.next(this.recipes.slice());
   }
}