var endpoints = {
  event: {
    list: {
      path: "/events/all/list",
      method: "get"
    },
    public: {
      path: "/events",
      method: "get"
    },
    update: {
      path: "/events/:id",
      method: "post",
      validation: {
        resolve: "validation",
        value: "eventObject"
      }
    },
    start: {
      path: "/events/:id/start",
      method: "post",
    },
    end: {
      path: "/events/:id/end",
      method: "post",
    },
    add: {
      path: "/events",
      method: "post",
      validation: {
        resolve: "validation",
        value: "eventObject"
      }
    },
    get: {
      path: "/events/:id",
      method: "get"
    },
    remove: {
      path: "/events/:id",
      method: "delete"
    },
    listUsers: {
      path: "/events/:id/users",
      method: "get"
    },
    registerAdmin: {
      path: "/events/register/:idEvent/:idUser",
      method: "post"
    },
    unregisterAdmin: {
      path: "/events/unregister/:idEvent/:idUser",
      method: "delete"
    },
    register: {
      path: "/events/:id/register",
      method: "post"
    },
    unregister: {
      path: "/events/:id/register",
      method: "delete"
    },
    notes: {
      new: {
        path: "/events/:id/notes",
        method: "post"
      },
      list: {
        path: "/events/:id/notes",
        method: "get"
      }
    }
  }
}
export = endpoints;
