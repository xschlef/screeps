let roleHarvester = {
    run: function (creep) {
        // if we are healthy, don't wait for renew
        if (creep.ticksToDecay > 1000) {
            creep.memory.waiting = 0;
        }
        if (creep.memory.waiting > 0) {
            creep.memory.waiting--;
            creep.say("Waiting");
            return;
        }
        if (creep.carry.energy < creep.carryCapacity) {
            let sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION && creep.ticksToLive > 500 ||
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            if (targets.length > 0) {
                let error = creep.transfer(targets[0], RESOURCE_ENERGY);
                if (error === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
                if (error === OK) {
                    if (targets[0].structureType === STRUCTURE_SPAWN) {
                        targets[0].memory.renew = creep.id;
                        creep.memory.waiting = 3;
                        creep.say('Requesting renew from spawn');
                    }
                }
            }
        }
    }
};

module.exports = roleHarvester;
