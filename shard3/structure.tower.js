
var structureTower = (function () {
    var helperError = require('helper.error');

    var room;

	return {

		/** */
		run: function(room) {
            this.room = room;
            if (_.has(room.memory, "structure_tower")) {
                var tower = Game.getObjectById(room.memory.structure_tower[0])

                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
                });
                var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

                if(closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }

                if(closestHostile) {
                    tower.attack(closestHostile);
                }
            }
		},
	}
})();

module.exports = structureTower;
