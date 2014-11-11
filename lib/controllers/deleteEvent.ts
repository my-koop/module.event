import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function deleteEvent(req: express.Request, res: express.Response) {
  var self: mkevent.Module = this;
  var idEvent = parseInt(req.param("id"));
  self.deleteEvent(idEvent, function(err) {
    if (err) {
      logger.error(err);
      return res.sendStatus(500);
    }

    res.end();
  });
};

export = deleteEvent;
