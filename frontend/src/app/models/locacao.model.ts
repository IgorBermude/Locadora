export interface Locacao {
  idLocacao?: number;
  clienteId: number;
  itemId: number;
  dataLocacao: string;          // YYYY-MM-DD
  dataDevolucao: string;        // previsão ou real
}
