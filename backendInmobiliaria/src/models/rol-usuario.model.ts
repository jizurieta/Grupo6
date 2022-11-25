import {Entity, model, property} from '@loopback/repository';

@model()
export class RolUsuario extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  //Solo se crea la propiedad id porque este modelo
  //maneja las relaciones; las otras propiedades
  //se generan al momento de generar las relaciones
  id?: string;

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
