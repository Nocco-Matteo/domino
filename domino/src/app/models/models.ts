export interface Tessera {
  parteSinistra: number;
  parteDestra: number;
  element?: HTMLElement | undefined;
  invertita : boolean;
  uguali : boolean;
}

export interface Estremo {
  indice: number;
  parte: number;
  
}
