function addRoutes(metaData) {
    metaData.addFrontendRoute({
        idPath: ["dashboard", "events"],
        name: "events",
        path: "events"
    });
    metaData.addFrontendRoute({
        idPath: ["dashboard", "events", "createEvent"],
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
        component: "EventsPagePublic",
        name: "eventsPublic",
        path: "events",
    });
}
exports.addRoutes = addRoutes;
