import { LED } from '../models/index.js';
import Crosswalk from '../models/Crosswalk.js';

// Get all LEDs
export const getAllLEDs = async () => {
  return await LED.find().sort({ createdAt: -1 });
};

// Get LED by ID
export const getLEDById = async (id) => {
  const led = await LED.findById(id);
  if (!led) {
    throw new Error('LED not found');
  }
  return led;
};

// Create new LED
export const createLED = async (ledData) => {
  const led = await LED.create(ledData);
  return led;
};

// Delete LED
export const deleteLED = async (id) => {
  // Check if LED is linked to any crosswalk
  const linkedCrosswalk = await Crosswalk.findOne({ ledId: id });
  if (linkedCrosswalk) {
    throw new Error('Cannot delete LED linked to crosswalk');
  }

  const led = await LED.findByIdAndDelete(id);
  if (!led) {
    throw new Error('LED not found');
  }
  return led;
};
