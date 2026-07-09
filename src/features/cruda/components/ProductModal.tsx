import { Modal } from '@/components/ui';

export function ProductModal({ open, onClose }: { open: boolean; productId: string | null; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Producto">
      <div />
    </Modal>
  );
}
