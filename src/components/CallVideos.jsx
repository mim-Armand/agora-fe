import {Card, CardContent} from "@mui/material";
import {AgoraVideoPlayer} from "agora-rtc-react";
import Typography from "@mui/material/Typography";
import * as React from "react";
import * as PropTypes from "prop-types";

export function CallVideos(props) {
  return <Card sx={{minWidth: 275}} className="member-cards">
    <AgoraVideoPlayer className="vid" videoTrack={props.u.videoTrack} style={{height: "300px", width: "100%"}}
    />
    <CardContent>
      <Typography sx={{mb: 1.5}} color="text.secondary">
        <small>uid: {props.u.uid}</small>
      </Typography>
    </CardContent>
  </Card>;
}

CallVideos.propTypes = {u: PropTypes.any};