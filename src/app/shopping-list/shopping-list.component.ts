import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscribable, Subscription } from 'rxjs';
import { Ingredient} from '../shared/ingredients.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit,OnDestroy {

  ingredients : Ingredient[];
  subscription : Subscription;

  constructor(private slService : ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.slService.getIngredients();
    this.subscription = this.slService.ingredientsChanged.subscribe(
      (ingredients : Ingredient[])=>{
        this.ingredients = ingredients;
      }
    );
  }

   onEdit(index : number){
     this.slService.startedEditing.next(index);
   }
   ngOnDestroy(){
     this.subscription.unsubscribe();
   }
}