import { normalizeAddressesResponse } from '../src/store/api/response.utils';

const addresses = [{ id: 1, address: '10 Rue de la Paix' }];

describe('normalizeAddressesResponse', () => {
    it('returns an array from the API data envelope', () => {
        expect(normalizeAddressesResponse({ data: { data: addresses } })).toEqual(addresses);
    });

    it('returns an array from an address key used by the client API', () => {
        expect(normalizeAddressesResponse({ data: { address: addresses } })).toEqual(addresses);
    });

    it('unwraps nested address pagination envelopes', () => {
        expect(normalizeAddressesResponse({ data: { addresses: { data: addresses } } })).toEqual(addresses);
    });

    it('finds address records in a result/items envelope', () => {
        expect(normalizeAddressesResponse({ result: { items: addresses } })).toEqual(addresses);
    });

    it('wraps a single address record in an array', () => {
        expect(normalizeAddressesResponse(addresses[0])).toEqual(addresses);
    });

    it('returns an empty array for an unexpected response shape', () => {
        expect(normalizeAddressesResponse({ message: 'No addresses' })).toEqual([]);
    });
});
