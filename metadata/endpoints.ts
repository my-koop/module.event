var endpoints = {
  event: {
    update: {
      path: "/event/:id",
      method: "put"
    },
    add: {
      path: "/event/",
      method: "post",
      validation: {
        resolve: "validation",
        value: "addEvent"
      }
    },
    get: {
      path: "/events/:id",
      method: "get"
    },
    remove: {
      path: "/event/:id",
      method: "delete"
    }
  }
}
export = endpoints;
