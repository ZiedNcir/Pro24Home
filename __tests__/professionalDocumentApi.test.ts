let mockDefinitions: any;
jest.mock('../src/store/api/baseApi', () => ({ api: { injectEndpoints: (options: any) => {
    mockDefinitions = options.endpoints({ query: (value: any) => value, mutation: (value: any) => value });
    return { endpoints: mockDefinitions };
} } }));
require('../src/store/api/endpoints/pro');

test('sends a professional document using the documented upload route and fields', () => {
    const request = mockDefinitions.uploadDocument.query({ file: { uri: 'file:///test.pdf', type: 'application/pdf', name: 'test.pdf' }, type: 'pdf', name: 'rib' });
    expect(request.url).toBe('/api/professional/upload-document');
    expect(request.method).toBe('POST');
    expect(request.body.get('name')).toBe('rib');
    expect(request.body.get('type')).toBe('pdf');
    expect(request.body.has('file')).toBe(true);
    expect(request.validateStatus({ status: 200 }, { success: false })).toBe(false);
    expect(mockDefinitions.uploadDocument.extraOptions.maxRetries).toBe(0);
});
