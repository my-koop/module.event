var React             = require("react");
var BSCol             = require("react-bootstrap/Col");
var BSButton          = require("react-bootstrap/Button");
var MKIcon            = require("mykoop-core/components/Icon");
var MKTableSorter     = require("mykoop-core/components/TableSorter");
var MKListModButtons  = require("mykoop-core/components/ListModButtons");
var __                = require("language").__;
var actions           = require("actions");

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
        console.error(err);
        return;
      }

      self.setState({events: res.events});
    });
  },

  actionsGenerator: function(event) {
    return [
      {
        icon: "remove",
        warningMessage: __("general::areYouSure"),
        tooltip: {
          text: __("general::remove"),
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
              return;
            }

            alert(__("inventory::removedEventMessage") + ": " + event.name);
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
          name: __("event::name"),
        },
        type: {
          name: __("event::type"),
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
          name: __("event::actions"),
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