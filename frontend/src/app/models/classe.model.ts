export interface Classe {
  idClasse?: number;
  nome: string;
  valor: number; // BigDecimal do Java -> number no TS
  dataDevolucao: string; // LocalDate do Java -> string (YYYY-MM-DD)
}
