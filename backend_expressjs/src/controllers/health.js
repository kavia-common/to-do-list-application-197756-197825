const healthService = require('../services/health');
const tasksService = require('../services/tasks');

class HealthController {
  // PUBLIC_INTERFACE
  check(req, res) {
    /** Express handler: basic service health status. */
    const healthStatus = healthService.getStatus();
    return res.status(200).json(healthStatus);
  }

  // PUBLIC_INTERFACE
  async checkDb(req, res, next) {
    /** Express handler: database connectivity health status. */
    try {
      const ok = await tasksService.pingDatabase();
      if (!ok) {
        return res.status(503).json({
          status: 'error',
          message: 'Database not reachable',
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(200).json({
        status: 'ok',
        message: 'Database reachable',
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new HealthController();
