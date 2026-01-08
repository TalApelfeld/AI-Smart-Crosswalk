import { useState } from 'react';
import { PageHeader } from '../components/layout';
import { Card, Badge, LoadingScreen } from '../components/ui';
import { StatsCard } from '../components/alerts';
import { useCrosswalks } from '../hooks';

function CrosswalkCard({ crosswalk }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
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
      </div>
    </Card>
  );
}

export function Crosswalks() {
  const { crosswalks, stats, loading, error } = useCrosswalks();

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
    <div>
      <PageHeader
        title="Crosswalks"
        description="View all crosswalk locations and their connected devices"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-8">
        <StatsCard
          title="Total Crosswalks"
          value={stats.total}
          icon="🚦"
          color="primary"
        />
      </div>

      {/* Crosswalks List */}
      {crosswalks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <span className="text-5xl mb-4 block">🚦</span>
          <h3 className="text-xl font-semibold text-surface-900">No Crosswalks</h3>
          <p className="text-surface-500 mt-2">
            No crosswalks configured in the system yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {crosswalks.map((crosswalk) => (
            <CrosswalkCard
              key={crosswalk._id}
              crosswalk={crosswalk}
            />
          ))}
        </div>
      )}
    </div>
  );
}
