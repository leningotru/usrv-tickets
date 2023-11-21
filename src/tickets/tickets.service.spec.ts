import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { TicketsService } from './tickets.service';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketInput } from './dto/create-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';

describe('TicketsService', () => {
  let service: TicketsService;
  let repository: Repository<Ticket>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: getRepositoryToken(Ticket),
          useClass: Repository<Ticket>,
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    repository = module.get<Repository<Ticket>>(getRepositoryToken(Ticket));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

/*
  describe('create', () => {
    it('should create a ticket', async () => {
      const createTicketInput: CreateTicketInput = {title: 'Test',description:'Test',priority:'high',category:'error' ,status:'J' };
  
      const createdTicket: Ticket = {...createTicketInput, id:'900b4808-87f6-11ee-b9d1-0242ac120002', status: StatusEnum.PENDING };
      
      const mockApiSpy = jest.spyOn( 'axios').mockResolvedValue(mockStatus);
  

      jest.spyOn(repository, 'save').mockResolvedValue(createdTicket);

      const result = await service.create(createTicketInput);

      expect(repository.save).toHaveBeenCalledWith(createTicketInput);
      expect(result).toEqual(createdTicket);
    });
  });
  







  describe('create 2', () => {
    it('should create a ticket with PENDING status', async () => {
      const createTicketInput: CreateTicketInput = {title: 'Test',description:'Test',priority:'high',category:'error' ,status:'pending' };

      const categoryValue = CategoryMapping[createTicketInput.category as CategoryEnum];
      const mockStatus:dataMock = { id: categoryValue, code:400  };
      //const mockCall=(mockApi as jest.Mock).mockResolvedValue(mockStatus);

      await service.create(createTicketInput);

      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
        ...createTicketInput,
        status: StatusEnum.PENDING,
        // Ensure other properties match your expectations...
      }));
      //expect(mockCall).toHaveBeenCalledWith(mockStatus)
    });

   
    it('should call mockApi with the correct category value', async () => {
      const createTicketInput: CreateTicketInput = {
        // Define your input data here...
      };

      const categoryValue = CategoryMapping[createTicketInput.category as CategoryEnum];
      const mockStatus = { id: 1, name: 'Active' };
      (mockApi as jest.Mock).mockResolvedValue(mockStatus);

      await service.create(createTicketInput);

      expect(mockApi).toHaveBeenCalledWith(categoryValue);
    });

    it('should handle errors and throw BadRequestException', async () => {
      const createTicketInput: CreateTicketInput = {
        // Define your input data here...
      };

      const categoryValue = CategoryMapping[createTicketInput.category as CategoryEnum];
      (mockApi as jest.Mock).mockRejectedValue(new Error('Some error'));

      await expect(service.create(createTicketInput)).rejects.toThrowError(
        'Failed to create a ticket.'
      );
    });
  });*/




  describe('findAll', () => {
    it('should return an array of tickets', async () => {
      const tickets: Ticket[] = [
        {id:'900b4808-87f6-11ee-b9d1-0242ac120002',title: 'Test',description:'Test',priority:'high',category:'error' ,status:'pending' },
        {id:'962ec9b2-87f6-11ee-b9d1-0242ac120002',title: 'Test 2',description:'Test 2',priority:'medium',category:'error' ,status:'verified' },
        {id:'9a3e7ef8-87f6-11ee-b9d1-0242ac120002',title: 'Test 3',description:'Test 3',priority:'low',category:'error' ,status:'rejected' }
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(tickets);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(tickets);
    });
  });

  describe('findOne', () => {
    it('should return a single ticket', async () => {
      const ticketId = '900b4808-87f6-11ee-b9d1-0242ac120002';
  
      const foundTicket: Ticket = {
        id:'900b4808-87f6-11ee-b9d1-0242ac120002',title: 'Test',description:'Test',priority:'high',category:'error' ,status:'pending'
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(foundTicket);

      const result = await service.findOne(ticketId);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: ticketId });
      expect(result).toMatchObject(foundTicket);
    });
  });

  describe('update', () => {
    it('should update a ticket', async () => {
      const ticketId = 'some-id';
      const updateTicketInput: UpdateTicketInput = {
        id:'900b4808-87f6-11ee-b9d1-0242ac120002',title: 'Test',description:'Test',priority:'high',category:'error' ,status:'pending'
      };

      const mockUpdateResult: UpdateResult = {
        raw: {}, 
        affected: 1,
        generatedMaps: [], 
      };
  
      jest.spyOn(repository, 'update').mockResolvedValue(mockUpdateResult);
  
      const result = await service.update(ticketId, updateTicketInput);
  
      expect(repository.update).toHaveBeenCalledWith(ticketId, updateTicketInput);
      expect(result).toEqual('Update successful');
    });

    it('should handle update failure', async () => {
      const ticketId = 'non-existing-id';
      const updateTicketInput: UpdateTicketInput = {
        id:'900b4808-87f6-11ee-b9d1-0242ac120002',title: 'Test',description:'Test',priority:'high',category:'error' ,status:'pending'
      };
  
      const mockUpdateResult: UpdateResult = {
        raw: {},
        affected: 0,
        generatedMaps: [],
      };
  
      jest.spyOn(repository, 'update').mockResolvedValue(mockUpdateResult);
  
      await expect(service.update(ticketId, updateTicketInput)).rejects.toThrowError('Failed to update ticket with id non-existing-id.');
    });
  });

});