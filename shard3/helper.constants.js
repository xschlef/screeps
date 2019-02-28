var helperConstants = (function () {
    return {
        STATE_CREEP_UNKNOWN: 0,
        STATE_CREEP_RENEW: 1,
        STATE_CREEP_HARVESTING: 2,
        STATE_CREEP_TRANSFERRING: 3,
        STATE_CREEP_BUILDING: 4,
        STATE_CREEP_UPGRADING: 5,
    }
})();

module.exports = helperConstants;