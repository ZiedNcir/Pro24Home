import { prepareRegistrationPayload } from '../src/features/auth/services/registration';

describe('prepareRegistrationPayload', () => {
  it('rejects registration without a OneSignal subscription key', () => {
    expect(() => prepareRegistrationPayload({}, 'client', '')).toThrow(
      'OneSignal subscription key is required',
    );
  });
});
