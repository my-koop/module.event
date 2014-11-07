function addRoutes(metaData) {
    metaData.addFrontendRoute({
        idPath: ["dashboard", "events", "createEvent"],
        component: "CreateEvenPage",
        name: "createEventPage",
        path: "create"
    });
}
exports.addRoutes = addRoutes;
