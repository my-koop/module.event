import express    = require("express");
import Event      = require("../classes/Event");
import getLogger  = require("mykoop-logger");
var logger        = getLogger(module);

function updateEvent(req: express.Request, res: express.Response) {
  var self: mkevent.Module = this;
  var data = {
    name        : req.param("name"),
    type        : req.param("type"),
    startDate   : new Date(req.param("startDate")),
    endDate     : new Date(req.param("endDate") || null),
    startAmount : parseFloat(req.param("startAmount")) || null,
    endAmount   : parseFloat(req.param("endAmount")) || null
  };

  self.updateEvent(data, function(err) {
    if (err) {
      logger.error(err);
      return res.error(err);
    }

    res.end();
  });
};

export = updateEvent;
