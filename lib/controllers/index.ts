import metaData   = require("../../metadata/index");
import utils      = require("mykoop-utils");
import validation = require("../validation/index");
import Express    = require("express");

// Controllers
import addEvent   = require ("./addEvent");
import getEvents  = require ("./getEvents");
import updateEvent  = require ("./updateEvent");
import deleteEvent  = require ("./deleteEvent");

var endPoints = metaData.endpoints;

export function attachControllers(
  binder: utils.ModuleControllersBinder<mkevent.Module>
) {
  binder.attach(
    {
      endPoint: endPoints.event.add,
      validation: validation.addEvent
    },
    addEvent
  );

  binder.attach(
    {endPoint: endPoints.event.list},
    getEvents
  );

  binder.attach(
    {endPoint: endPoints.event.update},
    updateEvent
  );

  binder.attach(
    {endPoint: endPoints.event.remove},
    deleteEvent
  );

  binder.attach(
    {endPoint: endPoints.event.register},
    binder.makeSimpleController("registerToEvent",
    {
      parseFunc: function(req: Express.Request): EventInterfaces.RegisterEventData {
        return {
          idUser : Number(req.param("idUser")),
          idEvent: Number(req.param("idEvent"))
        };
      }
    })
  );

  binder.attach(
    {endPoint: endPoints.event.get},
    binder.makeSimpleController("getEvent",
    {
      parseFunc: function(req: Express.Request): EventInterfaces.GetEventData {
        return {
          id: Number(req.param("id"))
        };
      }
    })
  );


}
