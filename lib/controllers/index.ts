import metaData   = require("../../metadata/index");
import utils      = require("mykoop-utils");
import validation = require("../validation/index");
import Express    = require("express");

// Controllers
import addEvent     = require ("./addEvent");
import getEvents    = require ("./getEvents");
import updateEvent  = require ("./updateEvent");
import deleteEvent  = require ("./deleteEvent");

var endPoints = metaData.endpoints;

export function attachControllers(
  binder: utils.ModuleControllersBinder<mkevent.Module>
) {
  var event = binder.moduleInstance;

  binder.attach(
    {
      endPoint: endPoints.event.add,
      validation: validation.eventObject
    },
    addEvent
  );

  binder.attach(
    {endPoint: endPoints.event.list},
    getEvents
  );

  binder.attach(
    {
      endPoint: endPoints.event.update,
      validation: validation.eventObject
    },
    updateEvent
  );

  binder.attach(
    {endPoint: endPoints.event.remove},
    deleteEvent
  );

  binder.attach(
    {endPoint: endPoints.event.start},
    binder.makeSimpleController(event.startEvent, function(req) {
      return {
        idEvent: parseInt(req.param("id")),
        startAmount: parseInt(req.param("startAmount"))
      }
    })
  );

  binder.attach(
    {endPoint: endPoints.event.end},
    binder.makeSimpleController(event.endEvent,
    {
      parseFunc: function(req: Express.Request) {
        return {
          id : parseInt(req.param("id")),
          startAmount: parseInt(req.param("endAmount"))
        };
      }
    })
  );

  binder.attach(
    {endPoint: endPoints.event.register},
    binder.makeSimpleController(event.registerToEvent,
    {
      parseFunc: function(req: Express.Request): EventInterfaces.RegisterEventData {
        return {
          idUser : parseInt(req.param("idUser")),
          idEvent: parseInt(req.param("idEvent"))
        };
      }
    })
  );

  binder.attach(
    {endPoint: endPoints.event.get},
    binder.makeSimpleController(event.getEvent,
    {
      parseFunc: function(req: Express.Request): EventInterfaces.GetEventData {
        return {
          id: parseInt(req.param("id"))
        };
      }
    })
  );
}
