import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take,exhaustMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{

    constructor(private autheService:AuthService){}

    intercept(req:HttpRequest<any>,handle:HttpHandler){
        return this.autheService.userSub.pipe(
            take(1),
            exhaustMap(user=>{
                if(!user){
                    return handle.handle(req);
                }
                const modifiedReq = req.clone({params:new HttpParams().set('auth',user.token)});
                return handle.handle(modifiedReq);
            })
        )
    }
}