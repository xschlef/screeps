let roleBuilder = (function () {
    let creep;

    return {
        run: function (currentCreep) {
            creep = currentCreep;

            if (creep.memory.building && creep.carry.energy === 0) {
                creep.memory.building = false;
                creep.say('harvesting');
            }
            if (!creep.memory.building && creep.carry.energy === creep.carryCapacity) {
                creep.memory.building = true;
                creep.say('building');
            }

            if (creep.memory.building) {
                if(! this.repair()) {
                    this.build();
                }
            } else {
                this.harvest();
            }
        },

        repair: function () {
            var closestDamagedStructure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,{
                filter: (structure) => {
                    return (structure.hits < (structure.hitsMax / 2));
                }
            });
            if (closestDamagedStructure) {
                creep.say("Repairing");
                creep.repair(closestDamagedStructure);
            }
            return closestDamagedStructure !== null;
        },

        build: function () {
            let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
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

            if (spawn !== null) {
                if (spawn.energy > 200) {
                    if (creep.withdraw(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                    return false;
                }
            } else {
                creep.moveTo(Game.getObjectById(creep.memory.home));
                return false;
            }

            let sources = creep.room.find(FIND_SOURCES);
            if (sources !== null) {
                if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }

        },
    }
})();

module.exports = roleBuilder;
