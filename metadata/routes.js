function addRoutes(metaData) {
    metaData.addFrontendRoute({
        idPath: ["dashboard", "events", "createEvent"],
        component: "CreateEventPage",
        name: "createEventPage",
        path: "event/create"
    });

    metaData.addFrontendRoute({
        idPath: ["dashboard", "events", "list"],
        component: "EventsPageAdmin",
        name: "eventsAdmin",
        path: "events"
    });

    metaData.addFrontendRoute({
        idPath: ["simple", "events", "list"],
        component: "EventsPagePublic",
        name: "eventsPublic",
        path: "events"
    });
}
exports.addRoutes = addRoutes;
