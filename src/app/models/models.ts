
export interface Tessera {
  parteSinistra: number;
  parteDestra: number;
  element?: HTMLElement | undefined;
  invertita: boolean;
  uguali: boolean;
  isLimitSinistro: Limit;
  isLimitDestro: Limit;
}

export interface Limit {
  primo: boolean, secondo: boolean
}
export interface Estremo {
  indice: number;
  parte: number;
}

export interface Immagine{
  immagine : string;
}

