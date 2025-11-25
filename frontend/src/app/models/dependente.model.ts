import { Cliente } from './cliente.model';

export interface Dependente extends Cliente {
  socioId: number;
  clienteId?: number;
}
