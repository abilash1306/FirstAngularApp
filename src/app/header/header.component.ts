import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
    selector : 'app-header',
    templateUrl : './header.component.html'
})
export class HeaderComponent implements OnInit,OnDestroy{
    isAuthenticated = false;
    userSubsc : Subscription;

    constructor(private dataStorgaeService : DataStorageService,private authService: AuthService){}

    ngOnInit(){
        this.userSubsc = this.authService.userSub.subscribe(user=>{
            this.isAuthenticated = !!user;
        })
    }

    onSaveData(){
          this.dataStorgaeService.storeRecipes();
    }

    onFetchData(){
        this.dataStorgaeService.fetchRecipes().subscribe();
    }

    logout(){
        this.authService.logout();
    }

    ngOnDestroy(){
        if(this.userSubsc){
            this.userSubsc.unsubscribe();
        }
    }
}