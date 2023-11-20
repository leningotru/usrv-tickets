import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTicketInput } from './dto/create-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketsService {

  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>
  ) { }

  create(createTicketInput: CreateTicketInput) {
    try {
      return this.ticketRepository.save(createTicketInput);
    } catch (error) {
      // TODO: return errors validation
      console.log(error)
    }
  }

  findAll() {
    try {
      return this.ticketRepository.find();
    } catch (error) {
      // TODO: return errors validation
      console.log(error)
    }
  }

  findOne(id: string) {
    try {
      return this.ticketRepository.findOneBy({ id });
    } catch (error) {
      // TODO: return errors validation
      console.log(`This action returns a #${id} ticket`, error)
    }
  }

  async update(id: string, updateTicketInput: UpdateTicketInput): Promise<string> {
    try {
      const updateResult = await this.ticketRepository.update(id, updateTicketInput);
      console.log(updateResult);

      if ((updateResult).affected > 0) {
        return "Actualizacion OK";
      } else {
        throw new Error("La actualización falló");
      }

    } catch (error) {
      // TODO: return errors validation
      return error
    }
  }
}
