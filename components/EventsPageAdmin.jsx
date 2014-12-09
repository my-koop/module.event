var React  = require("react/addons");
var Router = require("react-router");
var Link = Router.Link;

var BSButton = require("react-bootstrap/Button");

var MKPermissionMixin = require("mykoop-user/components/PermissionMixin");
var MKEventsAdmin     = require("./EventsAdmin");
var MKIcon            = require("mykoop-core/components/Icon");

var __ = require("language").__;

var EventsPage = React.createClass({
  mixins: [MKPermissionMixin],

  goToNewEventPage: function() {
    Router.transitionTo("createEvent");
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
    var canCreateEvents = this.constructor.validateUserPermissions({
      events: {
        create: true
      }
    });

    return (
      <div>
        <h1 className="pull-left">
          {__("event::eventAdminWelcome", {context: this.props.params.state})}
        </h1>
        <span className="pull-right h1">
          {this.renderSwitchStateButton()}
          {" "}
          {canCreateEvents ?
            <BSButton
              onClick={this.goToNewEventPage}
              bsStyle="success"
            >
              <MKIcon glyph="plus" fixedWidth/>
              <span className="hidden-xs">
                {" " + __("event::newEvent")}
              </span>
            </BSButton>
          : null}
        </span>
        <span className="clearfix"/>
        <MKEventsAdmin showClosed={this.showingClosed()}/>
      </div>
    );
  }
});

module.exports = EventsPage;
