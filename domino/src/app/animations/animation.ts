import { trigger, transition, style, animate, state, keyframes } from "@angular/animations";

export const AGGIUNTA_ANIMATION = trigger('entryAnimation', [
    transition(':enter', [
      style({ transform: 'translateY(-50px)', opacity: 0 }), // Posizione iniziale dell'elemento fuori dalla vista
      animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'translateY(0)', opacity: 1 })) // Animazione di entrata
    ])
  ])

  export const GROWL_ANIMATION = trigger('growlAnimation', [
    state('hidden', style({ transform: 'translate(-50%, -150%)', opacity: 0 })),
    transition(':leave', animate('400ms ease-out')),
    transition(':enter', animate('400ms cubic-bezier(.17,.67,.83,.67)', keyframes([
     
      style({ transform: 'translate(0, 0)', opacity: 1, offset: 1 })
    ]))),
  ]);