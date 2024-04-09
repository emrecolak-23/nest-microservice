import { ping } from 'tcp-ping';

describe('Health', () => {
  test('Reservations', async () => {
    const response = await fetch('http://reservations:3004/');
    expect(response.ok).toBeTruthy();
  });

  test('Auth', async () => {
    const response = await fetch('http://auth:3003/');
    expect(response.ok).toBeTruthy();
  });

  test('Payments', (done) => {
    ping({ address: 'payments', port: 3001 }, (err) => {
      if (err) {
        fail();
      }

      done();
    });
  });

  test('Notifications', (done) => {
    ping({ address: 'notifications', port: 3000 }, (err) => {
      if (err) {
        fail();
      }

      done();
    });
  });
});
