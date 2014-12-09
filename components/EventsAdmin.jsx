var React  = require("react");
var Router = require("react-router");

var BSCol    = require("react-bootstrap/Col");
var BSButton = require("react-bootstrap/Button");

var MKPermissionMixin = require("mykoop-user/components/PermissionMixin");
var MKAlertTrigger    = require("mykoop-core/components/AlertTrigger");
var MKTableSorter     = require("mykoop-core/components/TableSorter");
var MKListModButtons  = require("mykoop-core/components/ListModButtons");
var MKStartEventModal = require("./StartEventModal");
var MKEndEventModal   = require("./EndEventModal");
var MKUserListWrapper   = require("mykoop-core/components/UserListWrapper");
var MKAbstractModal     = require("mykoop-core/components/AbstractModal");

var language    = require("language");
var __          = language.__;
var actions     = require("actions");
var formatDate  = language.formatDate;
var formatMoney = language.formatMoney;


var openColumns = [
  "name",
  "type",
  "startDate",
  "startAmount",
  "countRegistered",
  "noteCount",
  "actions"
];
var closedColumns = [
  "name",
  "type",
  "startDate",
  "endDate",
  "startAmount",
  "endAmount",
  "noteCount",
  "actions"
];
var columns = {};
columns[true] = closedColumns;
columns[false] = openColumns;

var Events = React.createClass({
  mixins: [MKPermissionMixin],

  propTypes: {
    showClosed: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      events: [],
    }
  },

  canControlEvents: false,
  canEditEvents: false,
  canViewEventNotes: false,
  canDeleteEvents: false,
  canViewUsers: false,
  canAddUsers: false,
  canDeleteUsers: false,
  componentWillMount: function() {
    var validatePermissions = this.constructor.validateUserPermissions;

    this.canControlEvents = validatePermissions({
      events: {
        control: true
      }
    });

    this.canEditEvents = validatePermissions({
      events: {
        edit: true
      }
    });

    this.canViewEventNotes = validatePermissions({
      events: {
        notes: {
          view: true
        }
      }
    });

    this.canDeleteEvents = validatePermissions({
      events: {
        delete: true
      }
    });

    this.canViewUsers = validatePermissions({
      events: {
        users: {
          view: true
        }
      }
    });
    this.canAddUsers = this.canViewUsers && validatePermissions({
      events: {
        users: {
          add: true
        }
      }
    });
    this.canDeleteUsers = this.canViewUsers && validatePermissions({
      events: {
        users: {
          remove: true
        }
      }
    });
    this.updateList(this.props.showClosed);
  },

  componentWillReceiveProps: function (nextProps) {
    if(this.props.showClosed !== nextProps.showClosed) {
      this.updateList(nextProps.showClosed);
    }
  },

  updateList: function(showClosed) {
    var self = this;
    self.setState({
      events: []
    });

    actions.event.list({
      data: {
        isClosed : showClosed
      }
    }, function (err, res) {
      if (err) {
        MKAlertTrigger.showAlert(__("errors::error", {context: err.context}));
        console.error(err);
        return;
      }

      var events = res.events;
      _.forEach(events, function(event) {
        event.startDate = new Date(event.startDate);
        event.endDate = event.endDate != null ? new Date(event.endDate): null;
      });

      self.setState({events: events});
    });
  },

  onEventStarted: function(event, startAmount) {
    event.startAmount = parseFloat(startAmount);
    var events = this.state.events;
    this.setState({
      events: events
    });
  },

  onEventRemoved: function(event) {
    var events = this.state.events;
    events = _.reject(events, function(_event) {
      return _event === event;
    });
    this.setState({
      events: events
    });
  },

  deleteEvent: function(event) {
    var self = this;
    var id = event.id;
    actions.event.remove({
      i18nErrors: {},
      alertErrors: true,
      data: {id: id}
    }, function(err, res) {
      if (!err) {
        self.onEventRemoved(event);
        MKAlertTrigger.showAlert(
          __("event::removedEventMessage") + ": " + event.name
        );
      }
    });
  },

  retrieveUsers: function(event, callback) {
    var self = this;
    actions.event.listUsers({
      i18nErrors: {},
      data: {
        id: event.id
      }
    }, function(err, res) {
      callback(err, res && res.users);
    })
  },
  onAddUser: function(event, user, callback) {
    var self = this;
    actions.event.registerAdmin({
      i18nErrors: {},
      data: {
        idEvent: event.id,
        idUser: user.id
      }
    }, callback);
  },
  onDeleteUser: function(event, user, callback) {
    var self = this;
    actions.event.unregisterAdmin({
      i18nErrors: {},
      data: {
        idEvent: event.id,
        idUser: user.id
      }
    }, callback);
  },

  actionsGenerator: function(event, i) {
    var self = this;
    var showClosed = this.props.showClosed;
    var editEventButton = self.canEditEvents && {
      icon: "edit",
      tooltip: {
        text: __("event::editEventTooltip"),
        overlayProps: {
          placement: "top"
        }
      },
      callback: function() {
        Router.transitionTo("updateEvent", {id : event.id})
      }
    };
    var eventStarted = event.startAmount != null;
    var startEventButton = !showClosed && !eventStarted && self.canControlEvents && {
      icon: "circle-thin",
      tooltip: {
        text: __("event::startEvent"),
        overlayProps: {
          placement: "top"
        }
      },
      modalTrigger: <MKStartEventModal
        event={event}
        onSave={_.partial(this.onEventStarted, event)}
      />
    };
    var endEventButton = !showClosed && eventStarted && self.canControlEvents && {
      icon: "circle",
      tooltip: {
        text: __("event::endEvent"),
        overlayProps: {
          placement: "top"
        }
      },
      modalTrigger: <MKEndEventModal
        event={event}
        onSave={_.partial(this.onEventRemoved, event)}
      />
    };
    var showNotesButton = self.canViewEventNotes && {
      icon: "file-text-o",
      tooltip: {
        text: __("event::showNotes"),
        overlayProps: {
          placement: "top"
        }
      },
      callback: function() {
        Router.transitionTo("eventNotes", {id : event.id})
      }
    };
    var deleteButton = !showClosed && self.canDeleteEvents && {
      icon: "trash",
      warningMessage: __("areYouSure"),
      tooltip: {
        text: __("remove"),
        overlayProps: {placement: "top"}
      },
      callback: _.partial(this.deleteEvent, event)
    }
    var userList = null;
    if(!showClosed && self.canViewUsers) {
      var userList = (
        <MKUserListWrapper
          noAdd={!self.canAddUsers}
          noDelete={!self.canDeleteUsers}
          retrieveUsers={_.partial(self.retrieveUsers, event)}
          onAddUser={_.partial(self.onAddUser, event)}
          onDeleteUser={_.partial(self.onDeleteUser, event)}
        />
      );
      var editEventUsersButton = {
        icon: "users",
        tooltip: {
          text: __("event::editUsersInEvent"),
          overlayProps: {placement: "top"}
        },
        modalTrigger:<MKAbstractModal
          title={__("userList")}
          modalBody={userList}
        />
      };
    }

    var actions = [
      startEventButton,
      endEventButton,
      editEventButton,
      editEventUsersButton,
      showNotesButton,
      deleteButton
    ];
    return _.compact(actions);
  },



  render: function() {
    var self = this;
    var showClosed = this.props.showClosed;
    // TableSorter Config
    var CONFIG = {
      defaultOrdering: columns[showClosed],
      columns: {
        name: {
          name: __("name"),
        },
        type: {
          name: __("event::type"),
          customFilterData: true,
          cellGenerator: function(event) {
            return __("event::" + event.type);
          }
        },
        countRegistered: {
          name: __("event::countRegistered"),
          customFilterData: true,
          cellGenerator: function(event) {
            return event.type == "workshop" ? event.countRegistered : "";
          }
        },
        startDate: {
          name: __("event::startDate"),
          customFilterData: true,
          cellGenerator: function(event) {
            return event.startDate ? formatDate(event.startDate, "LLL"): "";
          }
        },
        endDate: {
          name: __("event::endDate"),
          customFilterData: true,
          cellGenerator: function(event) {
            return event.endDate ? formatDate(event.endDate, "LLL"): "";
          }
        },
        startAmount: {
          name: __("event::startAmount"),
          cellGenerator: function(event) {
            if(event.startAmount !== null) {
              return formatMoney(event.startAmount);
            }
          }
        },
        endAmount: {
          name: __("event::endAmount"),
          cellGenerator: function(event) {
            if(event.endAmount !== null) {
              return formatMoney(event.endAmount);
            }
          }
        },
        noteCount: {
          name: __("event::noteCount")
        },
        actions: {
          name: __("actions"),
          isStatic: true,
          headerProps: {
            className: "list-mod-min-width-" + (showClosed ? "2" : "5")
          },
          cellGenerator: function(event, i) {
            return (
              <MKListModButtons
                defaultTooltipDelay={500}
                buttons={self.actionsGenerator(event, i)}
              />
            );
          }
        }
      }
    };

    return (
      <div>
        <MKTableSorter
          config={CONFIG}
          items={this.state.events}
          striped
          bordered
          condensed
          hover
        />
      </div>
    );
  }
});

module.exports = Events;
