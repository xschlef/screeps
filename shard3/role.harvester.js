let roleHarvester = {
    run: function (creep) {
        // if we are healthy, don't wait for renew
        if (creep.ticksToLive > 1000 && creep.memory.state === "renew") {
            creep.memory.waiting = 0;
        }
        // wait the wait time
        if (creep.memory.waiting > 0) {
            Game.getObjectById(creep.memory.home).memory.renew = creep.id;
            creep.memory.waiting--;
            creep.say("Waiting");
        }

        // exit harvest if we are no longer waiting
        if (creep.memory.state === "renew" && creep.memory.waiting === 0) {
            creep.memory.state = "harvesting";
        }

        if (!creep.memory.hasOwnProperty("state")) {
            creep.memory.state = "harvesting";
        }

        if (creep.memory.state === "harvesting") {
            if (creep.carry.energy >= creep.carryCapacity) {
                creep.memory.state = "transferring";
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

        if (creep.memory.state === "transferring") {
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION && creep.ticksToLive > 500 ||
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
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
            }
            if (creep.carry.energy === 0) {
                if (targets.length > 0) {
                    if (creep.ticksToLive < 1000) {
                        creep.memory.state = "move_renew";
                    } else {
                        creep.memory.state = "harvesting";
                    }
                } else {
                    creep.memory.state = "harvesting";
                }
            }
        }
        if (creep.memory.state === "move_renew") {
            let spawn = Game.getObjectById(creep.memory.home);
            creep.moveTo(spawn);
            if (spawn.pos.getRangeTo(creep.pos.x, creep.pos.y) === 1) {
                spawn.memory.renew = creep.id;
                let offset = 5;
                if (spawn.spawning) {
                    offset = 12;
                }
                creep.memory.waiting = offset;
                creep.memory.state = "renew";
                creep.say('Requesting renew from spawn');
            }
        }
    }
};

module.exports = roleHarvester;
