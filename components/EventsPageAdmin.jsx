var React             = require("react/addons");
var __                = require("language").__;
var BSButton          = require("react-bootstrap/Button");
var reactRouter       = require("react-router");
var routeData         = require("dynamic-metadata").routes;
var localSession      = require("session").local;

var MKEventsAdmin     = require("./EventsAdmin");
var MKIcon = require("mykoop-core/components/Icon");

var EventsPage = React.createClass({
  goToNewEventPage: function() {
    reactRouter.transitionTo(routeData.dashboard.children.events.children.createEvent.name);
  },

  render: function() {
    return (
      <div>
        <h1 className="pull-left">
          {__("event::eventWelcome")}
        </h1>
        <span className="pull-right h1">
          <BSButton
            onClick={this.goToNewEventPage}
            bsStyle="success"
          >
            <MKIcon glyph="plus" fixedWidth/>
            {__("event::newEvent")}
          </BSButton>
        </span>
        <MKEventsAdmin />
      </div>
    );
  }
});

module.exports = EventsPage;
