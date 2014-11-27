import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function startEvent(req: express.Request, res: express.Response) {
  var self: mkevent.Module = this;
  var idEvent = Number(req.param("id"));
  var startAmount = Number(req.param("startAmount"))

  self.startEvent(idEvent, startAmount, function(err) {
    if (err) {
      return res.error(err);
    }

    res.end();
  });
};

export = startEvent;
