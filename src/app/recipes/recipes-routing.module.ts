import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipesComponent } from "./recipes.component";
import { ResolveRecipeService } from "./resolve-recipe.service";

const recipesRoutes :Route[]=[
    {path : '',component  : RecipesComponent,canActivate :[AuthGuard],
    children : [
        {path : '',component : RecipeStartComponent},
        {path : 'new',component : RecipeEditComponent},
        {path : ':id',component : RecipeDetailComponent,resolve : [ResolveRecipeService]},
        {path : ':id/edit',component : RecipeEditComponent,resolve : [ResolveRecipeService]},
    ]}
];

@NgModule({
    imports:[
        RouterModule.forChild(recipesRoutes)
    ],
    exports:[
        RouterModule
    ]
})
export class RecipesRoutingModule{

}