function addRoutes(metaData) {
    metaData.addFrontendRoute({
        idPath: ["dashboard", "events", "createEvent"],
        component: "EventPage",
        name: "createEventPage",
        path: "event/create/",
    });
    metaData.addFrontendRoute({
        idPath: ["dashboard", "events", "list"],
        component: "EventsPageAdmin",
        name: "eventsAdmin",
        path: "events",
    });
    metaData.addFrontendRoute({
        idPath: ["public", "events", "list"],
        component: "EventsPagePublic",
        name: "eventsPublic",
        path: "events",
    });
    metaData.addFrontendRoute({
        idPath: ["dashboard", "events", "updateEventPage"],
        component: "EventPage",
        name: "updateEventPage",
        path: "event/update/:id",
    });
}
exports.addRoutes = addRoutes;
