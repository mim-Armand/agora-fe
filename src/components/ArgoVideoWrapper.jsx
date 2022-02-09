import {AgoraVideoPlayer} from "agora-rtc-react";
import * as React from "react";
import * as PropTypes from "prop-types";

export function ArgoVideoWrapper(props) {
  return <AgoraVideoPlayer
    className="vid"
    videoTrack={props.videoTrack}
    style={{height: "300px", width: "100%"}}
  />;
}

ArgoVideoWrapper.propTypes = {u: PropTypes.any};