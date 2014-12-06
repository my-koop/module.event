function addRoutes(metaData) {
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
    metaData.addFrontendRoute({
        idPath: ["dashboard", "events", "notes"],
        component: "EventNotes",
        name: "eventNotes",
        path: "notes/:id",
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
