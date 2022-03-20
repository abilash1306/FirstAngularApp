import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate{

    constructor(private authService:AuthService,private router:Router){}
    canActivate(routerSnapShot:ActivatedRouteSnapshot,state:RouterStateSnapshot):boolean
        |UrlTree
        |Promise<boolean| UrlTree>
        |  Observable<boolean| UrlTree>{
            return this.authService.userSub.pipe(map(user=>{
                const isAuth = !!user;
                if(isAuth)
                 return true;
                return this.router.createUrlTree(['/auth']);
            }))
        }
}