import axios from 'axios';
import Crosswalk from '../models/Crosswalk.js';

/**
 * LED Control Service
 * 
 * Handles communication with LED warning systems at crosswalks
 * Sends commands to activate LED lights when alerts are triggered
 */

class LEDControlService {
  /**
   * Activate LED warning system for a specific crosswalk
   * 
   * @param {String} crosswalkId - Crosswalk MongoDB ID
   * @param {String} pattern - LED pattern to activate (warning, danger, safe)
   * @param {Object} alertData - Alert information
   * @returns {Object} Activation result
   */
  async activateLEDs(crosswalkId, pattern = 'warning', alertData = {}) {
    const startTime = Date.now(); // Add this line at the beginning
    
    try {
      const startTime = Date.now();
      
      // Get crosswalk details
      const crosswalk = await Crosswalk.findById(crosswalkId);
      
      if (!crosswalk) {
        throw new Error('Crosswalk not found');
      }
      
      if (!crosswalk.ledSystem || !crosswalk.ledSystem.controlUrl) {
        console.log(`⚠️ No LED system configured for crosswalk: ${crosswalk.name}`);
        return {
          success: false,
          message: 'LED system not configured',
          crosswalkName: crosswalk.name
        };
      }
      
      // Check if LED system is operational
      if (crosswalk.ledSystem.status !== 'operational') {
        console.log(`⚠️ LED system not operational for: ${crosswalk.name}`);
        return {
          success: false,
          message: `LED system status: ${crosswalk.ledSystem.status}`,
          crosswalkName: crosswalk.name
        };
      }
      
      // Get LED pattern configuration
      const patternConfig = crosswalk.ledSystem.patterns[pattern] || crosswalk.ledSystem.patterns.warning;
      
      // Prepare command payload
      const payload = {
        crosswalkId: crosswalk._id,
        pattern: pattern,
        color: patternConfig.color,
        flashRate: patternConfig.flashRate,
        duration: patternConfig.duration,
        alertType: alertData.type || 'unknown',
        severity: alertData.severity || 'medium',
        timestamp: new Date().toISOString()
      };
      
      // Add authentication if configured
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (crosswalk.ledSystem.authentication) {
        if (crosswalk.ledSystem.authentication.apiKey) {
          headers['X-API-Key'] = crosswalk.ledSystem.authentication.apiKey;
        }
        if (crosswalk.ledSystem.authentication.token) {
          headers['Authorization'] = `Bearer ${crosswalk.ledSystem.authentication.token}`;
        }
      }
      
      // Send command based on activation method
      let response;
      const controlUrl = crosswalk.ledSystem.controlUrl;
      
      switch (crosswalk.ledSystem.activationMethod) {
        case 'http_post':
          response = await axios.post(controlUrl, payload, { 
            headers,
            timeout: 5000 
          });
          break;
          
        case 'http_get':
          response = await axios.get(controlUrl, { 
            params: payload,
            headers,
            timeout: 5000 
          });
          break;
          
        case 'mqtt':
          // MQTT implementation would go here
          console.log('MQTT not yet implemented');
          return {
            success: false,
            message: 'MQTT method not yet implemented'
          };
          
        case 'websocket':
          // WebSocket implementation would go here
          console.log('WebSocket not yet implemented');
          return {
            success: false,
            message: 'WebSocket method not yet implemented'
          };
          
        default:
          throw new Error(`Unsupported activation method: ${crosswalk.ledSystem.activationMethod}`);
      }
      
      const responseTime = Date.now() - startTime;
      
      // Update last activation info
      await Crosswalk.findByIdAndUpdate(crosswalkId, {
        'ledSystem.lastActivation': {
          timestamp: new Date(),
          pattern: pattern,
          success: true,
          responseTime: responseTime
        }
      });
      
      console.log(`✅ LED activated successfully for ${crosswalk.name} (${pattern} pattern) - ${responseTime}ms`);
      
      return {
        success: true,
        message: 'LED system activated successfully',
        crosswalkName: crosswalk.name,
        pattern: pattern,
        responseTime: responseTime,
        ledResponse: response.data
      };
      
    } catch (error) {
      console.error('❌ Error activating LED system:', error.message);
      
      // Update failed activation
      if (crosswalkId) {
        await Crosswalk.findByIdAndUpdate(crosswalkId, {
          'ledSystem.lastActivation': {
            timestamp: new Date(),
            pattern: pattern,
            success: false,
            responseTime: Date.now() - startTime
          }
        }).catch(err => console.error('Failed to update last activation:', err));
      }
      
      return {
        success: false,
        message: error.message,
        error: error.response?.data || error.message
      };
    }
  }
  
  /**
   * Deactivate LED system (turn off)
   * 
   * @param {String} crosswalkId - Crosswalk MongoDB ID
   * @returns {Object} Deactivation result
   */
  static async deactivateLEDs(crosswalkId) {
    try {
      const crosswalk = await Crosswalk.findById(crosswalkId);
      
      if (!crosswalk || !crosswalk.ledSystem || !crosswalk.ledSystem.controlUrl) {
        return {
          success: false,
          message: 'LED system not configured'
        };
      }
      
      // Send deactivation command (implementation depends on LED system)
      const deactivationUrl = crosswalk.ledSystem.controlUrl.replace('/activate', '/deactivate');
      
      const response = await axios.post(deactivationUrl, {
        crosswalkId: crosswalk._id,
        action: 'deactivate',
        timestamp: new Date().toISOString()
      }, {
        timeout: 5000
      });
      
      console.log(`🔴 LED deactivated for ${crosswalk.name}`);
      
      return {
        success: true,
        message: 'LED system deactivated',
        crosswalkName: crosswalk.name
      };
      
    } catch (error) {
      console.error('❌ Error deactivating LED system:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }
  
  /**
   * Get LED system status for a crosswalk
   * 
   * @param {String} crosswalkId - Crosswalk MongoDB ID
   * @returns {Object} LED system status
   */
  static async getLEDStatus(crosswalkId) {
    try {
      const crosswalk = await Crosswalk.findById(crosswalkId);
      
      if (!crosswalk) {
        throw new Error('Crosswalk not found');
      }
      
      return {
        success: true,
        crosswalkName: crosswalk.name,
        ledSystem: crosswalk.ledSystem || { status: 'not_configured' }
      };
      
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}

// Export singleton instance
export default new LEDControlService();
