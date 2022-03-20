import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AlertComponent } from "./alert/alert.component";
import { DropdownDirective } from "./dropdown.directive";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { PlaceholderDirective } from "./placeholder/placeholder.directive";

@NgModule({
    declarations:[
        AlertComponent,
        DropdownDirective,
        PlaceholderDirective,
        LoadingSpinnerComponent
    ],
    imports:[CommonModule],
    exports:[
        AlertComponent,
        DropdownDirective,
        PlaceholderDirective,
        LoadingSpinnerComponent,
        CommonModule
    ],
    entryComponents:[
        AlertComponent//this isnotrequired for Angular Version > 8 background  engine IVY takes care for it
    ]
})
export class SharedModule{

}