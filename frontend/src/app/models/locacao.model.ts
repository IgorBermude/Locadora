import { Cliente } from './cliente.model';
import { ItemDTO } from './itemDTO.model';

export interface Locacao {
  idLocacao?: number;
  clienteId: number;
  itemId: number;
  dataLocacao: string;
  dataDevolucao: string;

  dataDevolucaoEfetiva?: string; // Para saber se já foi devolvido
  valorCobrado?: number;         // Valor da locação
  multaCobrada?: number;

  cliente?: Cliente;
  item?: ItemDTO;
}