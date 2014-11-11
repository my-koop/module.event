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
      items: []
    }
  },

  componentWillMount: function() {
    var self = this;

    actions.inventory.list(function (err, res) {
      if (err) {
        console.error(err);
        return;
      }

      self.setState({items: res.items});
    });
  },

  actionsGenerator: function(item) {
    return [
      {
        icon: "edit",
        tooltip: {
          text: __("inventory::editItem"),
          overlayProps: {
            placement: "top"
          }
        },
        modalTrigger: <MKItemEditModal item={item} />
      },
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
          var id = item.id;
          actions.inventory.item.remove(
          {
            data: {
              id : id
            }
          }, function(err, res){
            if (err) {
              console.error(err);
              return;
            }

            alert(__("inventory::removedItemMessage") + ": " + event.name);
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
        id: {
          name: __("event::eventId"),
        },
        name: {
          name: __("event::name"),
        },
        startDate: {
          name: __("event::startDate"),
        },
        endingDate: {
          name: __("event::endingDate"),
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