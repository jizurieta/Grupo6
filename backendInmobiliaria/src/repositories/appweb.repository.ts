import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Appweb, AppwebRelations, Propietario, Cliente, Asesor} from '../models';
import {PropietarioRepository} from './propietario.repository';
import {ClienteRepository} from './cliente.repository';
import {AsesorRepository} from './asesor.repository';

export class AppwebRepository extends DefaultCrudRepository<
  Appweb,
  typeof Appweb.prototype.id,
  AppwebRelations
> {

  public readonly propietarios: HasManyRepositoryFactory<Propietario, typeof Appweb.prototype.id>;

  public readonly clientes: HasManyRepositoryFactory<Cliente, typeof Appweb.prototype.id>;

  public readonly asesores: HasManyRepositoryFactory<Asesor, typeof Appweb.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('PropietarioRepository') protected propietarioRepositoryGetter: Getter<PropietarioRepository>, @repository.getter('ClienteRepository') protected clienteRepositoryGetter: Getter<ClienteRepository>, @repository.getter('AsesorRepository') protected asesorRepositoryGetter: Getter<AsesorRepository>,
  ) {
    super(Appweb, dataSource);
    this.asesores = this.createHasManyRepositoryFactoryFor('asesores', asesorRepositoryGetter,);
    this.registerInclusionResolver('asesores', this.asesores.inclusionResolver);
    this.clientes = this.createHasManyRepositoryFactoryFor('clientes', clienteRepositoryGetter,);
    this.registerInclusionResolver('clientes', this.clientes.inclusionResolver);
    this.propietarios = this.createHasManyRepositoryFactoryFor('propietarios', propietarioRepositoryGetter,);
    this.registerInclusionResolver('propietarios', this.propietarios.inclusionResolver);
  }
}
