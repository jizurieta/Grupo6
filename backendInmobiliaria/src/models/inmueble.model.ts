import {Entity, model, property, hasMany} from '@loopback/repository';
import {Solicitud} from './solicitud.model';
import {Arriendo} from './arriendo.model';
import {Venta} from './venta.model';

@model()
export class Inmueble extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  encargado: string;

  @property({
    type: 'string',
    required: true,
  })
  contactoEncargado: string;

  @property({
    type: 'date',
    required: true,
  })
  fechaApertura: string;

  @property({
    type: 'string',
    required: true,
  })
  direccion: string;

  @property({
    type: 'string',
    required: true,
  })
  tipoOferta: string;

  @property({
    type: 'string',
    required: true,
  })
  tipoInmueble: string;

  @property({
    type: 'string',
    required: true,
  })
  estado: string;

  @property({
    type: 'number',
    required: true,
  })
  precio: number;

  @property({
    type: 'number',
    required: true,
  })
  porcentajeComision: number;

  @property({
    type: 'string',
  })
  observaciones?: string;

  @property({
    type: 'string',
    required: true,
  })
  foto: object;

  @property({
    type: 'string',
  })
  ciudadId?: string;

  @hasMany(() => Solicitud)
  solicituds: Solicitud[];

  @hasMany(() => Arriendo)
  arriendos: Arriendo[];

  @hasMany(() => Venta)
  ventas: Venta[];

  @property({
    type: 'string',
  })
  propietarioId?: string;

  @property({
    type: 'string',
  })
  clienteId?: string;

  @property({
    type: 'string',
  })
  asesorId?: string;

  constructor(data?: Partial<Inmueble>) {
    super(data);
  }
}

export interface InmuebleRelations {
  // describe navigational properties here
}

export type InmuebleWithRelations = Inmueble & InmuebleRelations;
