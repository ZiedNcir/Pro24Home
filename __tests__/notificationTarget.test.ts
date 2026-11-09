import { getNotificationInterventionId } from '../src/core/notifications/notification-target';

test.each([
    [{ intervention_id: 24 }, 24],
    [{ intervention_id: '25' }, 25],
    [{ data: { intervention_id: 26 } }, 26],
    [{ data: { intervention_id: '27' } }, 27],
    [{ data: '{"intervention_id":28}' }, 28],
])('reads the intervention identified by the message: %j', (message, expected) => {
    expect(getNotificationInterventionId(message)).toBe(expected);
});
test.each([undefined, null, {}, { intervention_id: 0 }, { intervention_id: -1 }, { intervention_id: true }, { intervention_id: 1.5 }, { intervention_id: 'invalid' }, { data: '{broken' }])('does not invent a target for an invalid message: %j', message => {
    expect(getNotificationInterventionId(message)).toBeUndefined();
});
