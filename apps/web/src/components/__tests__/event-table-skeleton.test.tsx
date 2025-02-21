import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventTableSkeleton from '../skeleton/events-table-skeleton';

test('renders skeleton table', () => {
  render(<EventTableSkeleton title="Loading Transfer Events..." />);

  expect(screen.getByText('Loading Transfer Events...')).toBeInTheDocument();
  expect(screen.getAllByRole('row').length).toBe(6);
});
