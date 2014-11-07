var endpoints = {
  event: {
    update: {
      path: "/event/:id",
      method: "put",
      validation: {
        resolve: "validation",
        value: "updateEvent"
      }
    },
    add: {
      path: "/event/event",
      method: "post"
    },
    get: {
      path: "/events/:id",
      method: "get"
    },
    remove: {
      path: "/events/:id",
      method: "delete"
    }
  }
}
export = endpoints;
