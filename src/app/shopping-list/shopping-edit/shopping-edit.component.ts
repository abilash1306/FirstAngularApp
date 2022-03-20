import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from '../../shared/ingredients.model';
import { ShoppingListService } from '../shopping-list.service';
@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  
  @ViewChild('f',{static : false}) slForm : NgForm;
  subscription : Subscription;
  editMode = false;
  editItenIndex : number;
  editItem : Ingredient

  constructor(private slService : ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.slService.startedEditing.subscribe(
      (index : number)=>{
            this.editItenIndex = index;
            this.editMode = true;
            this.editItem = this.slService.getIngredient(index);
            this.slForm.setValue({
                 name : this.editItem.name,
                 amount : this.editItem.amount
            });
      }
    );
  }

  onAddButton(form : NgForm){
    const value = form.value;
    const ingredient = new Ingredient(value.name,value.amount);
    if(this.editMode){
      this.slService.updateIngredient(this.editItenIndex,ingredient);
    }
    else
     this.slService.addIngredient(ingredient);
     this.editMode = false;
     form.reset();
  }

  onClear(){
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete(){
    this.slService.deleteIngredient(this.editItenIndex);
    this.onClear();
  }

}
