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

var MKSpinner        = require("mykoop-core/components/Spinner");
var MKEventForm      = require("./EventForm");
var MKAlert          = require("mykoop-core/components/Alert");

var CreateEventPage = React.createClass({

  getInitialState: function() {
    return {
      event: {},
      errorMessage: null,
      success: null
    }
  },

  onContinue: function() {
    return this.setState({
      errorMessage: null,
      success: null
    });
  },

  onFinish: function() {
    reactRouter.transitionTo(routeData.dashboard.children.events.children.list.name);
  },

  isDate: function(date){
    var d = date ? new Date(date) : null;

    if ( Object.prototype.toString.call(d) === "[object Date]" && !(isNaN(d.getTime()))){
      return true;
    }

    return false;
  },

  onSave: function() {
    var self = this;
    var event = this.refs.eventForm.getEvent();
    this.setState({
      event: event
    });

    var isValidForm = this.refs.eventForm.isValidForm();
    
    if(isValidForm){
      MKSpinner.showGlobalSpinner();
      actions.event.add({
        data: event
      }, function(err, body) {
        MKSpinner.hideGlobalSpinner();
        if(err) {
          console.error(err);
          return self.setState({
            errorMessage: __("event::eventNew", {context:"failed"}),
            success: null
          });
        }
        return self.setState({
          errorMessage: null,
          success: __("event::eventNew", {context:"success"})
        });
      });
    }else{
      return self.setState({
        errorMessage: __("event::invalidValues", {context:"failed"}),
        success: null
      });
    }
  },

  render: function() {
    var body;
    if(this.state.success) {
      body = (
        <div>
          <BSAlert bsStyle="success">
            {this.state.success}
          </BSAlert>
          <div className="pull-right">
            <BSButton
              onClick={this.onContinue}
              bsStyle="success"
            >
              {__("continue")}
            </BSButton>
            <BSButton
              onClick={this.onFinish}
              bsStyle="danger"
            >
              {__("finish")}
            </BSButton>
          </div>
        </div>
      );
    } else {
      body = (
        <div>
          <MKAlert bsStyle="danger" permanent>
            {this.state.errorMessage}
          </MKAlert>
          <p>{__("event::eventStartEndExplication")}</p>
          <MKEventForm ref="eventForm" />
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
          {__("event::createEventWelcome")}
        </h1>
        <BSCol md={4}>
          {body}
        </BSCol>
      </div>
    );
  }
});

module.exports = CreateEventPage;
