var helperRenew = function(creep) {
    if(creep.memory.waiting > 0) {
        creep.memory.waiting--;
    } else {
        if (creep.ticksToLive < 200) {
            creep.moveTo(Game.getObjectById(creep.memory.home));
            
        }
    }
};

module.exports = helperRenew;