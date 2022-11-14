import {Entity, model, property} from '@loopback/repository';

@model()
export class Solicitud extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
    required: true,
  })
  fechaSolicitud: string;

  @property({
    type: 'string',
    required: true,
  })
  tipoSolicitud: string;

  @property({
    type: 'string',
    required: true,
  })
  estadoSolicitud: string;

  @property({
    type: 'string',
  })
  inmuebleId?: string;

  constructor(data?: Partial<Solicitud>) {
    super(data);
  }
}

export interface SolicitudRelations {
  // describe navigational properties here
}

export type SolicitudWithRelations = Solicitud & SolicitudRelations;
