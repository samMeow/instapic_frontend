import APIFetcher from '../APIFetcher';

interface Global {
  fetch: jest.Mock<Promise<Response>>;
}
declare const global: Global;

describe('APIFetcher', () => {
  const baseURL = 'https://whatever.com';
  const fetchRef = global.fetch;
  beforeAll(() => {
    global.fetch = jest.fn();
  });
  beforeEach(() => {
    jest.useFakeTimers();
    global.fetch.mockReset();
  });
  afterEach(() => {
    jest.runAllTimers();
  });
  afterAll(() => {
    global.fetch = fetchRef;
  });
  it('should fetch get request correctly', () => {
    const NormalFetcher = new APIFetcher({ baseURL });
    global.fetch.mockResolvedValue(new Response('Normal Get'));
    NormalFetcher.get('/normal_get', { a: 1, b: 'b' });

    expect(global.fetch).toHaveBeenCalledWith(`${baseURL}/normal_get?a=1&b=b`, {
      method: 'GET',
      headers: {},
      signal: new AbortController().signal,
    });
  });
  it('should fetch get json request correctly', () => {
    const JsonFetcher = new APIFetcher({ baseURL });
    global.fetch.mockResolvedValue(new Response('Json Get'));
    JsonFetcher.json().get('/json_get', { a: 1, b: 'b' });
    expect(global.fetch).toHaveBeenCalledWith(`${baseURL}/json_get?a=1&b=b`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: new AbortController().signal,
    });
  });
  it('should fetch post json request correctly', () => {
    const JsonFetcher = new APIFetcher({ baseURL });
    global.fetch.mockResolvedValue(new Response('Json Post'));
    JsonFetcher.json().post('/json_post', { a: 1, b: ['b'] });
    expect(global.fetch).toHaveBeenCalledWith(`${baseURL}/json_post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{"a":1,"b":["b"]}',
      signal: new AbortController().signal,
    });
  });
  it('should throw response if it response if bad request', async () => {
    const JsonFetcher = new APIFetcher({ baseURL });
    const notFound = new Response('Not Found', { status: 404 });
    global.fetch.mockResolvedValue(notFound);
    const response = JsonFetcher.json().post('/json_post', { a: 1, b: ['b'] });
    try {
      await response;
    } catch (e) {
      expect(e.message).toEqual('API response not ok');
      expect(e.response).toEqual(notFound);
    }
  });

  it('should post formData correctly', async () => {
    const b = new File(['b'], 'b.txt', { type: 'text/plain' });
    const formFetcher = new APIFetcher({ baseURL });
    global.fetch.mockResolvedValue(new Response('Form post'));
    formFetcher.form().post('/form_post', {
      a: 1,
      b,
    });
    expect(global.fetch).toHaveBeenCalledWith(
      `${baseURL}/form_post`,
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      }),
    );
    const formData = global.fetch.mock.calls[0][1].body;
    expect(formData.get('a')).toEqual('1');
    expect(formData.get('b')).toBeInstanceOf(File);
  });
});
