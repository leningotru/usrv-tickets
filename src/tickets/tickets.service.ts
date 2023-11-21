import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { CreateTicketInput } from './dto/create-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { Ticket } from './entities/ticket.entity';
import { SearchTicketInput } from './dto/search-ticket.input';

@Injectable()
export class TicketsService {

  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) { }

  async create(createTicketInput: CreateTicketInput): Promise<Ticket> {
    try {
      return await this.ticketRepository.save(createTicketInput);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Ticket with the provided data already exists.');
      }
      throw new BadRequestException('Failed to create a ticket.');
    }
  }

  async findAll(): Promise<Ticket[]> {
    try {
      return await this.ticketRepository.find();
    } catch (error) {
      throw new BadRequestException('Failed to fetch tickets.');
    }
  }

  async findOne(id: string): Promise<Ticket> {
    try {
      const ticket = await this.ticketRepository.findOneBy({ id });
      if (!ticket) {
        throw new NotFoundException(`Ticket with id ${id} not found.`);
      }
      return ticket;
    } catch (error) {
      throw new BadRequestException(`Failed to fetch ticket with id ${id}.`);
    }
  }

  async update(id: string, updateTicketInput: UpdateTicketInput): Promise<string> {
    try {
      const updateResult: UpdateResult = await this.ticketRepository.update(id, updateTicketInput);

      if (updateResult.affected > 0) {
        return 'Update successful';
      } else {
        throw new NotFoundException(`Ticket with id ${id} not found.`);
      }
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Ticket with the provided data already exists.');
      }
      throw new BadRequestException(`Failed to update ticket with id ${id}.`);
    }
  }

  async findMany(searchTicketInput: SearchTicketInput) {
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
      throw new BadRequestException('Failed to search tickets.');
    }
  }
}