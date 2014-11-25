var metaData = require("../../metadata/index");
var validation = require("../validation/index");
// Controllers
var addEvent = require("./addEvent");
var getEvents = require("./getEvents");
var updateEvent = require("./updateEvent");
var deleteEvent = require("./deleteEvent");
var endPoints = metaData.endpoints;
function attachControllers(binder) {
    binder.attach({
        endPoint: endPoints.event.add,
        validation: validation.addEvent
    }, addEvent);
    binder.attach({ endPoint: endPoints.event.list }, getEvents);
    binder.attach({ endPoint: endPoints.event.update }, updateEvent);
    binder.attach({ endPoint: endPoints.event.remove }, deleteEvent);
    binder.attach({ endPoint: endPoints.event.register }, binder.makeSimpleController("registerToEvent", {
        parseFunc: function (req) {
            return {
                idUser: Number(req.param("idUser")),
                idEvent: Number(req.param("idEvent"))
            };
        }
    }));
    binder.attach({ endPoint: endPoints.event.get }, binder.makeSimpleController("getEvent", {
        parseFunc: function (req) {
            return {
                id: Number(req.param("id"))
            };
        }
    }));
}
exports.attachControllers = attachControllers;
