import {Entity, model, property} from '@loopback/repository';

@model()
export class Venta extends Entity {
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
  fechaVenta: string;

  @property({
    type: 'number',
    required: true,
  })
  valorVenta: number;

  @property({
    type: 'number',
    required: true,
  })
  comision: number;

  @property({
    type: 'string',
  })
  inmuebleId?: string;

  constructor(data?: Partial<Venta>) {
    super(data);
  }
}

export interface VentaRelations {
  // describe navigational properties here
}

export type VentaWithRelations = Venta & VentaRelations;
