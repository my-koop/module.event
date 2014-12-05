import utils      = require("mykoop-utils");
import endPoints   = require("../../metadata/endpoints");
import validation = require("../validation/index");

export function attachControllers(
  binder: utils.ModuleControllersBinder<mkevent.Module>
) {
  var event = binder.moduleInstance;

  binder.attach(
    {
      endPoint: endPoints.event.add,
      validation: validation.eventObject
    },
    binder.makeSimpleController<mkevent.AddEvent.Params>(
      event.addEvent,
      function(req) {
        return  {
          name: req.param("name"),
          startDate: new Date(req.param("startDate")),
          type: req.param("type")
        };
      }
    )
  );

  binder.attach(
    {endPoint: endPoints.event.list},
    binder.makeSimpleController<mkevent.GetEvents.Params>(
      event.getEvents,
      function(req) {
        return  {
          isClosed: req.param("isClosed") === "true",
          startedOnly: req.param("startedOnly") === "true"
        };
      }
    )
  );

  binder.attach(
    {
      endPoint: endPoints.event.update,
      validation: validation.eventObject
    },
    binder.makeSimpleController<mkevent.UpdateEvent.Params>(
      event.updateEvent,
      function(req) {
        var endDate = req.param("endDate", null);
        var startAmount = parseFloat(req.param("startAmount", null));
        if(isNaN(startAmount)) {
          startAmount = null;
        }
        var endAmount = parseFloat(req.param("endAmount", null));
        if(isNaN(endAmount)) {
          endAmount = null;
        }
        return {
          id: parseInt(req.param("id")),
          name: req.param("name"),
          type: req.param("type"),
          startDate: new Date(req.param("startDate")),
          endDate: endDate ? new Date(endDate) : null,
          startAmount: startAmount,
          endAmount: endAmount
        };
      }
    )
  );

  binder.attach(
    {endPoint: endPoints.event.remove},
    binder.makeSimpleController<mkevent.DeleteEvent.Params>(
      event.deleteEvent,
      function(req) {
        return {
          id: parseInt(req.param("id"))
        };
      }
    )
  );

  binder.attach(
    {endPoint: endPoints.event.start},
    binder.makeSimpleController<mkevent.StartEvent.Params>(
      event.startEvent,
      function(req) {
        return {
          id: parseInt(req.param("id")),
          startAmount: parseFloat(req.param("startAmount"))
        };
      }
    )
  );

  binder.attach(
    {endPoint: endPoints.event.end},
    binder.makeSimpleController<mkevent.EndEvent.Params>(
      event.endEvent,
      function(req: Express.Request) {
        return {
          id: parseInt(req.param("id")),
          endAmount: parseFloat(req.param("endAmount"))
        };
      }
    )
  );

  binder.attach(
    {endPoint: endPoints.event.register},
    binder.makeSimpleController<mkevent.RegisterToEvent.Params>(
      event.registerToEvent,
      function(req) {
        return {
          idUser : parseInt(req.param("idUser")),
          idEvent: parseInt(req.param("idEvent"))
        };
      }
    )
  );

  binder.attach(
    {endPoint: endPoints.event.get},
    binder.makeSimpleController(event.getEvent,
    {
      parseFunc: function(req: Express.Request): mkevent.GetEvent.Params {
        return {
          id: parseInt(req.param("id"))
        };
      }
    })
  );
}
