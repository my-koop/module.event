import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function endEvent(req: express.Request, res: express.Response) {
  var self: mkevent.Module = this;
  var idEvent = Number(req.param("id"));
  var endAmount = Number(req.param("endAmount"))

  self.endEvent(idEvent, endAmount, function(err) {
    if (err) {
      return res.error(err);
    }

    res.end();
  });
};

export = endEvent;
