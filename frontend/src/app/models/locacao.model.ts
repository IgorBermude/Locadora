import { Cliente } from './cliente.model';
import { ItemDTO } from './itemDTO.model';

export interface Locacao {
  idLocacao?: number;
  clienteId: number;
  itemId: number;
  dataLocacao: string;
  dataDevolucao: string;
  cliente?: Cliente;
  item?: ItemDTO;
}