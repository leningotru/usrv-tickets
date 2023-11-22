import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { dataMock } from '../infraestructure/interface';
import { mockApi } from './api-utils';

jest.mock('axios');

describe('mockApi', () => {
  let axiosMock: MockAdapter;

  beforeEach(() => {
    axiosMock = new MockAdapter(axios);
  });

  afterEach(() => {
    axiosMock.restore();
  });

  it('should return data for a successful request', async () => {
    const id = 1;
    const mockResponse: dataMock = { id, code: 300 };

    axiosMock
      .onGet(`http://localhost:3000/api/v1/status/${id}`)
      .reply(200, mockResponse);

    const result = await mockApi(id);

    expect(result).toEqual(mockResponse);
  });

  it('should throw an error for a failed request', async () => {
    const id = 2;

    axiosMock.onGet(`http://localhost:3000/api/v1/status/${id}`).networkError();

    await expect(mockApi(id)).rejects.toThrowError(
      `Error fetching data for id #${id}`,
    );
  });
});
