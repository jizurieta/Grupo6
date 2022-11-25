import {Entity, model, property, hasMany} from '@loopback/repository';
import {Rol} from './rol.model';
import {RolUsuario} from './rol-usuario.model';
import {Propietario} from './propietario.model';
import {Cliente} from './cliente.model';
import {Asesor} from './asesor.model';

@model()
export class Usuario extends Entity {
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
  nombre: string; //usuario: string;

  @property({
    type: 'string',
    required: true,
  })
  correo: string;

  @property({
    type: 'string',
    required: true,
  })
  telefono: string; //celular: string;

  @property({
    type: 'string',
    required: false,
  })
  clave?: string;

  @property({
    type: 'string',
    required: false, // false, opcional
  })
  perfil?: string; //perfil?: string; opcional

  @hasMany(() => Rol, {through: {model: () => RolUsuario}})
  roles: Rol[];

  @hasMany(() => Propietario)
  propietarios: Propietario[];

  @hasMany(() => Cliente)
  clientes: Cliente[];

  @hasMany(() => Asesor)
  asesores: Asesor[];

  @hasMany(() => Rol, {through: {model: () => RolUsuario}})
  rolUsuario: Rol[];

  @hasMany(() => Rol, {through: {model: () => RolUsuario}})
  rols: Rol[];

  constructor(data?: Partial<Usuario>) {
    super(data);
  }
}

export interface UsuarioRelations {
  // describe navigational properties here
}

export type UsuarioWithRelations = Usuario & UsuarioRelations;
