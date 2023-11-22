import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateTicketInput } from './dto/create-ticket.input';
import {
  CategoryEnum,
  PriorityEnum,
  StatusEnum,
} from './infraestructure/ValidationEnum';
import { UpdateTicketInput } from './dto/update-ticket.input';


describe('TicketsService', () => {
  let service: TicketsService;
  let ticketRepository: Repository<Ticket>;

  const mockClientKafka = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: getRepositoryToken(Ticket),
          useClass: Repository,
        },
        {
          provide: 'TICKET-SERVICE', // Make sure this token is correctly provided
          useValue: mockClientKafka, // Mock or provide the actual ClientKafka instance
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    ticketRepository = module.get<Repository<Ticket>>(
      getRepositoryToken(Ticket),
    );
  });

  describe('create', () => {
    it('should create a ticket successfully', async () => {
      const createTicketInput: CreateTicketInput = {
        title: 'Test',
        description: 'Test',
        priority: PriorityEnum.HIGH,
        category: CategoryEnum.ERROR,
        status: StatusEnum.PENDING,
      };

      const createdTicket: Ticket = {
        id: '900b4808-87f6-11ee-b9d1-0242ac120002',
        title: 'Test',
        description: 'Test',
        priority: PriorityEnum.HIGH,
        category: CategoryEnum.ERROR,
        status: StatusEnum.PENDING,
      };

      jest.spyOn(ticketRepository, 'save').mockResolvedValueOnce(createdTicket);
      jest
        .spyOn(service['ticketClientKafka'], 'emit')
        .mockImplementationOnce(() => null);

      const result = await service.create(createTicketInput);

      expect(ticketRepository.save).toHaveBeenCalledWith(createTicketInput);
      expect(service['ticketClientKafka'].emit).toHaveBeenCalledWith(
        'ticket_created',
        expect.any(String),
      );
      expect(result).toEqual(createdTicket);
    });

    it('should throw BadRequestException when creating a ticket', async () => {
      const createTicketInput: CreateTicketInput = {
        title: 'Test',
        description: 'Test',
        priority: PriorityEnum.HIGH,
        category: CategoryEnum.ERROR,
        status: StatusEnum.PENDING,
      };

      jest.spyOn(ticketRepository, 'save').mockResolvedValueOnce({} as Ticket);
      jest
        .spyOn(service['ticketClientKafka'], 'emit')
        .mockImplementationOnce(() => null);

      await expect(service.create(createTicketInput)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when failed to create a ticket', async () => {
      const createTicketInput: CreateTicketInput = {
        title: 'Test',
        description: 'Test',
        priority: PriorityEnum.HIGH,
        category: CategoryEnum.ERROR,
        status: StatusEnum.PENDING,
      };

      jest
        .spyOn(ticketRepository, 'save')
        .mockRejectedValueOnce(new Error('Test error'));

      await expect(service.create(createTicketInput)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should fetch all tickets successfully', async () => {
      const tickets: Ticket[] = [
        {
          id: '900b4808-87f6-11ee-b9d1-0242ac120002',
          title: 'Test',
          description: 'Test',
          priority: PriorityEnum.HIGH,
          category: CategoryEnum.ERROR,
          status: StatusEnum.PENDING,
        },
        {
          id: '962ec9b2-87f6-11ee-b9d1-0242ac120002',
          title: 'Test 2',
          description: 'Test 2',
          priority: PriorityEnum.MEDIUM,
          category: CategoryEnum.ERROR,
          status: StatusEnum.VERIFIED,
        },
        {
          id: '9a3e7ef8-87f6-11ee-b9d1-0242ac120002',
          title: 'Test 3',
          description: 'Test 3',
          priority: PriorityEnum.LOW,
          category: CategoryEnum.ERROR,
          status: StatusEnum.REJECTED,
        },
      ];

      jest.spyOn(ticketRepository, 'find').mockResolvedValueOnce(tickets);

      const result = await service.findAll();

      expect(ticketRepository.find).toHaveBeenCalled();
      expect(result).toEqual(tickets);
    });

    it('should throw BadRequestException when failed to fetch tickets', async () => {
      jest
        .spyOn(ticketRepository, 'find')
        .mockRejectedValueOnce(new Error('Test error'));

      await expect(service.findAll()).rejects.toThrowError(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should fetch a ticket by id successfully', async () => {
      const ticketId = '900b4808-87f6-11ee-b9d1-0242ac120002';

      const foundTicket: Ticket = {
        id: '900b4808-87f6-11ee-b9d1-0242ac120002',
        title: 'Test',
        description: 'Test',
        priority: PriorityEnum.HIGH,
        category: CategoryEnum.ERROR,
        status: StatusEnum.PENDING,
      };
      jest
        .spyOn(ticketRepository, 'findOneBy')
        .mockResolvedValueOnce(foundTicket);

      const result = await service.findOne(ticketId);

      expect(ticketRepository.findOneBy).toHaveBeenCalledWith({ id: ticketId });
      expect(result).toEqual(foundTicket);
    });

    it('should throw NotFoundException when the ticket with the provided id is not found', async () => {
      const ticketId = 'non-existing-id';
      jest
        .spyOn(ticketRepository, 'findOneBy')
        .mockResolvedValueOnce(undefined);

      await expect(service.findOne(ticketId)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when failed to fetch a ticket by id', async () => {
      const ticketId = 'test-id';
      jest
        .spyOn(ticketRepository, 'findOneBy')
        .mockRejectedValueOnce(new Error('Test error'));

      await expect(service.findOne(ticketId)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update a ticket successfully', async () => {
      const ticketId = '900b4808-87f6-11ee-b9d1-0242ac120002';
      const updateTicketInput: UpdateTicketInput = {
        id: '900b4808-87f6-11ee-b9d1-0242ac120002',
        title: 'Test',
        description: 'Test',
        priority: PriorityEnum.HIGH,
        category: CategoryEnum.ERROR,
        status: StatusEnum.PENDING,
      };
      const mockUpdateResult = { affected: 1 } as UpdateResult;
      jest
        .spyOn(ticketRepository, 'update')
        .mockResolvedValueOnce(mockUpdateResult);

      const result = await service.update(ticketId, updateTicketInput);

      expect(ticketRepository.update).toHaveBeenCalledWith(
        ticketId,
        updateTicketInput,
      );
      expect(result).toEqual('Update successful');
    });

    it('should throw NotFoundException when the ticket with the provided id is not found during update', async () => {
      const ticketId = 'non-existing-id';
      const updateTicketInput: UpdateTicketInput = {
        id: '900b4808-87f6-11ee-b9d1-0242ac120002',
        title: 'Test',
        description: 'Test',
        priority: PriorityEnum.HIGH,
        category: CategoryEnum.ERROR,
        status: StatusEnum.PENDING,
      };
      const mockUpdateResult = { affected: 0 } as UpdateResult;
      jest
        .spyOn(ticketRepository, 'update')
        .mockResolvedValueOnce(mockUpdateResult);

      await expect(
        service.update(ticketId, updateTicketInput),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw BadRequestException when failed to update a ticket', async () => {
      const ticketId = '900b4808-87f6-11ee-b9d1-0242ac120002';
      const updateTicketInput: UpdateTicketInput = {
        id: '900b4808-87f6-11ee-b9d1-0242ac120002',
        title: 'Test',
        description: 'Test',
        priority: PriorityEnum.HIGH,
        category: CategoryEnum.ERROR,
        status: StatusEnum.PENDING,
      };
      jest
        .spyOn(ticketRepository, 'update')
        .mockRejectedValueOnce(new Error('Test error'));

      await expect(
        service.update(ticketId, updateTicketInput),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequestException when a duplicate entry violation occurs during update', async () => {
      const ticketId = '900b4808-87f6-11ee-b9d1-0242ac120002';
      const updateTicketInput: UpdateTicketInput = {
        id: '900b4808-87f6-11ee-b9d1-0242ac120002',
        title: 'Test',
        description: 'Test',
        priority: PriorityEnum.HIGH,
        category: CategoryEnum.ERROR,
        status: StatusEnum.PENDING,
      };
      const duplicateEntryError = { code: '23505' };
      jest
        .spyOn(ticketRepository, 'update')
        .mockRejectedValueOnce(duplicateEntryError);

      await expect(
        service.update(ticketId, updateTicketInput),
      ).rejects.toThrowError(BadRequestException);
    });
  });
});
