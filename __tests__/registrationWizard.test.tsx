import {
  createClientRegistrationSteps,
  createProfessionalRegistrationSteps,
} from '../src/features/auth/model/registration-steps';

test('shares the client registration foundation with professionals', () => {
  expect(createClientRegistrationSteps()).toHaveLength(2);
  expect(createProfessionalRegistrationSteps([])).toHaveLength(4);
});
