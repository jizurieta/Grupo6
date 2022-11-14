import {Entity, model, property} from '@loopback/repository';

@model()
export class Appweb extends Entity {
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
  nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  descripcion: string;


  constructor(data?: Partial<Appweb>) {
    super(data);
  }
}

export interface AppwebRelations {
  // describe navigational properties here
}

export type AppwebWithRelations = Appweb & AppwebRelations;
