import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AUTH_SERVICE, LoggerModuleCommon } from '@app/common';
import { GraphQLModule } from '@nestjs/graphql';
import {ApolloGatewayDriver, ApolloGatewayDriverConfig} from '@nestjs/apollo'
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { authContext } from './auth.context';
@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      useFactory: async (configService: ConfigService) => ({
          server: {
            context: authContext
          },
          gateway: {
            supergraphSdl: new IntrospectAndCompose({
              subgraphs: [
              {
                name: 'reservations',
                url: configService.getOrThrow('RESERVATIONS_GRAPHQL_URL')
              } 
              ]
            }),
            buildService({url}) {
              return new RemoteGraphQLDataSource({
                url,
                willSendRequest({request, context}) {
                  request.http.headers.set(
                    'user', 
                    context.user ? JSON.stringify(context.user) : null);
                }
              })
            }
          }
      }),
      inject: [ConfigService]
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow('AUTH_HOST'),
            port: configService.getOrThrow('AUTH_TCP_PORT')
          }
        }),
        inject: [ConfigService]

      }
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
       
    }),
    LoggerModuleCommon
  ],
  controllers: [],
  providers: [],
  
})
export class GatewayModule {}
