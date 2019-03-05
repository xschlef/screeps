let roleBuilder = (function () {
    var c = require("helper.constants");
    let creep;

    return {
        run: function (currentCreep) {
            creep = currentCreep;
            // newly spawned creeps do not have a state yet
            if (!creep.memory.hasOwnProperty("state")) {
                creep.memory.state = c.STATE_CREEP_HARVESTING;
            }

            if (creep.memory.state === c.STATE_CREEP_BUILDING && creep.carry.energy === 0) {
                creep.memory.state = c.STATE_CREEP_HARVESTING;
            }

            if (creep.memory.state === c.STATE_CREEP_HARVESTING && creep.carry.energy === creep.carryCapacity) {
                creep.memory.state = c.STATE_CREEP_BUILDING;
            }

            if (creep.memory.state === c.STATE_CREEP_BUILDING) {
                if (!this.repair()) {
                    this.build();
                }
            } else if (creep.memory.state === c.STATE_CREEP_HARVESTING) {
                this.harvest();
            } else {
                creep.memory.state = c.STATE_CREEP_HARVESTING;

            }
        },

        repair: function () {
            var closestDamagedStructure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.hits < (structure.hitsMax / 2));
                }
            });
            if (closestDamagedStructure) {
                creep.repair(closestDamagedStructure);
            }
            return closestDamagedStructure !== null;
        },

        build: function () {
            // priority handling for these structures
            let targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {
                filter: (site) => {
                    return site.structureType === STRUCTURE_EXTENSION ||
                        site.structureType === STRUCTURE_TOWER;
                }
            });
            // only construct these if no priority building found
            if (targets.length === 0) {
                targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            }
            if (targets.length > 0) {
                if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.moveTo(Game.getObjectById(creep.memory.home));
            }
        },

        harvest: function () {
            let spawn = Game.getObjectById(creep.room.memory.structure_spawn[0]);

            if (spawn !== null && creep.room.memory.energyPercent > 80) {
                let targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN
                        ) && structure.energy > 0;
                    }
                });
                if (targets.length > 0) {
                    if (creep.withdraw(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
                return false;
            } else {
                let targets = creep.room.find(FIND_SOURCES);
                if (targets.length > 0) {
                    // always pick the last source
                    if (creep.harvest(targets[targets.length -1])  === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[targets.length -1], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                } else {
                    creep.moveTo(Game.getObjectById(creep.memory.home));
                    return false;
                }
            }
        },
    }
})();

module.exports = roleBuilder;
