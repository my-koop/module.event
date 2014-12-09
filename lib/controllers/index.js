var endPoints = require("../../metadata/endpoints");
var validation = require("../validation/index");
function attachControllers(binder) {
    var event = binder.moduleInstance;
    binder.attach({
        endPoint: endPoints.event.add,
        validation: validation.eventObject,
        permissions: {
            events: {
                create: true
            }
        }
    }, binder.makeSimpleController(event.addEvent, function (req) {
        return {
            name: req.param("name"),
            startDate: new Date(req.param("startDate")),
            type: req.param("type"),
            description: req.param("description")
        };
    }));
    binder.attach({
        endPoint: endPoints.event.list,
        permissions: {
            events: {
                view: true
            }
        }
    }, binder.makeSimpleController(event.getEvents, function (req) {
        return {
            isClosed: req.param("isClosed") === "true",
            startedOnly: req.param("startedOnly") === "true"
        };
    }));
    binder.attach({ endPoint: endPoints.event.public }, binder.makeSimpleController(event.getPublicEvents, function (req) {
        return {
            idUser: req.session.user && req.session.user.id || null
        };
    }));
    binder.attach({
        endPoint: endPoints.event.update,
        validation: validation.eventObject,
        permissions: {
            events: {
                update: true
            }
        }
    }, binder.makeSimpleController(event.updateEvent, function (req) {
        var endDate = req.param("endDate", null);
        var startAmount = parseFloat(req.param("startAmount", null));
        if (isNaN(startAmount)) {
            startAmount = null;
        }
        var endAmount = parseFloat(req.param("endAmount", null));
        if (isNaN(endAmount)) {
            endAmount = null;
        }
        return {
            id: parseInt(req.param("id")),
            name: req.param("name"),
            type: req.param("type"),
            startDate: new Date(req.param("startDate")),
            endDate: endDate ? new Date(endDate) : null,
            startAmount: startAmount,
            endAmount: endAmount,
            description: req.param("description")
        };
    }));
    binder.attach({
        endPoint: endPoints.event.remove,
        permissions: {
            events: {
                delete: true
            }
        }
    }, binder.makeSimpleController(event.deleteEvent, function (req) {
        return {
            id: parseInt(req.param("id"))
        };
    }));
    binder.attach({
        endPoint: endPoints.event.start,
        permissions: {
            events: {
                control: true
            }
        }
    }, binder.makeSimpleController(event.startEvent, function (req) {
        return {
            id: parseInt(req.param("id")),
            startAmount: parseFloat(req.param("startAmount"))
        };
    }));
    binder.attach({
        endPoint: endPoints.event.end,
        permissions: {
            events: {
                control: true
            }
        }
    }, binder.makeSimpleController(event.endEvent, function (req) {
        return {
            id: parseInt(req.param("id")),
            endAmount: parseFloat(req.param("endAmount"))
        };
    }));
    binder.attach({
        endPoint: endPoints.event.register,
        permissions: {
            events: {
                register: true
            }
        }
    }, binder.makeSimpleController(event.registerToEvent, function (req) {
        return {
            idUser: parseInt(req.param("idUser")),
            idEvent: parseInt(req.param("idEvent"))
        };
    }));
    binder.attach({
        endPoint: endPoints.event.unregister,
        permissions: {
            events: {
                register: true
            }
        }
    }, binder.makeSimpleController(event.unregisterToEvent, function (req) {
        return {
            idUser: parseInt(req.param("idUser")),
            idEvent: parseInt(req.param("idEvent"))
        };
    }));
    binder.attach({
        endPoint: endPoints.event.get,
        permissions: {
            events: {
                view: true
            }
        }
    }, binder.makeSimpleController(event.getEvent, {
        parseFunc: function (req) {
            return {
                id: parseInt(req.param("id"))
            };
        }
    }));
    var core = event.getModuleManager().get("core");
    binder.attach({
        endPoint: endPoints.event.notes.new,
        permissions: {
            events: {
                notes: {
                    create: true
                }
            }
        }
    }, core.newNoteController.bind(core, "event_notes"));
    binder.attach({
        endPoint: endPoints.event.notes.list,
        permissions: {
            events: {
                notes: {
                    view: true
                }
            }
        }
    }, core.getNotesController.bind(core, "event_notes"));
}
exports.attachControllers = attachControllers;
