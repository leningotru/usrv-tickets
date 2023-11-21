import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateTicketInput } from './dto/create-ticket.input';
import { SearchTicketInput } from './dto/search-ticket.input';
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

  findMany(searchTicketInput: SearchTicketInput) {
    try {
      const queryBuilder: SelectQueryBuilder<Ticket> = this.ticketRepository.createQueryBuilder('ticket');
      if (searchTicketInput.priority) {
        const priorityValues: string[] = searchTicketInput.priority.split('|').map(value => value.trim());
        queryBuilder.andWhere('ticket.priority IN (:...priorityValues)', { priorityValues });
      }

      if (searchTicketInput.category){
        const categoriesValues: string[] = searchTicketInput.category.split('|').map(value => value.trim());
        queryBuilder.andWhere('ticket.category IN (:...categoriesValues)', { categoriesValues });
      }
        
      if (searchTicketInput.status) {
        const statusValues: string[] = searchTicketInput.status.split('|').map(value => value.trim());
        queryBuilder.andWhere('ticket.status IN (:...statusValues)', { statusValues });
      }

      queryBuilder.skip(searchTicketInput.skip).take(searchTicketInput.limit);
      return queryBuilder.getMany();
    } catch (error) {
      // TODO: return errors validation
      console.log(error)
    }
  }
}
