var React             = require("react/addons");
var __                = require("language").__;
var BSButton          = require("react-bootstrap/Button");
var reactRouter       = require("react-router");
var routeData         = require("dynamic-metadata").routes;
var MKEventsPublic    = require("./EventsPublic");
var localSession      = require("session").local;

var EventsPage = React.createClass({
  render: function() {
    return (
      <div>
        <h1>
          {__("event::eventWelcome")}
        </h1>
        <MKEventsPublic />
      </div>
    );
  }
});

module.exports = EventsPage;
