function addRoutes(metaData) {
    metaData.addFrontendRoute({
        idPath: ["dashboard", "events", "createEvent"],
        component: "CreateEventPage",
        name: "createEventPage",
        path: "event/create"
    });

    metaData.addFrontendRoute({
        idPath: ["dashboard", "events", "list"],
        component: "EventsPage",
        name: "events",
        path: "events"
    });
}
exports.addRoutes = addRoutes;
