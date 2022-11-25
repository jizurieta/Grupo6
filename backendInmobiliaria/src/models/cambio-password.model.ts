import {Model, model, property} from '@loopback/repository';

@model()
export class CambioPassword extends Model {
  @property({
    type: 'string',
    required: true,
  })
  passActual: string;

  @property({
    type: 'string',
    required: true,
  })
  passNuevo: string;

  @property({
    type: 'string',
    required: true,
  })
  passValidado: string;


  constructor(data?: Partial<CambioPassword>) {
    super(data);
  }
}

export interface CambioPasswordRelations {
  // describe navigational properties here
}

export type CambioPasswordWithRelations = CambioPassword & CambioPasswordRelations;
