import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function addEvent(req: express.Request, res: express.Response) {
  var self: mkevent.Module = this;
  var data = {        
    type        : req.param("type"),
    startDate   : req.param("startDate"),
    endDate     : req.param("endDate"),
    startAmount : req.param("startAmount"),
    endAmount   : req.param("endAmount")
  };

  self.addEvent(data, function(err) {
    if (err) {
      logger.error(err);
      return res.sendStatus(500);
    }

    res.end();
  });
};

export = addEvent;