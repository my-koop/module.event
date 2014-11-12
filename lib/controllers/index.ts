import metaData 	= require("../../metadata/index");
import utils 		= require("mykoop-utils");
import validation 	= require("../validation/index");

// Controllers
import addEvent   = require ("./addEvent");
import getEvents  = require ("./getEvents");
import updateEvent  = require ("./updateEvent");

var endPoints = metaData.endpoints;

export function attachControllers(binder) {
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
}
