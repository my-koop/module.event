import utils = require("mykoop-utils");
export function addRoutes(metaData: utils.MetaDataBuilder) {
  
  metaData.addFrontendRoute({
    idPath: ["dashboard", "events", "createEvent"],
    component: "CreateEvenPage",
    name: "createEventPage",
    path: "create",
  });
}
