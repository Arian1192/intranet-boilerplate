import { AppLayout } from '@/components/layout';
import type { User } from '@/types';

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'Admin',
};

export default function App() {
  return (
    <AppLayout user={mockUser}>
      <div className="text-slate-600">Layout works</div>
    </AppLayout>
  );
}
