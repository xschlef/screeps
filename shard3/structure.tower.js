var structureTower = (function () {
    var helperError = require('helper.error');
    var cache = require('helper.cache');

    var room;

    return {

        /** */
        run: function (room) {
            this.room = room;
            if (_.has(room.memory, "structure_tower")) {
                var tower = Game.getObjectById(room.memory.structure_tower[0])

                if (tower !== null) {

                    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    if (closestHostile !== null) {
                        tower.attack(closestHostile);
                        return;
                    }

                    // only repair or heal if enough energy is available
                    if ((tower.energy / tower.energyCapacity) * 100 > 80) {
                        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (structure) => (structure.hits < Math.floor(structure.hitsMax / 2)) &&
                                (structure.structureType !== STRUCTURE_WALL)
                        });
                        if (closestDamagedStructure !== null) {
                            tower.repair(closestDamagedStructure);
                            return;
                        }

                        var closestDamagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                            filter: (c) => c.hits < c.hitsMax
                        });

                        if (closestDamagedCreep) {
                            tower.heal(closestDamagedCreep);
                            console.log("Healing " + closestDamagedCreep.name);
                            return;
                        }
                    }
                }
            }
        },
    }
})();

module.exports = structureTower;
