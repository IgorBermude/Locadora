export interface Cliente {
  idCliente?: number;
  numInscricao: number;
  nome: string;
  dtNascimento: string;  // LocalDate -> string YYYY-MM-DD
  sexo: string;
  estahAtivo: boolean;
  locacaoIds?: number[]; // lista de ids das locações
}
