var helperConstants = (function () {
    return {
        STATE_CREEP_UNKNOWN: 0,
        STATE_CREEP_RENEW: 1,
        STATE_CREEP_HARVESTING: 2,
        STATE_CREEP_TRANSFERRING: 3,
        STATE_CREEP_BUILDING: 4,
        STATE_CREEP_UPGRADING: 5,
        STATE_CREEP_REPAIRING: 6,
        STATE_BUILDING_IDLE: 0,
        STATE_BUILDING_REPAIRING: 90,
        STATE_BUILDING_ATTACKING: 99,
        STATE_BUILDING_HEALING: 10
    }
})();

module.exports = helperConstants;