import { Logger, NotFoundException } from "@nestjs/common";
import { AbstractEntity } from "./abstract.entity";
import { EntityManager, FindOptionsRelations, FindOptionsWhere, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export abstract class AbstractRepository<T extends AbstractEntity<T>>  {
        protected abstract readonly logger: Logger


       constructor(protected readonly entityRepository: Repository<T>,
        private readonly entityManager: EntityManager
 
       ) {

        }


        async create(entity: T): Promise<T> {
            return this.entityManager.save(entity);
        }


        async findOne(where: FindOptionsWhere<T>, relations?: FindOptionsRelations<T>): Promise<T> {

            const entity = await this.entityRepository.findOne({ where, relations });
            if(!entity){
                this.logger.warn(`entity not found with filter ${JSON.stringify(where)}`)
                throw new NotFoundException(`entity not found with filter ${JSON.stringify(where)}`)
            }
            return entity;

        }


        async findOneAndUpdate(where: FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>   ){
            
            
            const updateResult = await this.entityRepository.update(where, partialEntity);

            if(!updateResult.affected){
                this.logger.warn(`entity not found with filter ${JSON.stringify(where)}`)
                throw new NotFoundException(`entity not found with filter ${JSON.stringify(where)}`)
            }
            return this.findOne(where);  ;
        }




        async find(where: FindOptionsWhere<T>): Promise<T[]>  {

            return this.entityRepository.find({ where });
        }


        async findOneAndDelete(where: FindOptionsWhere<T> ){

            return this.entityRepository.delete(where)
           
        }
}