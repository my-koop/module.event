var metaData = require("../../metadata/index");
var validation = require("../validation/index");
// Controllers
var addEvent = require("./addEvent");
var getEvents = require("./getEvents");
var updateEvent = require("./updateEvent");
var deleteEvent = require("./deleteEvent");
var endPoints = metaData.endpoints;
function attachControllers(binder) {
    var event = binder.moduleInstance;
    binder.attach({
        endPoint: endPoints.event.add,
        validation: validation.eventObject
    }, addEvent);
    binder.attach({ endPoint: endPoints.event.list }, getEvents);
    binder.attach({
        endPoint: endPoints.event.update,
        validation: validation.eventObject
    }, updateEvent);
    binder.attach({ endPoint: endPoints.event.remove }, deleteEvent);
    binder.attach({ endPoint: endPoints.event.start }, binder.makeSimpleController(event.startEvent, function (req) {
        return {
            idEvent: parseInt(req.param("id")),
            startAmount: parseInt(req.param("startAmount"))
        };
    }));
    binder.attach({ endPoint: endPoints.event.end }, binder.makeSimpleController(event.endEvent, {
        parseFunc: function (req) {
            return {
                id: parseInt(req.param("id")),
                startAmount: parseInt(req.param("endAmount"))
            };
        }
    }));
    binder.attach({ endPoint: endPoints.event.register }, binder.makeSimpleController(event.registerToEvent, {
        parseFunc: function (req) {
            return {
                idUser: parseInt(req.param("idUser")),
                idEvent: parseInt(req.param("idEvent"))
            };
        }
    }));
    binder.attach({ endPoint: endPoints.event.get }, binder.makeSimpleController(event.getEvent, {
        parseFunc: function (req) {
            return {
                id: parseInt(req.param("id"))
            };
        }
    }));
}
exports.attachControllers = attachControllers;
