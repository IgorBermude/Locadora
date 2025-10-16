import { Classe } from './classe.model';
import { Diretor } from './diretor.model';

export interface Titulo {
  idTitulo?: number;
  nome: string;
  classe?: Classe;
  diretor?: Diretor;
}
