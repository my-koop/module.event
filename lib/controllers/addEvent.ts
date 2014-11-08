import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function addEvent(req: express.Request, res: express.Response) {
  var self: mkevent.Module = this;
  var data = {        
    type        : req.param("type"),
    startDate   : new Date(req.param("startDate")),
    endDate     : new Date(req.param("endDate") || null),
    startAmount : parseFloat(req.param("startAmount")) || null,
    endAmount   : parseFloat(req.param("endAmount")) || null
  };

  self.addEvent(data, function(err) {
    if (err) {
      logger.error(err);
      return res.error(err);
    }

    res.end();
  });
};

export = addEvent;