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

    metaData.addFrontendRoute({
        idPath: ["dashboard", "events", "updateEventPage"],
        component: "UpdateEventPage",
        name: "updateEventPage",
        path: "event/update/:id"
    });
}
exports.addRoutes = addRoutes;
