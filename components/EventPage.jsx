var React           = require("react/addons");
var BSButton        = require("react-bootstrap/Button");
var BSButtonGroup   = require("react-bootstrap/ButtonGroup");
var BSCol           = require("react-bootstrap/Col");
var BSAlert         = require("react-bootstrap/Alert");
var BSModal         = require("react-bootstrap/Modal");
var reactRouter     = require("react-router");
var routeData       = require("dynamic-metadata").routes;
var actions         = require("actions");
var __              = require("language").__;

var MKEventForm      = require("./EventForm");
var MKAlert          = require("mykoop-core/components/Alert");
var MKFeedbacki18nMixin = require("mykoop-core/components/Feedbacki18nMixin");

var CreateEventPage = React.createClass({
  mixins: [MKFeedbacki18nMixin],

  getDefaultProps: function() {
    return {
      params: {}
    }
  },

  getInitialState: function() {
    return {
      // 0: editing, 1: select next action
      editingState: 0
    }
  },

  onContinue: function() {
    return this.setState({
      editingState: 0
    });
  },

  onFinish: function(showOpen) {
    var destination = showOpen ? "open" : "closed";
    reactRouter.transitionTo("eventsAdmin", {state: destination});
  },

  onSave: function() {
    var self = this;
    var event = this.refs.eventForm.getEvent();
    var isEditing = !!this.props.params.id;
    var action = isEditing ?
      actions.event.update
    : actions.event.add;
    var data = _.merge({id: this.props.params.id}, event);

    this.clearFeedback();
    action({
      i18nErrors: {
        keys: ["app"],
        prefix: "event::eventDataErrors"
      },
      data: data
    }, function(err, body) {
      if(err) {
        console.error(err);
        return self.setFeedback(err.i18n, "danger");
      }


      self.setFeedback(
        {key: "event::eventNew_success"},
        "success"
      );
      if(!isEditing) {
        self.setState({
          editingState: 1
        });
      } else {
        self.onFinish(!event.endDate);
      }
    });
  },

  render: function() {
    var body;
    if(this.state.editingState === 1) {
      body = (
        <div className="pull-right">
          <BSButton
            onClick={this.onContinue}
            bsStyle="success"
          >
            {__("continue")}
          </BSButton>
          <BSButton
            onClick={_.partial(this.onFinish, true)}
            bsStyle="danger"
          >
            {__("finish")}
          </BSButton>
        </div>
      );
    } else {
      body = (
        <div>
          <MKEventForm
            ref="eventForm"
            id={parseInt(this.props.params.id)}
            onWarning={this.setFeedback}
          />
          <br/>
          <BSButton
            onClick={this.onSave}
            className="pull-right"
            bsStyle="success"
          >
            {__("save")}
          </BSButton>
        </div>
      );
    }

    return (
      <div>
        <h1>
        {
          this.props.params.id ?
            __("event::updateEventWelcome")
          : __("event::createEventWelcome")
        }
        </h1>
        {this.renderFeedback()}
        <BSCol md={5}>
          {body}
        </BSCol>
      </div>
    );
  }
});

module.exports = CreateEventPage;
