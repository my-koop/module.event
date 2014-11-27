var endpoints = {
    event: {
        list: {
            path: "/event/list",
            method: "get"
        },
        update: {
            path: "/event/update/",
            method: "post"
        },
        start: {
            path: "/event/update/start/:id/:startAmount",
            method: "post",
        },
        end: {
            path: "/event/update/end/:id/:endAmount",
            method: "post",
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
        },
        register: {
            path: "/event/register/:idEvent/:idUser",
            method: "put"
        }
    }
};
module.exports = endpoints;
