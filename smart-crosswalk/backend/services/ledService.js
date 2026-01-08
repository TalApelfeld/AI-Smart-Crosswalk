import { LED } from '../models/index.js';

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
  const led = await LED.findByIdAndDelete(id);
  if (!led) {
    throw new Error('LED not found');
  }
  return led;
};
