import metaData = require("../../metadata/index");
import utils = require("mykoop-utils");

import validation = require("../validation/index");

// Controllers
import addEvent                  = require ("./addEvent");

var endPoints = metaData.endpoints;

export function attachControllers(binder) {
   binder.attach(
    {endPoint: endPoints.event.add},
    addEvent
  );
}
