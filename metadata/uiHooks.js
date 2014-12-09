var uiHooks = {
    navbar_main: {
        events: {
            type: "item",
            content: {
                icon: "calendar",
                text: "event::navbar.events",
                link: "eventsPublic"
            },
            priority: 150
        }
    },
    navbar_main_dashboard: {
        events: {
            content: {
                link: {
                    to: "eventsAdmin",
                    params: {
                        state: "open"
                    }
                }
            },
            permissions: {
                events: {
                    view: true
                }
            }
        },
        quickactions: {
            content: {
                children: {
                    createEvent: {
                        type: "item",
                        content: {
                            icon: "plus",
                            text: "event::navbar.quickActions.createEvent",
                            link: "createEvent"
                        },
                        priority: 100,
                        permissions: {
                            event: {
                                create: true
                            }
                        }
                    },
                },
            }
        }
    },
    sidebar: {
        events: {
            type: "item",
            content: {
                icon: "calendar",
                text: "event::sidebar.events",
                children: {
                    createEvent: {
                        type: "item",
                        content: {
                            icon: "plus",
                            text: "event::navbar.quickActions.createEvent",
                            link: "createEvent"
                        },
                        priority: 100,
                        permissions: {
                            events: {
                                create: true
                            }
                        }
                    },
                    listEvents: {
                        type: "item",
                        content: {
                            icon: "list-ul",
                            text: "event::sidebar.listEvents",
                            link: {
                                to: "eventsAdmin",
                                params: {
                                    state: "open"
                                }
                            }
                        },
                        permissions: {
                            events: {
                                view: true
                            }
                        },
                        priority: 150
                    }
                }
            },
            priority: 200,
            permissions: {
                events: {
                    view: true
                }
            }
        }
    }
};
module.exports = uiHooks;
