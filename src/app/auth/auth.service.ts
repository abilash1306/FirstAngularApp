import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

export interface AuthResponseData{
  localId : string,
  email : string,
  idToken : string,
  refreshToken : string,
  expiresIn: string,
  registered?: boolean
}

@Injectable({providedIn : 'root'})
export class AuthService{
    userSub = new BehaviorSubject<User>(null);
    expirationTimer:any;
    constructor(private http : HttpClient,private router:Router){}

    onSignUp(email : string,password : string){
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+environment.firebaseApiKey,
            {
                email : email,
                password : password,
                returnSecureToken : true
            }
        ).pipe(catchError(this.handleError),
             tap(resData =>{
                 this.handleAuthentication(resData.email,resData.localId,resData.idToken,resData.expiresIn);
             }));
    }

    login(email:string,password:string){
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+environment.firebaseApiKey,
            {
                email : email,
                password : password,
                returnSecureToken : true
            }
        ).pipe(catchError(this.handleError),
        tap(resData =>{
            this.handleAuthentication(resData.email,resData.localId,resData.idToken,resData.expiresIn);
        }));
    }

    logout(){
        this.userSub.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.expirationTimer){
            clearTimeout(this.expirationTimer);
        }
        this.expirationTimer=null;
    }

    autoLogin(){
        const userData: {email:string,id:string,_token:string,_tokenExpirationDate:string} = JSON.parse(localStorage.getItem('userData'));

        const loadedUser = new User(userData.email,userData.id,userData._token,new Date(userData._tokenExpirationDate));

        if(!loadedUser.token)
        {
            return;
        }
        this.userSub.next(loadedUser);
        const timerCheck= new Date(userData._tokenExpirationDate).getTime()-new Date().getTime();
        this.autoLogout(timerCheck);
    }

    autoLogout(expirationTime : number){
        this.expirationTimer = setTimeout(()=>{
            this.logout();
        },expirationTime)
    }

    private handleAuthentication(email:string,id:string,token:string,expiresIn:String){
        const expirationDate = new Date(new Date().getTime()+ +expiresIn*1000);
        const user = new User(email,id,token,expirationDate);
        this.userSub.next(user);
        this.autoLogout(+expiresIn*1000)
        localStorage.setItem('userData',JSON.stringify(user));
    }

    private handleError(errorResponse : HttpErrorResponse){
        let errorMessage = "An Unknown Error Occurred!"
            if(!errorResponse.error || !errorResponse.error.error)
                return throwError(errorMessage);

            switch(errorResponse.error.error.message){
                case "EMAIL_EXISTS" :
                   errorMessage = "Email already exists. Use a different email"
                   break;
                case "EMAIL_NOT_FOUND":
                    errorMessage = "Email is not present";
                    break;
                case "INVALID_PASSWORD":
                    errorMessage = "Password is incorrect";
            }
            return throwError(errorMessage);
    }
}