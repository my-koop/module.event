import express = require("express");
import Event   = require("../classes/Event");

function getEvents(req: express.Request, res: express.Response) {
  var self: mkevent.Module = this;

  var data: EventInterfaces.GetEventsData = {
    isClosed: req.param("isClosed") === "true",
    startedOnly: req.param("startedOnly") === "true"
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
