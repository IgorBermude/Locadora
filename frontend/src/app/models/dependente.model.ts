import { Cliente } from './cliente.model';

export interface Dependente extends Cliente {
  idDependente?: number;
  socioId: number;
}
