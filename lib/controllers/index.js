var metaData = require("../../metadata/index");

var validation = require("../validation/index");

// Controllers
var addEvent = require("./addEvent");
var getEvents = require("./getEvents");
var deleteEvent = require("./deleteEvent");

var endPoints = metaData.endpoints;

function attachControllers(binder) {
    binder.attach({
        endPoint: endPoints.event.add,
        validation: validation.addEvent
    }, addEvent);

    binder.attach({ endPoint: endPoints.event.list }, getEvents);

    binder.attach({ endPoint: endPoints.event.remove }, deleteEvent);
}
exports.attachControllers = attachControllers;
