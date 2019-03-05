var structureController = (function () {
    var helperError = require('helper.error');

    var controller;
    var room;

    var structures = {
        1: {
            "container": 1,
        }
    };

    return {

        /** */
        run: function (currentRoom) {
            room = currentRoom;
            controller = Game.getObjectById(room.memory.structure_controller[0]);


           // this.constructionSites();
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


        /**
         * Display status messages
         */
        progressMessage: function () {
            if (controller !== null) {
                var progress = Math.floor(
                    (controller.progress / controller.progressTotal) * 100
                );

                room.visual.text(
                    `RCL ${controller.level} (${progress}%)`,
                    controller.pos.x + 1,
                    controller.pos.y - 1,
                    {align: 'left', opacity: 0.8}
                );
            }
        },
    }
})();

module.exports = structureController;
