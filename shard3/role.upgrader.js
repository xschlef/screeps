var c = require("helper.constants");
var roleUpgrader = {

    run: function (creep) {
        if (!creep.memory.hasOwnProperty("state")){
            creep.memory.state = c.STATE_CREEP_HARVESTING;
        }
        if (creep.memory.state === c.STATE_CREEP_UPGRADING && creep.carry.energy === 0) {
            creep.memory.state = c.STATE_CREEP_HARVESTING;
        }
        if (creep.memory.state === c.STATE_CREEP_HARVESTING && creep.carry.energy === creep.carryCapacity) {
            creep.memory.state = c.STATE_CREEP_UPGRADING;
        }

        if (creep.memory.state === c.STATE_CREEP_UPGRADING) {
            if (!creep.room.hasOwnProperty("controller") || !creep.room.controller.my) {
                creep.moveTo(Game.getObjectById(creep.memory.home));
            } else {
                if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        if (creep.memory.state === c.STATE_CREEP_HARVESTING) {
            if(creep.room.energyAvailable > 800) {
                let targets = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN
                        ) && structure.energy === structure.energyCapacity;
                    }
                });
                if (targets.length > 0) {
                    console.log("Upgrading with energy from " + targets[0].structureType);
                    if (creep.withdraw(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }

                    // return here so the upgraders don't harvest
                    return;
                }
            }
            let sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }

        }
    }
};

module.exports = roleUpgrader;