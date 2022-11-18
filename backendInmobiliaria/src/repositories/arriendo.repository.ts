import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Arriendo, ArriendoRelations} from '../models';

export class ArriendoRepository extends DefaultCrudRepository<
  Arriendo,
  typeof Arriendo.prototype.id,
  ArriendoRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Arriendo, dataSource);
  }
}
