import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import {  ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
// import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    // MongooseModule.forRootAsync({
    //   // imports: [ConfigModule,],
    //   useFactory: (configService: ConfigService) => ({
    //     uri: configService.get('MONGODB_URI'),
    //   }),
    //   inject: [ConfigService],

    // }),

    TypeOrmModule.forRootAsync({
         useFactory: (configService: ConfigService) => ({
          type: 'mysql',
          host: configService.getOrThrow('MYSQL_HOST'),
          port: configService.getOrThrow('MYSQL_PORT'),
          database: configService.getOrThrow('MYSQL_DATABASE'),
          username: configService.getOrThrow('MYSQL_USERNAME'),
          password: configService.getOrThrow('MYSQL_PASSWORD'),
          synchronize:  configService.getOrThrow('MYSQL_SYNCHRONIZE'),
          autoLoadEntities: true,
        }),
        inject: [ConfigService],

    })
  ],
})
export class DatabaseModule {
    // static forFeature(models: ModelDefinition[]){
    //     return MongooseModule.forFeature(models)
    // }
    static forFeature(entities: EntityClassOrSchema[]){
        return TypeOrmModule.forFeature(entities)
    }
}
