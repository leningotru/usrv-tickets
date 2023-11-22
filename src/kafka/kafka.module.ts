import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TICKET-SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'ticket',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'ticket-consumer',
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
