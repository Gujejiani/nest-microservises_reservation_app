import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository, UserEntity } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";



@Injectable()
export class UsersRepository extends AbstractRepository<UserEntity>  {
      logger = new Logger(UsersRepository.name) as any;



    constructor(@InjectRepository(UserEntity) userRepository: Repository<UserEntity>, entityManager: EntityManager) {
        super(userRepository, entityManager)
    }


}