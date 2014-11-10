var metaData = require("../../metadata/index");

var validation = require("../validation/index");

// Controllers
var addEvent = require("./addEvent");

var endPoints = metaData.endpoints;

function attachControllers(binder) {
    binder.attach({
        endPoint: endPoints.event.add,
        validation: validation.addEvent
    }, addEvent);
}
exports.attachControllers = attachControllers;
