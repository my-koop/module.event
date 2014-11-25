import express = require("express");
import Event   = require("../classes/Event");

function getEvents(req: express.Request, res: express.Response) {
  var self: mkevent.Module = this;

  var data = {
    isClosed  : req.param("isClosed") != 'false',
  };
  
  self.getEvents(data, function(err, events: Event[]) {
    if (err) {
      res.error(err);
      return;
    }

    res.send({
      events: events
    });
  });
};

export = getEvents;
