import { Cliente } from './cliente.model';

export interface Socio extends Cliente {
  cpf?: string;
  tel?: string;
  dependenteIds?: number[];
}
