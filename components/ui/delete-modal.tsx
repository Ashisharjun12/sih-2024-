import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteModalProps {
  isOpen: boolean;
  formId: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteModal({ isOpen, formId, onClose, onConfirm }: DeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this form submission? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
            >
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 