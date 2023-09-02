import { trigger, transition, style, animate, state, keyframes } from "@angular/animations";

export const AGGIUNTA_ANIMATION = trigger('entryAnimation', [
  transition(':enter', [
    style({ transform: 'translateY(-50px)', opacity: 0 }), // Posizione iniziale dell'elemento fuori dalla vista
    animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'translateY(0)', opacity: 1 })) // Animazione di entrata
  ]),

])

export const USCITA_ANIMATION = trigger('leaveAnimation', [
  transition(':leave', [
    style({ transform: 'translateY(0)', opacity: 1 }), // Posizione iniziale dell'elemento fuori dalla vista
    animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'translateY(30px)', opacity: 0 })) // Animazione di entrata
  ]),
])

export const GROWL_ANIMATION = trigger('growlAnimation', [
  state('hidden', style({ transform: 'translate(-50%, -150%)', opacity: 0 })),
  transition(':leave', animate('400ms ease-out')),
  transition(':enter', animate('400ms cubic-bezier(.17,.67,.83,.67)', keyframes([

    style({ transform: 'translate(0, 0)', opacity: 1, offset: 1 })
  ]))),
]);
export const LANDSCAPE_ANIMATION = trigger('landscapeAnimation', [
  state('fermo', style({ transform: 'rotate(0deg)' })),
  state('gira', style({ transform: 'rotate(90deg)' })),
  transition('fermo=>gira', animate('0.9s ease-out',keyframes([
    style({ offset: 0, transform : 'rotate(0)'}),
    style({ offset: 0.8, transform : 'rotate(100deg)'}),
    style({ offset: 1, transform : 'rotate(90deg)'})
  ]))),
  transition('gira=>fermo', animate('0.2s')),

])

export const DROP_CARD_ANIMATION = trigger('dropPossibility', [
  transition(':enter',animate('')) 
]) 

export const ZOOM_ANIMATION = trigger('zoom', [
  state('zoomOut', style({
    transform: 'scale(1)',
  })),
  state('zoomIn', style({
    transform: 'scale(1.3)',  // Aumentato da 1.1 a 1.3
  })),
  transition('zoomOut <=> zoomIn', [
    animate('1s ease-in-out')
  ])
])

export const PESCA_PASSA_ANIMATION = trigger('pescaEPassa', [
  state('Pesca', style({backgroundColor: '#ffd700'})),
  state('Passa', style({backgroundColor: 'blue'})),
  transition('*=>Pesca',animate('0.2s')),
  transition('Pesca=>Passa',animate('0.2s')),
])