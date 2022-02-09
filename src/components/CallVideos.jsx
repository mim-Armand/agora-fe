import {Card, CardContent} from "@mui/material";
import Typography from "@mui/material/Typography";
import * as React from "react";
import * as PropTypes from "prop-types";
import {ArgoVideoWrapper} from "./ArgoVideoWrapper";



export function CallVideos(props) {
  return <Card sx={{minWidth: 275}} className="member-cards">
    <ArgoVideoWrapper
      videoTrack={props.u.videoTrack}
    />
    <CardContent>
      <Typography sx={{mb: 1.5}} color="text.secondary">
        <small>uid: {props.u.uid}</small>
      </Typography>
    </CardContent>
  </Card>;
}

CallVideos.propTypes = {u: PropTypes.any};