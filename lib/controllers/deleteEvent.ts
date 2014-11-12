import express = require("express");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);

function deleteEvent(req: express.Request, res: express.Response) {
  var self: mkevent.Module = this;
  var idEvent = parseInt(req.param("id"));
  self.deleteEvent(idEvent, function(err) {
    if (err) {
      return res.error(err);
    }

    res.end();
  });
};

export = deleteEvent;
