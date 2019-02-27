var structureTower = (function () {
    var helperError = require('helper.error');

    var room;

    return {

        /** */
        run: function (room) {
            this.room = room;
            if (_.has(room.memory, "structure_tower")) {
                var tower = Game.getObjectById(room.memory.structure_tower[0])

                if (tower !== null) {
                    // only repair if below half hitpoints, so attackers are prioritized
                    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                        filter: (structure) => structure.hits < Math.floor(structure.hitsMax / 2)
                    });
                    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

                    if (closestDamagedStructure) {
                        tower.repair(closestDamagedStructure);
                    }

                    if (closestHostile) {
                        tower.attack(closestHostile);
                    }
                }
            }
        },
    }
})();

module.exports = structureTower;
