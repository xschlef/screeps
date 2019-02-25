/**
 * Spawn Structure
 */
var structureSpawn = (function () {
    var helperError = require('helper.error');
    var room;
    var spawn;

	var rolePriorities = {
		'harvester': 8,
		'upgrader': 4,
		'builder': 1,
        'attacker': 1,
    };

    var config = {
        'spawnCache': 60
    };

	return {

		/** */
		run: function(currentRoom) {
            room = currentRoom;
            spawn = Game.getObjectById(room.memory.structure_spawn[0]);

            if (null === spawn)
                return false;

			/** Creep Spawning */
			this.renewCreeps();
			this.spawnCreeps();
		},
        renewCreeps: function () {
		    if(!spawn.spawning && spawn.memory.hasOwnProperty("renew")) {
		        if(spawn.memory.renew) {
                    var target = Game.getObjectById(spawn.memory.renew);
                    var renew = spawn.renewCreep(target);
                    if (renew !== OK) {
                        console.log("Clearing renew target, as it is out of range or I am out of energy.");
                        delete spawn.memory.renew;
                    } else {
                        console.log("Renewing creep.")
                    }
                }
            }
        },

        /**
         * Check to see if any creeps need to be spawned
         */
		spawnCreeps: function () {
            var creeps = room.find(FIND_MY_CREEPS);
            var creepRoles = {};

            // Get counts of each role in the current room
            if (creeps.length) {
                _.forOwn(creeps, function (creep) {
                    var role = creep.memory.role;
                    creepRoles[role] = (creepRoles[role] || 0) + 1;
                });
            }

            // Check the creep list against the priorities list and spawn as
            // needed
            _.forOwn(rolePriorities, function (count, role) {
                if (creepRoles[role] === undefined || creepRoles[role] < count) {
                        this["_spawn_" + role]();
                        return false;
                }
            }.bind(this));
        },
        spawnCreep: function (role, parts) {
            var name = role + Game.time;
            var status = spawn.spawnCreep(parts, name, {
                memory: {role: role}
            });

            if (OK === status || ERR_BUSY === status) {
                this.spawnMessage();
            } else {
                var message = helperError.message(status);
                console.log(`Cannot spawn ${role}: ${message}`);
            }
        },
        // parts cost:
        // https://screeps.fandom.com/wiki/Creep
		_spawn_upgrader: function () {
            if (spawn.energy > 250) {
                this.spawnCreep('upgrader', [WORK, CARRY, MOVE, MOVE]);
            }
		},
		_spawn_harvester: function () {
            if (spawn.energy > 250) {
                this.spawnCreep('harvester', [WORK, CARRY, MOVE, MOVE]);
            }
		},
		_spawn_builder: function () {
            if (spawn.energy > 200) {
                this.spawnCreep('builder', [WORK, CARRY, MOVE]);
            }
		},
		_spawn_attacker: function () {
            if (spawn.energy > 130) {
                this.spawnCreep('attacker', [ATTACK, MOVE]);
            }
		},
		spawnMessage: function () {
			if (spawn.spawning) {
                var creep = Game.creeps[spawn.spawning.name];
                var time = spawn.spawning;

                // The spawning message appears a tick late. This is why we
                // have to add one to remainingTime
                var percent = Math.floor(
                    ((time.needTime - time.remainingTime + 1) / time.needTime) * 100
                );

				room.visual.text(
					`${creep.memory.role} (${percent}%)`,
					spawn.pos.x,
					spawn.pos.y + 1.5,
                    {align: 'center', opacity: 0.8}
                );
			}
		}
	}
})();

module.exports = structureSpawn;
