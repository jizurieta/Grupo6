import {Entity, model, property} from '@loopback/repository';

@model()
export class Arriendo extends Entity {
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
  fechaInicio: string;

  @property({
    type: 'date',
    required: true,
  })
  fechaTerminacion: string;

  @property({
    type: 'date',
    required: true,
  })
  valorCanon: string;

  @property({
    type: 'number',
  })
  valorAdministracion?: number;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  coDeudor: string[];

  @property({
    type: 'string',
  })
  inmuebleId?: string;

  constructor(data?: Partial<Arriendo>) {
    super(data);
  }
}

export interface ArriendoRelations {
  // describe navigational properties here
}

export type ArriendoWithRelations = Arriendo & ArriendoRelations;
