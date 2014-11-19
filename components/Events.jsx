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
var router            = require("react-router");
var getRouteName      = require("mykoop-utils/frontend/getRouteName");

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
        event.startDate = formatDate(new Date(event.startDate));
        event.endDate = event.endDate != null ? formatDate(new Date(event.endDate)) : "";
      });

      self.setState({events: events});
    });
  },

  actionsGenerator: function(event) {
    var actionDescriptors = [
      {
        icon: "edit",
        tooltip: {
          text: __("event::editEventTooltip"),
          overlayProps: {
            placement: "top"
          }
        },
        callback: function(){
          router.transitionTo(getRouteName(["dashboard", "events", "updateEventPage"]), {id : event.id})
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
    if(localSession.user) {
      actionDescriptors.push(
        {
          icon: "check",
          warningMessage: __("areYouSure"),
          tooltip: {
            text: __("event::registerToEventPrompt"),
            overlayProps: {placement: "top"}
          },
          callback: function() {
            actions.event.register(
            {
              data: {
                idEvent : event.id,
                idUser  : localSession.user.id
              }
            }, function(err, res){
              if (err || !res.success) {
                console.error(err);
                MKAlertTrigger.showAlert(__("errors::error", {context: err.context}));
                return;
              }
              if(res.success) {
                MKAlertTrigger.showAlert(__("event::registeredToEventConfirmation") + ": " + event.name);
              }
            });
          }
        }
      );
    }
    return actionDescriptors;
  },

  render: function() {
    var self = this;

    // TableSorter Config
    var CONFIG = {
      defaultOrdering: [
        "name", "type", "startDate", "endDate",
        "startAmount", "endAmount", "actions"
      ],
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
