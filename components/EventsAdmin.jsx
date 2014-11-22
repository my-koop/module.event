var React             = require("react");
var BSCol             = require("react-bootstrap/Col");
var BSButton          = require("react-bootstrap/Button");
var MKIcon            = require("mykoop-core/components/Icon");
var MKTableSorter     = require("mykoop-core/components/TableSorter");
var MKListModButtons  = require("mykoop-core/components/ListModButtons");
var __                = require("language").__;
var actions           = require("actions");
var MKAlertTrigger    = require("mykoop-core/components/AlertTrigger");
var formatDate        = require("language").formatDate;
var localSession      = require("session").local;


var openColumns = [
  "name",
  "type",
  "registrations",
  "startDate",
  "startAmount",
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
  getInitialState: function() {
    return {
      events: [],
      isClosed : false
    }
  },

  componentDidMount: function() {
    this.updateList();
  },

  updateList: function() {
    var self = this;
    self.setState({
      events: []
    }, function() {
      actions.event.list({
        data: {
          isClosed : this.state.isClosed
        }
      },function (err, res) {
        if (err) {
          MKAlertTrigger.showAlert(__("errors::error", {context: err.context}));
          console.error(err);
          return;
        }

        var events = res.events;
        _.forEach(events, function(event) {
          event.startDate = formatDate(new Date(event.startDate));
          event.endDate = event.endDate != null ? formatDate(new Date(event.endDate)) : "";
        });

        self.setState({events: events});
      });
    });
  },

  actionsGenerator: function(event, i) {
    var self = this;
    if(this.state.isClosed) {
      return [];
    }
    var actionDescriptors = [
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
    ];
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

    // TableSorter Config
    var CONFIG = {
      defaultOrdering: columns[this.state.isClosed],
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
        registrations: {
          // Show the number of people registered to this event
          name: "#" + __("event::registrations"),
          cellGenerator: function() {
            return "TODO";
          }
        },
        startDate: {
          name: __("event::startDate"),
        },
        endDate: {
          name: __("event::endDate"),
        },
        startAmount: {
          name: __("event::startAmount"),
        },
        endAmount: {
          name: __("event::endAmount"),
        },
        actions: {
          name: __("actions"),
          isStatic: true,
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
      <BSCol md={12}>
        <div>
          <BSButton onClick={this.switchIsClosedState}>
            <MKIcon glyph="exchange" />
            {__("event::switchEventState", {context: _(this.state.isClosed).toString()})}
          </BSButton>
          <MKTableSorter
            config={CONFIG}
            items={this.state.events}
            striped
            bordered
            condensed
            hover
          />
        </div>
      </BSCol>
    );
  }
});

module.exports = Events;
