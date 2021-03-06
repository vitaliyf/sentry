import React from "react";
import Router from "react-router";
import GroupList from "../components/groupList";

var ReleaseNewEvents = React.createClass({
  contextTypes: {
    router: React.PropTypes.func,
    release: React.PropTypes.object
  },

  render() {
    var params = this.context.router.getCurrentParams();
    return (
      <div>
        <div className="alert alert-block">
          <Router.Link to="stream" params={{
            orgId: params.orgId,
            projectId: params.projectId
          }} query={{
            query: "first-release:" + this.context.release.version
          }}>
            <span className="icon icon-open"></span> View new events seen in this release in the stream
          </Router.Link>
        </div>
        <GroupList
          query={'first-release:"' + this.context.release.version + '"'}
          canSelectGroups={false} bulkActions={false} />
      </div>
    );
  }
});

export default ReleaseNewEvents;
