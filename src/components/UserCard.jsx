import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Switch
} from "@mui/material";
import {AgoraVideoPlayer} from "agora-rtc-react";
import Typography from "@mui/material/Typography";
import {StatDetails} from "./NetworkStats";
import {MicOffTwoTone, MicTwoTone, VideocamOffTwoTone, VideocamTwoTone} from "@mui/icons-material";
import * as React from "react";
import * as PropTypes from "prop-types";

export function UserCard(props) {
  return <Card sx={{minWidth: 275}} className="member-cards">
    {props.ready && <AgoraVideoPlayer videoTrack={props.tracks[1]} style={{height: "300px", width: "100%"}}/>}
    <CardContent>
      <Grid container spacing={5}>
        <Grid item xs={4}>

          <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
            You've joined the call!
          </Typography>
          <Typography variant="h5" component="div">
            Room: <code>{props.secrets.channelName}</code>
          </Typography>
          <Typography sx={{mb: 1.5}} color="text.secondary">
            Members: {props.client.remoteUsers.length + 1}<br/>
            <small>uid: {props.secrets.uid}</small>
          </Typography>
        </Grid>

        <Grid item xs={8}>
          {/*networkStats, rtc, video, audio*/}

          <FormGroup>
            <FormControlLabel control={<Switch onChange={props.onChange}/>} label="Stats" checked={props.checked}/>
          </FormGroup>

          <StatDetails statOpen={props.checked} stats={props.stats}/>


        </Grid>
      </Grid>
    </CardContent>
    <CardActions>
      <Button size="large" variant="outlined" onClick={props.onClick}>Leave room!</Button>
      <IconButton onClick={props.cameraOff}>
        {(props.trackState.audio) ? <MicOffTwoTone color="secondary"/> : <MicTwoTone color="success"/>}
      </IconButton>
      <IconButton onClick={props.microphoneOff}>
        {(props.trackState.video) ? <VideocamOffTwoTone color="secondary"/> : <VideocamTwoTone color="success"/>}
      </IconButton>
    </CardActions>
  </Card>;
}

UserCard.propTypes = {
  ready: PropTypes.bool,
  tracks: PropTypes.any,
  secrets: PropTypes.shape({}),
  client: PropTypes.any,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  stats: PropTypes.shape({
    rtc: PropTypes.shape({
      SendBytes: PropTypes.number,
      RTT: PropTypes.number,
      RecvBytes: PropTypes.number,
      UserCount: PropTypes.number,
      SendBitrate: PropTypes.number,
      Duration: PropTypes.number,
      RecvBitrate: PropTypes.number,
      OutgoingAvailableBandwidth: PropTypes.number
    }),
    audio: PropTypes.shape({
      sendBytes: PropTypes.number,
      sendPackets: PropTypes.number,
      sendPacketsLost: PropTypes.number,
      sendVolumeLevel: PropTypes.number,
      currentPacketLossRate: PropTypes.number,
      sendBitrate: PropTypes.number,
      codecType: PropTypes.string
    }),
    video: PropTypes.shape({
      totalDuration: PropTypes.number,
      sendBytes: PropTypes.number,
      captureFrameRate: PropTypes.number,
      sendPacketsLost: PropTypes.number,
      targetSendBitrate: PropTypes.number,
      totalFreezeTime: PropTypes.number,
      codecType: PropTypes.string,
      captureResolutionWidth: PropTypes.number,
      sendPackets: PropTypes.number,
      sendFrameRate: PropTypes.number,
      captureResolutionHeight: PropTypes.number,
      currentPacketLossRate: PropTypes.number,
      encodeDelay: PropTypes.number,
      sendResolutionHeight: PropTypes.number,
      sendBitrate: PropTypes.number,
      sendResolutionWidth: PropTypes.number
    }),
    networkStats: PropTypes.shape({uplinkNetworkQuality: PropTypes.number, downlinkNetworkQuality: PropTypes.number})
  }),
  onClick: PropTypes.func,
  cameraOff: PropTypes.func,
  trackState: PropTypes.shape({audio: PropTypes.bool, video: PropTypes.bool}),
  microphoneOff: PropTypes.func
};