import { trigger, transition, style, animate } from "@angular/animations";

export const AGGIUNTA_ANIMATION = trigger('entryAnimation', [
    transition(':enter', [
      style({ transform: 'translateY(-50px)', opacity: 0 }), // Posizione iniziale dell'elemento fuori dalla vista
      animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'translateY(0)', opacity: 1 })) // Animazione di entrata
    ])
  ])