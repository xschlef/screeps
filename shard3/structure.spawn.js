/**
 * Spawn Structure
 */
var structureSpawn = (function () {
    var helperError = require('helper.error');
    var cache = require('helper.cache');
    var room;
    var spawn;

    var rolePriorities = {
        'harvester': 4,
        'upgrader': 6,
        'builder': 2,
    };

    var sourcePriorites = [
        "5bbcab6f9099fc012e633806",
        "5bbcab6f9099fc012e633806",
        "5bbcab6f9099fc012e633806",
        "5bbcab6f9099fc012e633805",
        "5bbcab6f9099fc012e633806"

    ];

    var modules = {
        "upgrader": [WORK, CARRY, MOVE, MOVE],
        "harvester": [WORK, CARRY, MOVE, MOVE],
        "builder": [WORK, CARRY, MOVE, MOVE],
        "attack": [ATTACK, TOUGH, MOVE, MOVE],
        "defend": [RANGED_ATTACK, MOVE]
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

            room.visual.text(
                `Energy: ${room.memory.energyPercent}%`,
                spawn.pos.x + 1,
                spawn.pos.y - 1,
                {align: 'left', opacity: 0.8}
            );
            room.visual.text(
                `Max: ${room.energyCapacityAvailable}`,
                spawn.pos.x + 1,
                spawn.pos.y,
                {align: 'left', opacity: 0.8}
            );
        },
        fixSources: function () {
            if(!spawn.memory.hasOwnProperty("fix_src")) {
                spawn.memory.fix_src = 10;
            }
            if (spawn.memory.fix_src === 0) {
                console.log("Fixing source ids");
                let i = 0;
                for(let f in Game.creeps) {
                    if (Game.creeps[f].memory.role === "harvester") {
                        Game.creeps[f].memory.source_id = sourcePriorites[i];
                        i++;
                    }
                }
                spawn.memory.fix_src = 100;
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
                        console.log("Renewing " + target.name)
                    }
                }
            }
        },
        spawnCreeps: function () {
            var creeps = room.find(FIND_MY_CREEPS);
            // fix init
            var creepRoles = {"harvester": 0, "upgrader": 0, "builder": 0};


            // Get counts of each role in the current room
            if (creeps.length) {
                _.forOwn(creeps, function (creep) {
                    var role = creep.memory.role;
                    creepRoles[role] = (creepRoles[role] || 0) + 1;
                });
            }

            // pump at least 80 percent of the energy into spawning a new creep
            // this is only needed if we have at least one harvester
            if (room.memory.energyPercent < 80 && creepRoles["harvester"] > 1) {
                return false;
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
                memory["source_id"] = src_id;
            }
            var status = spawn.spawnCreep(parts, name, {
                memory: memory
            });

            if (!(OK === status || ERR_BUSY === status)) {
                var message = helperError.message(status);
                console.log(`Cannot spawn ${role}: ${message}`);
            }
        },
        calculate_parts: function(role) {
            let usedEnergy = 0;
            let moduleCost = 0;
            let parts = [];
            modules[role].forEach( function(item) {
                moduleCost += BODYPART_COST[item];
            });

            if (moduleCost === 0) {
                console.log("Bad module cost");
                return;
            }
            while (usedEnergy < room.energyAvailable) {
                if (usedEnergy + moduleCost < room.energyAvailable) {
                    parts = parts.concat(modules[role]);
                }
                usedEnergy += moduleCost;
            }
            console.log("Using parts: " + parts);
            return parts;

        },
        _spawn_upgrader: function (count) {
            this.spawnCreep('upgrader', this.calculate_parts('upgrader'), count);
        },
        _spawn_harvester: function (count) {
            if (room.energyCapacityAvailable >= 350) {
                this.spawnCreep('harvester', this.calculate_parts('harvester'), count);
                return;
            }
            if (room.energyCapacityAvailable < 350 && room.energyAvailable > 249 && count < 2) {
                this.spawnCreep('harvester', [WORK, CARRY, CARRY, MOVE, MOVE], count);
                return;
            }
            if (Game.creeps < 1 && room.energyAvailable > 249) {
                this.spawnCreep('harvester', [WORK, CARRY, MOVE, MOVE], count);
            }
        },
        _spawn_builder: function (count) {
            this.spawnCreep('builder', this.calculate_parts('builder'), count);
        },
        _spawn_attacker: function (count) {
            this.spawnCreep('attacker', this.calculate_parts("attack"), count);
        },
        _spawn_defender: function (count) {
            this.spawnCreep('defender', this.calculate_parts("defend"), count);
        }
    }
})();

module.exports = structureSpawn;
