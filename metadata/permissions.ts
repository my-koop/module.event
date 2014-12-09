var permissions = {
  events: {
    create: true,
    view: true,
    update: true,
    delete: true,
    control: true,
    cancel: true,
    register: true,
    notes: {
      view: true,
      create: true
    },
    users: {
      view: true,
      add: true,
      remove: true
    }
  }
};

export = permissions;
