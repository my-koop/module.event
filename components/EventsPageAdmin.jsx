var React             = require("react/addons");
var __                = require("language").__;
var BSButton          = require("react-bootstrap/Button");
var reactRouter       = require("react-router");
var routeData         = require("dynamic-metadata").routes;
var MKEventsAdmin     = require("./EventsAdmin");
var localSession      = require("session").local;

var EventsPage = React.createClass({
  goToNewEventPage: function() {
    reactRouter.transitionTo(routeData.dashboard.children.events.children.createEvent.name);
  },

  render: function() {
    return (
      <div>
        <h1>
          {__("event::eventWelcome")}
        </h1>
        <BSButton
          onClick={this.goToNewEventPage}
          bsStyle="success"
        >
          {__("event::newEvent")}
        </BSButton>
       
        <MKEventsAdmin />
      </div>
    );
  }
});

module.exports = EventsPage;
