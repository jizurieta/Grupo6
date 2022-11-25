import {Entity, model, property, hasMany} from '@loopback/repository';
import {Inmueble} from './inmueble.model';

@model()
export class Asesor extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: false, //true
  })
  cedula?: string; //cedula: string; opcional

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  correo: string; //apellido: string;

  @property({
    type: 'string',
    required: true,
  })
  telefono: string;

  @property({
    type: 'string',
    required: false, // true
  })
  direccion?: string; //direccion: string; opcional

  @property({
    type: 'string',
    required: false,
  })
  clave?: string;

  @property({
    type: 'string',
    required: false,
  })
  perfil?: string;

  @property({
    type: 'string',
    required: false, //true
  })
  estadoDecision?: string; //estadoDecision: string; opcional

  @property({
    type: 'string',
  })
  comentario?: string;

  @hasMany(() => Inmueble)
  inmuebles: Inmueble[];

  @property({
    type: 'string',
  })
  appwebId?: string;

  @property({
    type: 'string',
  })
  usuarioId?: string;

  constructor(data?: Partial<Asesor>) {
    super(data);
  }
}

export interface AsesorRelations {
  // describe navigational properties here
}

export type AsesorWithRelations = Asesor & AsesorRelations;
