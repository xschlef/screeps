/**
 * Creep Behavior
 */
var behaviorCreep = (function () {
    var helperError = require('helper.error');
    var constants = require('helper.constants');

    var roleHarvester = require('role.harvester');
    var roleUpgrader = require('role.upgrader');
    var roleBuilder = require('role.builder');
    var roleAttacker = require('role.attacker');

    return {

        /** */
        run: function () {
            for (var name in Game.creeps) {
                var creep = Game.creeps[name];
                if (!this.renew(creep)) {
                    if (creep.memory.role === 'harvester') {
                        roleHarvester.run(creep);
                    }
                    if (creep.memory.role === 'upgrader') {
                        roleUpgrader.run(creep);
                    }
                    if (creep.memory.role === 'builder') {
                        roleBuilder.run(creep);
                    }
                    if (creep.memory.role === 'attacker') {
                        roleAttacker.run(creep);
                    }
                }
            }
        },
        renew: function (creep) {
            if (creep.ticksToLive < 300) {
                if (creep.memory.state !== constants.STATE_CREEP_RENEW) {
                    creep.memory.old_state = creep.memory.state;
                    creep.memory.state = constants.STATE_CREEP_RENEW;
                }
            }
            if (creep.memory.state === constants.STATE_CREEP_RENEW) {
                let home = Game.getObjectById(creep.memory.home);
                if (home.room.energyAvailable < 200 || creep.ticksToLive > 1200) {
                    creep.memory.waiting = 0;
                    creep.memory.state = creep.memory.old_state;
                    delete creep.memory.old_state;
                    delete home.memory.renew;
                    return false;
                }
                creep.memory.waiting--;


                if (creep.pos.inRangeTo(home, 1)) {
                    if (home.hasOwnProperty("renew") || home.spawning) {
                        creep.memory.waiting = 10;
                        console.log(creep.name + " waiting for spawn to renew");
                    } else {
                        home.memory.renew = creep.id;
                        creep.memory.waiting = 10;
                        console.log(creep.name + " requesting renew.")
                    }
                } else {
                    creep.moveTo(home);
                }
                return true;
            }
            return false;
        }
    }
})();

module.exports = behaviorCreep;
