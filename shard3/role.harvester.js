var c = require("helper.constants");
let roleHarvester = {
    run: function (creep) {
        if (!creep.memory.hasOwnProperty("state")) {
            creep.memory.state = c.STATE_CREEP_HARVESTING;
        }

        if (creep.memory.state === c.STATE_CREEP_HARVESTING) {
            if (creep.carry.energy >= creep.carryCapacity) {
                creep.memory.state = c.STATE_CREEP_TRANSFERRING;
            } else {
                let source = Game.getObjectById(creep.memory.source_id);
                if (!source) {
                    let sources = creep.room.find(FIND_SOURCES);
                    creep.memory.source_id = sources[0].id;
                }
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }

        if (creep.memory.state === c.STATE_CREEP_TRANSFERRING) {
            let targets = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_TOWER
                        ) && structure.energy < structure.energyCapacity;
                }
            });
            if (creep.carry.energy !== 0) {
                if (targets.length > 0) {
                    let error = creep.transfer(targets[0], RESOURCE_ENERGY);
                    if (error === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    creep.moveTo(Game.getObjectById(creep.memory.home));
                }
            } else {
                creep.memory.state = c.STATE_CREEP_HARVESTING;
            }
        }
    }
};

module.exports = roleHarvester;
