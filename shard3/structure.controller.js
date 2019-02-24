var structureController = (function () {
    var helperError = require('helper.error');

    var controller;
    var room;

    var structures = {
        1: {
            "container": 1,
        }
    }

	return {

		/** */
		run: function(currentRoom) {
            room = currentRoom;
            controller = Game.getObjectById(room.memory.structure_controller[0]);


            this.constructionSites();
            this.progressMessage();
        },

        /**
         * STRUCTURE_SPAWN: "spawn",
         * STRUCTURE_EXTENSION: "extension",
         * STRUCTURE_ROAD: "road",
         * STRUCTURE_WALL: "constructedWall",
         * STRUCTURE_RAMPART: "rampart",
         * STRUCTURE_KEEPER_LAIR: "keeperLair",
         * STRUCTURE_PORTAL: "portal",
         * STRUCTURE_CONTROLLER: "controller",
         * STRUCTURE_LINK: "link",
         * STRUCTURE_STORAGE: "storage",
         * STRUCTURE_TOWER: "tower",
         * STRUCTURE_OBSERVER: "observer",
         * STRUCTURE_POWER_BANK: "powerBank",
         * STRUCTURE_POWER_SPAWN: "powerSpawn",
         * STRUCTURE_EXTRACTOR: "extractor",
         * STRUCTURE_LAB: "lab",
         * STRUCTURE_TERMINAL: "terminal",
         * STRUCTURE_CONTAINER: "container",
         * STRUCTURE_NUKER: "nuker",
         */
        constructionSites: function() {
            var roomStructures = {};

            _.forOwn(room.find(FIND_MY_STRUCTURES), function (structure) {
                var type = structure.structureType;
                roomStructures[type] = (roomStructures[type] || 0) + 1;
            });

            if(controller !== null) {
                _.forOwn(structures[controller.level], function (count, type) {
                    if (roomStructures[type] === undefined || roomStructures[type] < count) {
                        this.constructionSite(type, roomStructures[type]);
                        return false;
                    }
                }.bind(this));
            } else {
                helperError.message("Controller is NULL")
            }

            //createConstructionSite(x, y, structureType, [name])
            //(pos, structureType, [name])

        },

        constructionSite: function (type, index = 0) {
            var name = type + Game.time;


            for(var i=0; i < 4; i++) {
                var pos = this["_pos_" + type](index + i);
                var status = room.createConstructionSite(pos.x, pos.y, type, name);
                if (status === OK) {
                    i = 4;
                }
            }

            if (OK !== status) {
                var message = helperError.message(status);
                console.log(`Cannot construct ${type} @${pos.x},${pos.y}: ${message}`);
            }

        },

        _pos_container: function (index) {
            var origin = Game.getObjectById(room.memory.structure_spawn[0]).pos;
            var x = origin.x;
            var y = origin.y;
            ++index;

            if (index % 4 === 0) {
                y -= (1);
            }

            if (index % 4 === 1) {
                x -= (1);
            }

            if (index % 4 === 2) {
                y += (1);
            }

            if (index % 4 === 3) {
                x += (1);
            }

            return room.getPositionAt(x, y);
        },

        _pos_extension: function (index) {
            var origin = Game.getObjectById(room.memory.structure_spawn[0]).pos;
            var x = origin.x;
            var y = origin.y;
            ++index;

            if (index % 4 === 0) {
                x -= (2 * index);
                y -= (2 * index);
            }

            if (index % 4 === 1) {
                x += (2 * index);
                y -= (2 * index);
            }

            if (index % 4 === 2) {
                x -= (2 * index);
                y += (2 * index);
            }

            if (index % 4 === 3) {
                x += (2 * index);
                y += (2 * index);
            }

            return room.getPositionAt(x, y);
        },


        /**
         * Display status messages
         */
        progressMessage: function () {
            var progress = Math.floor(
                (controller.progress / controller.progressTotal) * 100
            );

            room.visual.text(
                `RCL ${controller.level} (${progress}%)`,
                controller.pos.x + 1,
                controller.pos.y - 1,
                {align: 'left', opacity: 0.8}
            );
        },
	}
})();

module.exports = structureController;
