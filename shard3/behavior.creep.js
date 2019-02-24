/**
 * Creep Behavior
 */
var behaviorCreep = (function () {
    var helperError = require('helper.error');

    var roleHarvester = require('role.harvester');
    var roleUpgrader = require('role.upgrader');
    var roleBuilder = require('role.builder');

	return {

		/** */
		run: function() {
            for(var name in Game.creeps) {
                var creep = Game.creeps[name];
                if(creep.memory.role == 'harvester') {
                    roleHarvester.run(creep);
                }
                if(creep.memory.role == 'upgrader') {
                    roleUpgrader.run(creep);
                }
                if(creep.memory.role == 'builder') {
                    roleBuilder.run(creep);
                }
            }
		},
	}
})();

module.exports = behaviorCreep;
