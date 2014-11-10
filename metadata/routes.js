function addRoutes(metaData) {
    metaData.addFrontendRoute({
        idPath: ["dashboard", "events", "createEvent"],
        component: "CreateEventPage",
        name: "createEventPage",
        path: "create"
    });
}
exports.addRoutes = addRoutes;
