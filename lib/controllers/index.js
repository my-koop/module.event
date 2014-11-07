var metaData = require("../../metadata/index");

// Controllers
var addEvent = require("./addEvent");

var endPoints = metaData.endpoints;

function attachControllers(binder) {
    binder.attach({ endPoint: endPoints.event.add }, addEvent);
}
exports.attachControllers = attachControllers;
