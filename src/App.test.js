import { render, screen } from '@testing-library/react';
import App from './App';

test('renders chatbot heading', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', { name: /chatbot/i });
  expect(headingElement).toBeInTheDocument();
});
