var endpoints = {
    event: {
        list: {
            path: "/event/list",
            method: "get"
        },
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
};
module.exports = endpoints;
