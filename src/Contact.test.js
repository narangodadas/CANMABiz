import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

const originalFetch = global.fetch;

function openAndFillContactForm() {
  render(<App />);
  fireEvent.click(screen.getByRole('link', { name: /let’s talk/i }));

  fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Test Customer' } });
  fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'customer@example.com' } });
  fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '+94761234567' } });
  fireEvent.change(screen.getByLabelText('Company'), { target: { value: 'Example Company' } });
  fireEvent.change(screen.getByLabelText('Service required *'), { target: { value: 'Business Solutions' } });
  fireEvent.change(screen.getByLabelText('Message *'), { target: { value: 'Please contact me about business support.' } });

  return screen.getByRole('button', { name: /prepare enquiry/i });
}

afterEach(() => {
  global.fetch = originalFetch;
});

test('sends the contact form to the API and clears it only after success', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true, message: 'Your enquiry has been sent successfully.' }),
  });
  const submitButton = openAndFillContactForm();

  fireEvent.click(submitButton);

  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Your enquiry has been sent successfully.'));
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenCalledWith('/api/contact', expect.objectContaining({
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  }));
  expect(JSON.parse(global.fetch.mock.calls[0][1].body)).toMatchObject({
    name: 'Test Customer',
    email: 'customer@example.com',
    phone: '+94761234567',
    company: 'Example Company',
    service: 'Business Solutions',
    message: 'Please contact me about business support.',
  });
  expect(screen.getByLabelText('Name *')).toHaveValue('');
  expect(screen.getByLabelText('Email *')).toHaveValue('');
  expect(screen.queryByText(/your email app/i)).not.toBeInTheDocument();
});

test('prevents duplicate requests and preserves values after failure so the customer can retry', async () => {
  let finishFirstRequest;
  global.fetch = jest.fn()
    .mockImplementationOnce(() => new Promise((resolve) => { finishFirstRequest = resolve; }))
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Your enquiry has been sent successfully.' }),
    });
  const submitButton = openAndFillContactForm();
  const form = submitButton.closest('form');

  fireEvent.submit(form);
  fireEvent.submit(form);

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(submitButton).toBeDisabled();
  expect(submitButton).toHaveTextContent('Sending enquiry...');

  finishFirstRequest({
    ok: false,
    json: async () => ({ message: 'We could not send your enquiry right now. Please try again shortly.' }),
  });
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('We could not send your enquiry'));

  expect(screen.getByLabelText('Name *')).toHaveValue('Test Customer');
  expect(screen.getByLabelText('Email *')).toHaveValue('customer@example.com');
  expect(submitButton).toBeEnabled();

  fireEvent.click(submitButton);
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Your enquiry has been sent successfully.'));
  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(screen.getByLabelText('Name *')).toHaveValue('');
});
