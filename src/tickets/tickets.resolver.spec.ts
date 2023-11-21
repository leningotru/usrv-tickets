import { Test, TestingModule } from '@nestjs/testing';
import { TicketsResolver } from './tickets.resolver';
import { TicketsService } from './tickets.service';
import { CreateTicketInput } from './dto/create-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { Ticket } from './entities/ticket.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriorityEnum, CategoryEnum, StatusEnum } from './infraestructure/ValidationEnum';

describe('TicketsResolver', () => {
  let resolver: TicketsResolver;
  let service: TicketsService;
  let repository: Repository<Ticket>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketsResolver, TicketsService,
        {
          provide: getRepositoryToken(Ticket),
          useClass: Repository < Ticket >,
        }],
    }).compile();

    resolver = module.get<TicketsResolver>(TicketsResolver);
    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createTicket', () => {
    it('should create a ticket', async () => {
      const createTicketInput: CreateTicketInput = { title: 'Test', description: 'Test', priority: PriorityEnum.HIGH, category: CategoryEnum.ERROR, status: StatusEnum.PENDING };

      const createdTicket: Ticket = { id: '900b4808-87f6-11ee-b9d1-0242ac120002', title: 'Test', description: 'Test', priority: PriorityEnum.HIGH, category: CategoryEnum.ERROR, status: StatusEnum.PENDING };

      jest.spyOn(service, 'create').mockResolvedValue(createdTicket);

      const result = await resolver.createTicket(createTicketInput);

      expect(service.create).toHaveBeenCalledWith(createTicketInput);
      //expect(service.create).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject(createdTicket);
    });
  });

  describe('findAll', () => {
    it('should return an array of tickets', async () => {
      const tickets: Ticket[] = [
        { id: '900b4808-87f6-11ee-b9d1-0242ac120002', title: 'Test', description: 'Test', priority: 'high', category: 'error', status: 'pending' },
        { id: '962ec9b2-87f6-11ee-b9d1-0242ac120002', title: 'Test 2', description: 'Test 2', priority: 'medium', category: 'error', status: 'verified' },
        { id: '9a3e7ef8-87f6-11ee-b9d1-0242ac120002', title: 'Test 3', description: 'Test 3', priority: 'low', category: 'error', status: 'rejected' }
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(tickets);

      const result = await resolver.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(tickets);
    });
  });

  describe('findOne', () => {
    it('should return a single ticket', async () => {
      const ticketId = '900b4808-87f6-11ee-b9d1-0242ac120002';

      const foundTicket: Ticket = {
        id: '900b4808-87f6-11ee-b9d1-0242ac120002', title: 'Test', description: 'Test', priority: 'high', category: 'error', status: 'pending'
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(foundTicket);

      const result = await resolver.findOne(ticketId);

      expect(service.findOne).toHaveBeenCalledWith(ticketId);
      expect(result).toEqual(foundTicket);
    });
  });

  describe('updateTicket', () => {
    it('should update a ticket', async () => {
      const updateTicketInput: UpdateTicketInput = {
        id: '900b4808-87f6-11ee-b9d1-0242ac120002', title: 'Test', description: 'Test', priority: 'high', category: 'error', status: 'pending'
      };

      jest.spyOn(service, 'update').mockResolvedValue('Update successful');

      const result = await resolver.updateTicket(updateTicketInput);

      expect(service.update).toHaveBeenCalledWith(updateTicketInput.id, updateTicketInput);
      expect(result).toEqual('Update successful');
    });
  });

});