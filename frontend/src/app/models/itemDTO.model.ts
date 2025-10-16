export interface ItemDTO {
  numeroSerie: string;
  tipoItem: string;
  dataAquisicao: string; // ou Date, dependendo de como você processa
  tituloId: number;       // referência ao título
  idItem?: number;
}