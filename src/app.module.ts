import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'square-knight-12733.7tt.cockroachlabs.cloud',
      port: 26257,
      username: 'lenin',
      password: 'pekow3Mt8KsNg-pIgl_MSg',
      database: 'test',
      //synchronize: true,
      logging: true,
      ssl: true,
      autoLoadEntities: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), "src/schema.gql")
  }), TicketsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
