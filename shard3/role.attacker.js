let roleAttacker = (function () {
    let creep;

    return {
        run: function (currentCreep) {
            creep = currentCreep;
            if (creep.memory.waiting > 0) {
                creep.memory.waiting--;
                return;
            }
            this.attack(creep);
        },
        attack: function (currentCreep) {
            let target;
            if (creep.memory.hasOwnProperty("target")) {
                target = Game.getObjectById(creep.memory.target);
            } else {
                target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            }
            if (target) {
                let result = creep.attack(target);
                if (result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                if (result === ERR_INVALID_TARGET) {
                    if (creep.memory.hasOwnProperty("target")) {
                        delete creep.memory.target;
                    }
                }
            } else {
                creep.memory.waiting = 100;
                creep.say("No target");
            }
        },
    }
})
();

module.exports = roleAttacker;