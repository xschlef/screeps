/**
 * Spawn Structure
 */
var structureSpawn = (function () {
    var helperError = require('helper.error');
    var room;
    var spawn;

    var rolePriorities = {
        'harvester': 8,
        'upgrader': 3,
        'builder': 2,
    };

    var sourcePriorites = [
            "5bbcafd19099fc012e63b3d0", // E47S6 at spawn
            "5bbcafd19099fc012e63b3d0", // E47S6 at spawn
            "5bbcafd19099fc012e63b3ce", // E47S6
            "5bbcafd19099fc012e63b3ce", // E47S6
            "5bbcafd19099fc012e63b3ce", // E47S6
            "5bbcafd19099fc012e63b3ce", // E47S6
            "5bbcafe29099fc012e63b55b", // E48S6
            "5bbcafe29099fc012e63b55b", // E48S6
            "5bbcafe29099fc012e63b55b"  // E48S6
    ];

    var config = {
        'spawnCache': 60
    };

    return {

        /** */
        run: function (currentRoom) {
            room = currentRoom;
            spawn = Game.getObjectById(room.memory.structure_spawn[0]);

            if (null === spawn)
                return false;

            /** Creep Spawning */
            this.renewCreeps();
            this.spawnCreeps();
            this.fixSources();
        },
        fixSources: function () {
            spawn.memory.fix_src = spawn.memory.fix_src || 500;
            if (spawn.memory.fix_src === 0) {
                let i = 0;
                for(let crp in Game.creeps) {
                    if (Game.creeps[crp].memory.role === "harvester"){
                        Game.creeps[crp].memory.source_id = sourcePriorites[i];
                        i++;
                    }
                }
                spawn.memory.fix_src = 500;
            }
            spawn.memory.fix_src--;
        },
        renewCreeps: function () {
            if (!spawn.spawning && spawn.memory.hasOwnProperty("renew")) {
                if (spawn.memory.renew) {
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
                    this["_spawn_" + role](creepRoles[role]);
                    return false;
                }
            }.bind(this));
        },
        spawnCreep: function (role, parts, count) {
            var name = role + Game.time;
            var memory = {role: role, home: spawn.id, waiting: 0};
            if (role === "harvester") {
                let sources = room.find(FIND_SOURCES);
                let src_id = sources[0].id;
                if(count <= sourcePriorites.length) {
                    src_id = sourcePriorites[count];
                }
                console.log(src_id);
                memory["source_id"] = src_id;
            }
            var status = spawn.spawnCreep(parts, name, {
                memory: memory
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
        _spawn_upgrader: function (count) {
            if (room.energyAvailable > 499) {
                this.spawnCreep('upgrader', [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], count);
            }

            if (room.energyCapacityAvailable < 350 && room.energyAvailable > 249) {
                this.spawnCreep('upgrader', [WORK, CARRY, MOVE, MOVE], count);
            }
        },
        _spawn_harvester: function (count) {
            if (room.energyAvailable > 499) {
                this.spawnCreep('harvester', [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], count);
                return;
            }
            if (room.energyCapacityAvailable < 350 && room.energyAvailable > 249) {
                this.spawnCreep('harvester', [WORK, CARRY, CARRY, MOVE, MOVE], count);
                return;
            }
            if (Game.creeps < 1 && room.energyAvailable > 249) {
                this.spawnCreep('harvester', [WORK, CARRY, CARRY, MOVE, MOVE], count);
            }
        },
        _spawn_builder: function (count) {
            if (room.energyAvailable > 499) {
                this.spawnCreep('builder', [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], count);
            }
            if (room.energyCapacityAvailable < 350 && room.energyAvailable > 249) {
                this.spawnCreep('builder', [WORK, CARRY, MOVE, MOVE], count);
            }
        },
        _spawn_attacker: function (count) {
            if (room.energyAvailable > 130) {
                this.spawnCreep('attacker', [ATTACK, MOVE], count);
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
