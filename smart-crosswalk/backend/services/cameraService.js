import { Camera } from '../models/index.js';
import Crosswalk from '../models/Crosswalk.js';

// Get all cameras
export const getAllCameras = async () => {
  return await Camera.find().sort({ createdAt: -1 });
};

// Get camera by ID
export const getCameraById = async (id) => {
  const camera = await Camera.findById(id);
  if (!camera) {
    throw new Error('Camera not found');
  }
  return camera;
};

// Create new camera
export const createCamera = async (cameraData) => {
  const camera = await Camera.create(cameraData);
  return camera;
};

// Update camera status
export const updateCameraStatus = async (id, status) => {
  const validStatuses = ['active', 'inactive', 'error'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid camera status');
  }

  const camera = await Camera.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  if (!camera) {
    throw new Error('Camera not found');
  }

  return camera;
};

// Update camera (general update)
export const updateCamera = async (id, data) => {
  const camera = await Camera.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  );

  if (!camera) {
    throw new Error('Camera not found');
  }

  return camera;
};

// Delete camera
export const deleteCamera = async (id) => {
  // Check if camera is linked to any crosswalk
  const linkedCrosswalk = await Crosswalk.findOne({ cameraId: id });
  if (linkedCrosswalk) {
    throw new Error('Cannot delete camera linked to crosswalk');
  }

  const camera = await Camera.findByIdAndDelete(id);
  if (!camera) {
    throw new Error('Camera not found');
  }
  return camera;
};
