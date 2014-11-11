import express = require("express");
import Event   = require("../classes/Event");

function getEvents(req: express.Request, res: express.Response) {
  var self: mkevent.Module = this;
  self.getEvents(function(err, events: Event[]) {
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
