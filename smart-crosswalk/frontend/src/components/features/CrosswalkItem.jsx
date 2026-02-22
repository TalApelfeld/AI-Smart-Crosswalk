import { memo } from 'react';
import { Badge, GenericDetailCard } from '../ui';
import { formatId, formatLocation, formatStatus } from '../../utils';

function CrosswalkItemComponent({ item: crosswalk, onEdit, onDelete, onClick }) {
  const cameraStatus = formatStatus(crosswalk.cameraId?.status);

  return (
    <GenericDetailCard
      onClick={() => onClick?.(crosswalk)}
      header={{
        icon: '🚦',
        title: crosswalk.location?.city || 'Unknown City',
        subtitle: formatLocation(crosswalk.location)
      }}
      fields={[
        { label: 'Camera ID', value: formatId(crosswalk.cameraId?._id) },
        { label: 'LED ID',    value: formatId(crosswalk.ledId?._id) },
        {
          label: 'Camera Status',
          component: (
            <Badge variant={cameraStatus.variant}>{cameraStatus.text}</Badge>
          )
        }
      ]}
      actions={[
        { label: '✏️ Edit',   variant: 'ghost',  onClick: (e) => { e.stopPropagation(); onEdit(crosswalk); } },
        { label: '🗑️ Delete', variant: 'danger', onClick: (e) => { e.stopPropagation(); onDelete(crosswalk); } }
      ]}
    />
  );
}

export const CrosswalkItem = memo(CrosswalkItemComponent);


