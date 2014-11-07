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
            path: "/event/",
            method: "post"
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
};
module.exports = endpoints;
