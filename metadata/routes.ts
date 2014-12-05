import utils = require("mykoop-utils");
export function addRoutes(metaData: utils.MetaDataBuilder) {
  metaData.addFrontendRoute({
    idPath: ["dashboard", "events"],
    name: "events",
    path: "events"
  });

  metaData.addFrontendRoute({
    idPath: ["dashboard", "events", "createEvent"],
    component: "EventPage",
    name: "createEventPage",
    path: "create",
  });

  metaData.addFrontendRoute({
    idPath: ["dashboard", "events", "list"],
    component: "EventsPageAdmin",
    name: "eventsAdmin",
    path: "list/:state",
    params: {
      state: ["open", "closed"]
    }
  });

  metaData.addFrontendRoute({
    idPath: ["dashboard", "events", "updateEventPage"],
    component: "EventPage",
    name: "updateEventPage",
    path: "update/:id",
  });

  // Public routes
  metaData.addFrontendRoute({
    idPath: ["public", "events"],
    component: "EventsPagePublic",
    name: "eventsPublic",
    path: "events",
  });
}
