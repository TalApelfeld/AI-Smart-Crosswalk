import { GenericFormDialog } from '../ui';

export function LEDDialog({ isOpen, onClose, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({});
  };

  return (
    <GenericFormDialog
      open={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Add New LED System"
      submitText="Create LED System"
      description="A new LED system will be created and ready to be linked to a crosswalk."
    />
  );
}


