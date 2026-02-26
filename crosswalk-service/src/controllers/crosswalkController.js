import Crosswalk from '../models/Crosswalk.js';
import LEDControlService from '../services/ledControlService.js';

/**
 * Crosswalk Controllers - Handle crosswalk management
 */

/**
 * @route   GET /api/crosswalks
 * @desc    Get all crosswalks
 * @access  Public
 */
export const getCrosswalks = async (req, res) => {
  try {
    const { city, isActive, hasLEDSystem } = req.query;
    
    // Build query
    const query = {};
    if (city) query['location.city'] = city;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (hasLEDSystem !== undefined) query['details.hasLEDWarningSystem'] = hasLEDSystem === 'true';
    
    const crosswalks = await Crosswalk.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: crosswalks.length,
      data: crosswalks
    });
  } catch (error) {
    console.error('❌ Error fetching crosswalks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crosswalks',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/crosswalks/:id
 * @desc    Get a single crosswalk by ID
 * @access  Public
 */
export const getCrosswalkById = async (req, res) => {
  try {
    const crosswalk = await Crosswalk.findById(req.params.id);
    
    if (!crosswalk) {
      return res.status(404).json({
        success: false,
        message: 'Crosswalk not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: crosswalk
    });
  } catch (error) {
    console.error('❌ Error fetching crosswalk:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crosswalk',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/crosswalks
 * @desc    Create a new crosswalk
 * @access  Public
 */
export const createCrosswalk = async (req, res) => {
  try {
    const crosswalk = await Crosswalk.create(req.body);
    
    console.log('✅ New crosswalk created:', crosswalk.name);
    
    res.status(201).json({
      success: true,
      message: 'Crosswalk created successfully',
      data: crosswalk
    });
  } catch (error) {
    console.error('❌ Error creating crosswalk:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create crosswalk',
      error: error.message
    });
  }
};

/**
 * @route   PATCH /api/crosswalks/:id
 * @desc    Update a crosswalk
 * @access  Public
 */
export const updateCrosswalk = async (req, res) => {
  try {
    const crosswalk = await Crosswalk.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!crosswalk) {
      return res.status(404).json({
        success: false,
        message: 'Crosswalk not found'
      });
    }
    
    console.log('✅ Crosswalk updated:', crosswalk.name);
    
    res.status(200).json({
      success: true,
      message: 'Crosswalk updated successfully',
      data: crosswalk
    });
  } catch (error) {
    console.error('❌ Error updating crosswalk:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update crosswalk',
      error: error.message
    });
  }
};

/**
 * @route   DELETE /api/crosswalks/:id
 * @desc    Delete a crosswalk
 * @access  Public
 */
export const deleteCrosswalk = async (req, res) => {
  try {
    const crosswalk = await Crosswalk.findByIdAndDelete(req.params.id);
    
    if (!crosswalk) {
      return res.status(404).json({
        success: false,
        message: 'Crosswalk not found'
      });
    }
    
    console.log('🗑️ Crosswalk deleted:', crosswalk.name);
    
    res.status(200).json({
      success: true,
      message: 'Crosswalk deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('❌ Error deleting crosswalk:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete crosswalk',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/crosswalks/:id/led/activate
 * @desc    Manually activate LED system for a crosswalk
 * @access  Public
 */
export const activateLED = async (req, res) => {
  try {
    const { pattern = 'warning', duration } = req.body;
    
    const result = await LEDControlService.activateLEDs(
      req.params.id,
      pattern,
      { manual: true, duration }
    );
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'LED system activated',
        data: result
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        data: result
      });
    }
  } catch (error) {
    console.error('❌ Error activating LED:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to activate LED system',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/crosswalks/:id/led/deactivate
 * @desc    Manually deactivate LED system for a crosswalk
 * @access  Public
 */
export const deactivateLED = async (req, res) => {
  try {
    const result = await LEDControlService.deactivateLEDs(req.params.id);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'LED system deactivated',
        data: result
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        data: result
      });
    }
  } catch (error) {
    console.error('❌ Error deactivating LED:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate LED system',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/crosswalks/:id/led/status
 * @desc    Get LED system status for a crosswalk
 * @access  Public
 */
export const getLEDStatus = async (req, res) => {
  try {
    const result = await LEDControlService.getLEDStatus(req.params.id);
    
    res.status(200).json({
      success: result.success,
      data: result
    });
  } catch (error) {
    console.error('❌ Error getting LED status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get LED status',
      error: error.message
    });
  }
};

export default {
  getCrosswalks,
  getCrosswalkById,
  createCrosswalk,
  updateCrosswalk,
  deleteCrosswalk,
  activateLED,
  deactivateLED,
  getLEDStatus
};
