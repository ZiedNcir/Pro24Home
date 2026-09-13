import { useGetProfileQuery } from '../src/entities/user/api/user.api';
import { useGetServicesQuery } from '../src/entities/service/api/service.api';

test('exposes profile and service queries from their entities', () => {
  expect(useGetProfileQuery).toBeDefined();
  expect(useGetServicesQuery).toBeDefined();
});
