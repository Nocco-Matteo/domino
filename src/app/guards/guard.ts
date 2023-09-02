import { inject } from "@angular/core"
import { PartitaService } from "../services/partita.service"
import { Router } from "@angular/router"

export const authguard = () => { 
    const partitaService = inject(PartitaService)
    const router = inject(Router)
    
    if(!partitaService.redirectInizio){
        router.navigate(['/inizio'])
    }

    return partitaService.redirectInizio;
}