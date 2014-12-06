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
        register: {
            path: "/events/register/:idEvent/:idUser",
            method: "post"
        },
        unregister: {
            path: "/events/register/:idEvent/:idUser",
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
};
module.exports = endpoints;
