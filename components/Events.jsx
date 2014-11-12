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

var Events = React.createClass({
  getInitialState: function() {
    return {
      events: []
    }
  },

  componentWillMount: function() {
    var self = this;

    actions.event.list(function (err, res) {
      if (err) {
        MKAlertTrigger.showAlert(__("errors::error", {context: err.context}));
        console.error(err);
        return;
      }

      var events = res.events;
      _.forEach(events, function(event) {
        events.startDate = new Date(events.startDate);
        events.endDate = new Date(events.endDate);
      });
      
      self.setState({events: events});
    });
  },

  actionsGenerator: function(event) {
    return [
      {
        icon: "trash",
        warningMessage: __("areYouSure"),
        tooltip: {
          text: __("remove"),
          overlayProps: {
            placement: "top"
          }
        },
        callback: function() {
          var id = event.id;
          actions.event.remove(
          {
            data: {
              id : id
            }
          }, function(err, res){
            if (err) {
              console.error(err);
              MKAlertTrigger.showAlert(__("errors::error", {context: err.context}));
              return;
            }

            MKAlertTrigger.showAlert(__("event::removedEventMessage") + ": " + event.name);
          });
        }
      }
    ];
  },

  render: function() {
    var self = this;

    // TableSorter Config
    var CONFIG = {
      columns: {
        name: {
          name: __("name"),
        },
        type: {
          name: __("event::type"),
        },
        startDate: {
          name: __("event::startDate"),
           cellGenerator: function(event, i) {
            return formatDate(new Date(event.startDate));
          },
        },
        endDate: {
          name: __("event::endDate"),
           cellGenerator: function(event, i) {
            if(event.endDate != null)
              return formatDate(new Date(event.endDate));

            return "";
          },
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
          cellGenerator: function(event) {
            return (
              <MKListModButtons
                defaultTooltipDelay={500}
                buttons={self.actionsGenerator(event)}
              />
            );
          }
        }
      }
    };

    return (
      <BSCol md={12}>
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
      </BSCol>
    );
  }
});

module.exports = Events;