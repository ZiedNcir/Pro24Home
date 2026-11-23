import { useUpdateClientProfileMutation } from '../src/entities/user/api/user.api';
import { useGetServicesQuery } from '../src/entities/service/api/service.api';

test('exposes user and service APIs from their entities', () => {
  expect(useUpdateClientProfileMutation).toBeDefined();
  expect(useGetServicesQuery).toBeDefined();
});
