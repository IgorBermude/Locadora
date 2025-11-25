import { Cliente } from './cliente.model';
import { ItemDTO } from './itemDTO.model';

export interface Locacao {
  idLocacao?: number;
  dtLocacao: string;
  dtDevolucaoPrevista: string;
  dtDevolucaoEfetiva?: string;
  valorCobrado: number;
  multaCobrada?: number;
  cliente: Cliente; // Objeto completo
  item: ItemDTO;    // Objeto completo
}