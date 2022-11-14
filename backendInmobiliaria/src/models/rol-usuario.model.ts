import {Entity, model, property} from '@loopback/repository';

@model()
export class RolUsuario extends Entity {
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
  idUsuario: string;

  @property({
    type: 'string',
    required: true,
  })
  idRol: string;

  @property({
    type: 'string',
  })
  usuarioId?: string;

  @property({
    type: 'string',
  })
  rolId?: string;

  constructor(data?: Partial<RolUsuario>) {
    super(data);
  }
}

export interface RolUsuarioRelations {
  // describe navigational properties here
}

export type RolUsuarioWithRelations = RolUsuario & RolUsuarioRelations;
