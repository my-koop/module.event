var React  = require("react/addons");
var Router = require("react-router");
var Link = Router.Link;

var BSButton = require("react-bootstrap/Button");

var MKEventsAdmin = require("./EventsAdmin");
var MKIcon        = require("mykoop-core/components/Icon");

var __ = require("language").__;

var EventsPage = React.createClass({

  goToNewEventPage: function() {
    Router.transitionTo("createEventPage");
  },

  showingClosed: function() {
    return this.props.params.state === "closed";
  },

  renderSwitchStateButton: function() {
    var newState = this.showingClosed() ?
      "open" : "closed";
    var to = "eventsAdmin";
    var params = {state: newState};
    return (
      <BSButton
        href={Router.makeHref(to, params)}
        to={to}
        params={params}
        componentClass={Link}
      >
        <MKIcon glyph="exchange" fixedWidth />
        <span className="hidden-xs">
          {" " + __("event::switchEventState", {context: this.props.params.state})}
        </span>
      </BSButton>
    );
  },

  render: function() {
    return (
      <div>
        <h1 className="pull-left">
          {__("event::eventWelcome")}
        </h1>
        <span className="pull-right h1">
          {this.renderSwitchStateButton()}
          {" "}
          <BSButton
            onClick={this.goToNewEventPage}
            bsStyle="success"
          >
            <MKIcon glyph="plus" fixedWidth/>
            <span className="hidden-xs">
              {" " + __("event::newEvent")}
            </span>
          </BSButton>
        </span>
        <span className="clearfix"/>
        <MKEventsAdmin showClosed={this.showingClosed()}/>
      </div>
    );
  }
});

module.exports = EventsPage;
