import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit,OnDestroy {
  isLoginMode = false;
  isLoading = false;
  error : string = null;
  @ViewChild(PlaceholderDirective,{static:false}) appHost:PlaceholderDirective;
  closeSub :Subscription;

  constructor(private authService : AuthService,private router:Router,private cfResolver:ComponentFactoryResolver) { }

  ngOnInit(): void {
  }
   
   onSwitchMode(){
        this.isLoginMode = !this.isLoginMode;
   }

   onSubmit(form : NgForm){
     if(!form.valid){
       return ;
     }
     this.isLoading=true;
     const email = form.value.email;
     const password = form.value.password;

     let authObs: Observable<AuthResponseData>;
     if(this.isLoginMode){
      authObs = this.authService.login(email,password);
     }
     else{
      authObs= this.authService.onSignUp(email,password)
     }

     authObs.subscribe(response=>{
      console.log(response);
      this.isLoading=false;
      this.error=null;  
      this.router.navigate(['/recipes']);
    },
    errorMessage=>{
      this.isLoading = false;
      console.log(errorMessage);
      this.error = errorMessage;
      this.onShowAlert(errorMessage);
    });
     form.reset();
   }

   onAlertClose(){
     this.error=null;
   }

   private onShowAlert(message){
      const alertComRef = this.cfResolver.resolveComponentFactory(AlertComponent);
      const vcRef = this.appHost.vcReg;
      vcRef.clear();

      let componentRef= vcRef.createComponent(alertComRef);
      componentRef.instance.message=message;
      this.closeSub= componentRef.instance.close.subscribe(()=>{
        this.closeSub.unsubscribe();
        vcRef.clear();
      })
   }

   ngOnDestroy(): void {
       if(this.closeSub){
         this.closeSub.unsubscribe();
       }
   }
}
