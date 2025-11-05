import { Cliente } from './cliente.model';

export interface Socio extends Cliente {
  idSocio?: number;         // caso o back envie
  cpf?: string;
  tel?: string;
  dependenteIds?: number[];
}
