import {Button, Card, CardActions, CardContent, IconButton} from "@mui/material";
import Typography from "@mui/material/Typography";
import {MicOffTwoTone, MicTwoTone, VideocamOffTwoTone, VideocamTwoTone} from "@mui/icons-material";
import * as React from "react";
import * as PropTypes from "prop-types";
import {ArgoVideoWrapper} from "./ArgoVideoWrapper";

export function InCallCard(props) {
  return <Card sx={{minWidth: 275}} id="not-in-call-card">
    {props.ready &&
      <ArgoVideoWrapper
        videoTrack={props.tracks[1]}
      />
    }
    <CardContent>
      <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
        Hey there!
      </Typography>
      <Typography variant="h5" component="div">
        Join the room.
      </Typography>
      <Typography sx={{mb: 1.5}} color="text.secondary">
        Room name: "test"
      </Typography>
      <Typography variant="body2">
        Please verify your audio and video and click on the button bellow to join the "test" room.<br/>
        You can also disable your audio / video if you wish to before joining the call.
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" variant="outlined" fullWidth onClick={props.onClick}>JOIN!</Button>
      <IconButton onClick={props.micOff}>
        {(props.trackState.audio) ? <MicOffTwoTone color="secondary"/> : <MicTwoTone color="success"/>}
      </IconButton>
      <IconButton onClick={props.camOff}>
        {(props.trackState.video) ? <VideocamOffTwoTone color="secondary"/> : <VideocamTwoTone color="success"/>}
      </IconButton>
    </CardActions>
  </Card>;
}

InCallCard.propTypes = {
  ready: PropTypes.bool,
  tracks: PropTypes.any,
  onClick: PropTypes.func,
  micOff: PropTypes.func,
  trackState: PropTypes.shape({audio: PropTypes.bool, video: PropTypes.bool}),
  camOff: PropTypes.func
};