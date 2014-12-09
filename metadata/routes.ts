import utils = require("mykoop-utils");
export function addRoutes(metaData: utils.MetaDataBuilder) {
  metaData.addFrontendRoute({
    idPath: ["dashboard", "events"],
    name: "events",
    path: "events"
  });

  metaData.addFrontendRoute({
    idPath: ["dashboard", "events", "createEvent"],
    i18nKey: "event::navbar.quickActions.createEvent",
    component: "EventPage",
    name: "createEvent",
    path: "create",
    permissions: {
      events: {
        create: true
      }
    }
  });

  metaData.addFrontendRoute({
    idPath: ["dashboard", "events", "list"],
    i18nKey: "event::events",
    component: "EventsPageAdmin",
    name: "eventsAdmin",
    path: "list/:state",
    params: {
      state: ["open", "closed"]
    },
    permissions: {
      events: {
        view: true
      }
    },
  });

  metaData.addFrontendRoute({
    idPath: ["dashboard", "events", "updateEvent"],
    i18nKey: "event::updateEventWelcome",
    component: "EventPage",
    name: "updateEvent",
    path: "update/:id",
    permissions: {
      events: {
        update: true
      }
    }
  });

  metaData.addFrontendRoute({
    idPath: ["dashboard", "events", "notes"],
    i18nKey: "event::eventNotesTitle",
    component: "EventNotes",
    name: "eventNotes",
    path: "notes/:id",
    permissions: {
      events: {
        notes: {
          view: true
        }
      }
    }
  });

  // Public routes
  metaData.addFrontendRoute({
    idPath: ["public", "events"],
    i18nKey: "event::eventPublicWelcome",
    component: "EventsPagePublic",
    name: "eventsPublic",
    path: "events",
  });
}
