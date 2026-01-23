import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout';
import { Card, Badge, LoadingScreen, Button, ConfirmDialog, useToast } from '../components/ui';
import { StatsCard } from '../components/alerts';
import { CrosswalkFormDialog, CrosswalkEditDialog } from '../components/crosswalks';
import { useCrosswalks, useCameras, useLEDs } from '../hooks';

function CrosswalkCard({ crosswalk, onEdit, onDelete, onClick }) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚦</span>
            <div>
              <h3 className="font-semibold text-surface-900">
                {crosswalk.location?.city || 'Unknown City'}
              </h3>
              <p className="text-sm text-surface-500">
                {crosswalk.location?.street} {crosswalk.location?.number}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-surface-500">Camera ID:</span>
              <span className="ml-2 font-medium font-mono">
                {crosswalk.cameraId?._id?.slice(-8) || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-surface-500">LED ID:</span>
              <span className="ml-2 font-medium font-mono">
                {crosswalk.ledId?._id?.slice(-8) || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-surface-500">Camera Status:</span>
              <Badge 
                variant={crosswalk.cameraId?.status === 'active' ? 'success' : 'default'}
                className="ml-2"
              >
                {crosswalk.cameraId?.status || 'N/A'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(crosswalk)}
          >
            ✏️ Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(crosswalk)}
          >
            🗑️ Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function Crosswalks() {
  const navigate = useNavigate();
  const { 
    crosswalks, 
    stats, 
    loading, 
    error,
    createCrosswalk,
    updateCrosswalk,
    deleteCrosswalk,
    linkCamera,
    unlinkCamera,
    linkLED,
    unlinkLED,
    refetch
  } = useCrosswalks();
  
  const { cameras, createCamera, refetch: refetchCameras } = useCameras();
  const { leds, createLED, refetch: refetchLEDs } = useLEDs();
  const { addToast } = useToast();

  const [formDialog, setFormDialog] = useState({ open: false, crosswalk: null });
  const [editDialog, setEditDialog] = useState({ open: false, crosswalk: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, crosswalk: null });
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // CRUD Handlers
  const handleCreate = () => {
    setFormDialog({ open: true, crosswalk: null });
  };

  const handleEdit = (crosswalk) => {
    setEditDialog({ open: true, crosswalk });
  };

  const handleDelete = (crosswalk) => {
    setDeleteDialog({ open: true, crosswalk });
  };

  const handleCrosswalkClick = (crosswalk) => {
    navigate(`/crosswalks/${crosswalk._id}`);
  };

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (formDialog.crosswalk) {
        await updateCrosswalk(formDialog.crosswalk._id, formData);
        addToast('Crosswalk updated successfully', 'success');
      } else {
        await createCrosswalk(formData);
        addToast('Crosswalk added successfully', 'success');
      }
      setFormDialog({ open: false, crosswalk: null });
    } catch (error) {
      addToast(error.message || 'Error saving crosswalk', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setSubmitting(true);
    try {
      await deleteCrosswalk(deleteDialog.crosswalk._id);
      addToast('Crosswalk deleted successfully', 'success');
      setDeleteDialog({ open: false, crosswalk: null });
    } catch (error) {
      addToast(error.message || 'Error deleting crosswalk', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Link/Unlink Handlers
  const handleUpdate = async (id, data) => {
    setSubmitting(true);
    try {
      await updateCrosswalk(id, data);
      addToast('Location updated successfully', 'success');
      refetch();
    } catch (error) {
      addToast(error.message || 'Error updating location', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLinkCamera = async (id, cameraId) => {
    setSubmitting(true);
    try {
      await linkCamera(id, cameraId);
      addToast('Camera linked successfully', 'success');
      refetch();
    } catch (error) {
      addToast(error.message || 'Error linking camera', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnlinkCamera = async (id) => {
    setSubmitting(true);
    try {
      await unlinkCamera(id);
      addToast('Camera unlinked successfully', 'success');
      refetch();
    } catch (error) {
      addToast(error.message || 'Error unlinking camera', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLinkLED = async (id, ledId) => {
    setSubmitting(true);
    try {
      await linkLED(id, ledId);
      addToast('LED linked successfully', 'success');
      refetch();
    } catch (error) {
      addToast(error.message || 'Error linking LED', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnlinkLED = async (id) => {
    setSubmitting(true);
    try {
      await unlinkLED(id);
      addToast('LED unlinked successfully', 'success');
      refetch();
    } catch (error) {
      addToast(error.message || 'Error unlinking LED', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCamera = async () => {
    setSubmitting(true);
    try {
      await createCamera({ status: 'active' });
      addToast('Camera created successfully', 'success');
      refetchCameras();
    } catch (error) {
      addToast(error.message || 'Error creating camera', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateLED = async () => {
    setSubmitting(true);
    try {
      await createLED({});
      addToast('LED created successfully', 'success');
      refetchLEDs();
    } catch (error) {
      addToast(error.message || 'Error creating LED', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter crosswalks by search query
  const filteredCrosswalks = crosswalks.filter(crosswalk => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      crosswalk.location?.city?.toLowerCase().includes(search) ||
      crosswalk.location?.street?.toLowerCase().includes(search) ||
      crosswalk.location?.number?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return <LoadingScreen message="Loading crosswalks..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-danger-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Crosswalks"
        description="View all crosswalk locations and their connected devices"
        actions={
          <Button variant="primary" onClick={handleCreate}>
            ➕ Add Crosswalk
          </Button>
        }
      />

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-lg">🔍</span>
          <h3 className="font-semibold text-gray-900">Search & Filter</h3>
        </div>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city, street, or number..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-sm text-gray-600 mt-2">
            Found {filteredCrosswalks.length} of {crosswalks.length} crosswalks
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
        <StatsCard
          title="Total Crosswalks"
          value={stats.total}
          icon="🚦"
          color="primary"
        />
      </div>

      {/* Crosswalks List */}
      {filteredCrosswalks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <span className="text-5xl mb-4 block">🚦</span>
          <h3 className="text-xl font-semibold text-surface-900">
            {searchQuery ? 'No Matching Crosswalks' : 'No Crosswalks'}
          </h3>
          <p className="text-surface-500 mt-2">
            {searchQuery 
              ? 'Try a different search term.'
              : 'No crosswalks configured in the system yet.'}
          </p>
          {searchQuery && (
            <Button onClick={() => setSearchQuery('')} className="mt-4" variant="outline">
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCrosswalks.map((crosswalk) => (
            <CrosswalkCard
              key={crosswalk._id}
              crosswalk={crosswalk}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onClick={() => handleCrosswalkClick(crosswalk)}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CrosswalkFormDialog
        open={formDialog.open}
        onClose={() => setFormDialog({ open: false, crosswalk: null })}
        onSubmit={handleFormSubmit}
        crosswalk={formDialog.crosswalk}
        cameras={cameras}
        leds={leds}
        loading={submitting}
      />

      <CrosswalkEditDialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, crosswalk: null })}
        crosswalk={editDialog.crosswalk}
        cameras={cameras}
        leds={leds}
        onUpdate={handleUpdate}
        onLinkCamera={handleLinkCamera}
        onUnlinkCamera={handleUnlinkCamera}
        onLinkLED={handleLinkLED}
        onUnlinkLED={handleUnlinkLED}
        onCreateCamera={handleCreateCamera}
        onCreateLED={handleCreateLED}
        loading={submitting}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, crosswalk: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Crosswalk"
        message={`Are you sure you want to delete the crosswalk at ${deleteDialog.crosswalk?.location?.city}, ${deleteDialog.crosswalk?.location?.street}?`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={submitting}
      />
    </div>
  );
}
