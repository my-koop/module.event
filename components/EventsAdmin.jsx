var React  = require("react");
var Router = require("react-router");

var BSCol    = require("react-bootstrap/Col");
var BSButton = require("react-bootstrap/Button");

var MKAlertTrigger    = require("mykoop-core/components/AlertTrigger");
var MKTableSorter     = require("mykoop-core/components/TableSorter");
var MKListModButtons  = require("mykoop-core/components/ListModButtons");
var MKStartEventModal = require("./StartEventModal");
var MKEndEventModal   = require("./EndEventModal");

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
  "actions"
];
var closedColumns = [
  "name",
  "type",
  "startDate",
  "endDate",
  "startAmount",
  "endAmount",
  "actions"
];
var columns = {};
columns[true] = closedColumns;
columns[false] = openColumns;

var Events = React.createClass({
  propTypes: {
    showClosed: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      events: [],
      isClosed : false
    }
  },

  componentWillMount: function() {
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

  onEventRemoved: function(event) {
    var events = this.state.events;
    events = _.reject(events, function(_event) {
      return _event === event;
    });
    this.setState({
      events: events
    });
  },

  actionsGenerator: function(event, i) {
    var self = this;
    if(this.props.showClosed) {
      return [
        {
          icon: "edit",
          tooltip: {
            text: __("event::editEventTooltip"),
            overlayProps: {
              placement: "top"
            }
          },
          callback: function() {
            Router.transitionTo("updateEventPage", {id : event.id})
          }
        }
      ];
    }

    var actionDescriptors = [];

    if(event.startAmount == null) {
      actionDescriptors.push(
        {
          icon: "circle-thin",
          tooltip: {
            text: __("event::startEvent"),
            overlayProps: {
              placement: "top"
            }
          },
          modalTrigger: <MKStartEventModal event={event} />
        }
      )
    } else {
      actionDescriptors.push(
        {
          icon: "circle",
          tooltip: {
            text: __("event::endEvent"),
            overlayProps: {
              placement: "top"
            }
          },
          modalTrigger: <MKEndEventModal
            event={event}
            onSave={_.bind(this.onEventRemoved, this, event)}
          />
        }
      )
    }

    actionDescriptors.push(
      {
        icon: "edit",
        tooltip: {
          text: __("event::editEventTooltip"),
          overlayProps: {
            placement: "top"
          }
        },
        callback: function() {
          Router.transitionTo("updateEventPage", {id : event.id})
        }
      },
      {
        icon: "trash",
        warningMessage: __("areYouSure"),
        tooltip: {
          text: __("remove"),
          overlayProps: {placement: "top"}
        },
        callback: function() {
          var id = event.id;
          actions.event.remove(
          {
            data: {
              id : id
            }
          }, function(err, res) {
            if (err) {
              console.error(err);
              MKAlertTrigger.showAlert(__("errors::error", {context: err.context}));
              return;
            }
            var events = self.state.events;
            events.splice(i, 1);
            self.setState({
              events: events
            });
            MKAlertTrigger.showAlert(__("event::removedEventMessage") + ": " + event.name);
          });
        }
      }
    );
    return actionDescriptors;
  },

  switchIsClosedState: function() {
    var self = this;
    var newState = !this.state.isClosed;
    self.setState({
      isClosed: newState
    }, self.updateList);
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
          cellGenerator: function(event) {
            return __("event::" + event.type);
          }
        },
        countRegistered: {
          name: __("event::countRegistered"),
          cellGenerator: function(event) {
            return event.type == "workshop" ? event.countRegistered : "";
          }
        },
        startDate: {
          name: __("event::startDate"),
          cellGenerator: function(event) {
            return event.startDate ? formatDate(event.startDate, "LLL"): "";
          }
        },
        endDate: {
          name: __("event::endDate"),
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
        actions: {
          name: __("actions"),
          isStatic: true,
          headerProps: {
            className: "list-mod-min-width-" + (showClosed ? "1" : "3")
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
