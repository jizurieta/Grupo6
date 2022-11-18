import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Inmueble, InmuebleRelations, Solicitud, Arriendo, Venta} from '../models';
import {SolicitudRepository} from './solicitud.repository';
import {ArriendoRepository} from './arriendo.repository';
import {VentaRepository} from './venta.repository';

export class InmuebleRepository extends DefaultCrudRepository<
  Inmueble,
  typeof Inmueble.prototype.id,
  InmuebleRelations
> {

  public readonly solicituds: HasManyRepositoryFactory<Solicitud, typeof Inmueble.prototype.id>;

  public readonly arriendos: HasManyRepositoryFactory<Arriendo, typeof Inmueble.prototype.id>;

  public readonly ventas: HasManyRepositoryFactory<Venta, typeof Inmueble.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('SolicitudRepository') protected solicitudRepositoryGetter: Getter<SolicitudRepository>, @repository.getter('ArriendoRepository') protected arriendoRepositoryGetter: Getter<ArriendoRepository>, @repository.getter('VentaRepository') protected ventaRepositoryGetter: Getter<VentaRepository>,
  ) {
    super(Inmueble, dataSource);
    this.ventas = this.createHasManyRepositoryFactoryFor('ventas', ventaRepositoryGetter,);
    this.registerInclusionResolver('ventas', this.ventas.inclusionResolver);
    this.arriendos = this.createHasManyRepositoryFactoryFor('arriendos', arriendoRepositoryGetter,);
    this.registerInclusionResolver('arriendos', this.arriendos.inclusionResolver);
    this.solicituds = this.createHasManyRepositoryFactoryFor('solicituds', solicitudRepositoryGetter,);
    this.registerInclusionResolver('solicituds', this.solicituds.inclusionResolver);
  }
}
