import * as React from 'react';
import Typography from '@mui/material/Typography';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Grid,
  Tooltip,
  FormGroup, FormControlLabel, Switch
} from "@mui/material";
import {
  MicOffTwoTone,
  MicTwoTone,
  VideocamOffTwoTone,
  VideocamTwoTone,
  UploadTwoTone,
  DownloadTwoTone,
  WatchLaterTwoTone,
  WaterTwoTone,
  SwitchAccountTwoTone,
  GamepadTwoTone,
  HeightTwoTone,
  FormatSizeTwoTone,
  VideoFileTwoTone,
  ArrowDropDownCircleTwoTone,
  MusicVideoTwoTone,
  VolumeUpTwoTone,
} from "@mui/icons-material"
import {useEffect, useState} from "react";
import { AgoraVideoPlayer, createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";
const config = {mode: "rtc", codec: "vp8"}
const useClient = createClient(config);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const CallBox = () => {
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();
  const [inCall, setInCall] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [users, setUsers] = useState([]);
  const [secrets, setSecrets] = useState({});
  const [trackState, setTrackState] = useState({audio: true, video: true});
  const [statOpen, setStatOpen] = useState(false);
  const [stats, setStats] = useState({
    networkStats:{
      uplinkNetworkQuality: 0,
      downlinkNetworkQuality: 0,
    },
    rtc: {
      Duration: 80,
      OutgoingAvailableBandwidth: 1178.756,
      RTT: 32,
      RecvBitrate: 2049536,
      RecvBytes: 19805757,
      SendBitrate: 517824,
      SendBytes: 4937719,
      UserCount: 5
    },
    audio:{
      codecType: "opus",
      currentPacketLossRate: 0,
      sendBitrate: 1,
      sendBytes: 1,
      sendPackets: 0,
      sendPacketsLost: 0,
      sendVolumeLevel: 0
    },
    video: {
      captureFrameRate: 0,
      captureResolutionHeight: 0,
      captureResolutionWidth: 0,
      codecType: "VP8",
      currentPacketLossRate: 0,
      encodeDelay: 0,
      sendBitrate: 0,
      sendBytes: 0,
      sendFrameRate: 0,
      sendPackets: 0,
      sendPacketsLost: 0,
      sendResolutionHeight: 0,
      sendResolutionWidth: 0,
      targetSendBitrate: 0,
      totalDuration: 0,
      totalFreezeTime: 0
    }
  });

  useEffect(()=>{
    console.log('= = = =  = One of channelName, client, ready, tracks was changed = = = = = = =  =')
  }, [channelName, client, ready, tracks]);


  const getSecrets = async (channelName, role, expireTime, uid) => { //todo: incorporate the params in qs
    return fetch(process.env.REACT_APP_AGORA_TOKEN_URL, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      // credentials: 'include',
      headers: {'Content-Type': 'application/json'},
    })
      .then(response => response.json())
      .then(data => {
        setSecrets({
          appId: data.appId,
          token: data.token,
          uid: data.uid,
          expireFromNow: data.expireFromNow,
          channelName: data.channelName,
          role: data.role,
        })
        return data;
        // client.join(appId, name, token, null);
      })
  }
  let init = async (name, secrets) => {
    client.on("user-published", async (user, medyaType) => {
      await client.subscribe(user, medyaType);
      if( medyaType === 'video'){
        setUsers((prevUsers) => {
          return [...prevUsers, user];
        })
      }
      else if( medyaType === 'audio'){
        user.audioTrack.play();
      }
    });

    client.on("user-unpublished", (user, mediaType) => {
      if(mediaType === 'audio'){
        if(user.audioTrack) user.audioTrack.stop();
      }
      else if(mediaType === 'video'){
        setUsers( prevUsers => prevUsers.filter( u => u.uid !== u.uid));
      }
    });

    client.on('exception', (e) => {
      console.error('Exception ::: ', e);
    });

    client.on('user-left', (user) => {
      setUsers( prevUsers => prevUsers.filter( u => u.uid !== u.uid));
    });

    client.on("network-quality", (networkStats) => {
      const rtc = client.getRTCStats();
      const video = client.getLocalVideoStats()
      const audio = client.getLocalAudioStats()
      setStats({networkStats, rtc, video, audio})
    });
    client.on("volume-indicator", (v) => {
      console.info('volume indicator >>>', v);
    })
    client.on("live-streaming-warning", (v) => {
      console.info('live-streaming-warning >>>', v);
    })
    client.on("channel-media-relay-event", (v) => {
      console.info('channel-media-relay-event >>>', v);
    })
    client.on("connection-state-change", (stats)=>{
      console.info('connection-state-change ... ', stats)
    })

    try {
      await client.join(secrets.appId, 'test', secrets.token, null)
    } catch (err){
      console.error('ERRRRR!!', err);
    }

    if(tracks) await client.publish([tracks[0], tracks[1]]);


  };

  const joinRoom = async (channelName) => {
    await getSecrets(channelName)
      .then( secrets => {
        if(ready && tracks && secrets.appId && secrets.token){
          try {
            init(channelName, secrets);
            setInCall(true);
          }catch (err){
            console.error('ERRRR!!! >>', err);
          }
        }
      })

  }
  const leaveRoom = () => {
    client.leave();
    client.removeAllListeners();
    // tracks[0].close();
    // tracks[1].close();
    setInCall(false);
  }

  const mute = async (type) => { // : "audio" | "video"
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  if(!inCall){
    return (
      <Card sx={{ minWidth: 275 }} id="not-in-call-card">
        {ready && <AgoraVideoPlayer videoTrack={tracks[1]} style={{height: '300px', width: '100%'}} />}
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Hey there!
          </Typography>
          <Typography variant="h5" component="div">
            Join the room.
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Room name: "test"
          </Typography>
          <Typography variant="body2">
            Please verify your audio and video and click on the button bellow to join the "test" room.<br/>
            You can also disable your audio / video if you wish to before joining the call.
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" variant="outlined" fullWidth onClick={()=>joinRoom("test")}>JOIN!</Button>
          <IconButton onClick={()=>mute("audio")} >
            {(trackState.audio) ? <MicOffTwoTone color='secondary' /> : <MicTwoTone color='success' />}
          </IconButton>
          <IconButton onClick={()=>mute("video")} >
            {(trackState.video) ? <VideocamOffTwoTone color='secondary' /> : <VideocamTwoTone color='success' />}
          </IconButton>
        </CardActions>
      </Card>
    )
  }

  return (
    <div>
      <Card sx={{ minWidth: 275 }} className="member-cards">
        {ready && <AgoraVideoPlayer videoTrack={tracks[1]} style={{height: '300px', width: '100%'}} />}
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={4}>

            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              You've joined the call!
            </Typography>
            <Typography variant="h5" component="div">
              Room: <code>{secrets.channelName}</code>
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Members: {client.remoteUsers.length + 1}<br/>
              <small>uid: {secrets.uid}</small>
            </Typography>
            </Grid>

            <Grid item xs={8}>
              {/*networkStats, rtc, video, audio*/}

              <FormGroup>
                <FormControlLabel control={<Switch defaultChecked onChange={(s)=>{
                  setStatOpen(s.target.checked);
                }}/>} label="Stats" checked={statOpen}/>
              </FormGroup>

              {statOpen &&
                <span>
                <UploadTwoTone color={(stats.networkStats.uplinkNetworkQuality) ? 'success' : 'secondary'}/>
                <small>{Math.round(stats.rtc.RecvBytes/ 1000000)} MB <small>({Math.round(stats.rtc.RecvBitrate / 10000)/100} mb/s)</small></small>
                <DownloadTwoTone color={(stats.networkStats.downlinkNetworkQuality) ? 'success' : 'secondary'}/>
                <small>{Math.round(stats.rtc.SendBytes/ 1000000)} MB <small>({Math.round(stats.rtc.SendBytes / 10000)/100} mb/s)</small></small><br/>

                <small><WatchLaterTwoTone/>: {stats.rtc.Duration}"</small> -
                <Tooltip className='stat-items' title='Outgoing available Bandwidth'><small><WaterTwoTone color='primary'/>: {Math.round(stats.rtc.OutgoingAvailableBandwidth)}</small></Tooltip>
                <Tooltip className='stat-items' title='User count'><small><SwitchAccountTwoTone color='primary'/>: {Math.round(stats.rtc.UserCount)}</small></Tooltip>
                <Tooltip className='stat-items' title='RTT'><small>RTT: {stats.rtc.RTT}</small></Tooltip>
                <br/>
              {/**/}
                <Tooltip className='stat-items' title='Capture frame rate'><small><GamepadTwoTone color='primary'/>: {stats.video.captureFrameRate}fps</small></Tooltip>
                <Tooltip className='stat-items' title='captureResolutionHeight'><small><HeightTwoTone color='primary'/>: {stats.video.captureResolutionHeight}px</small></Tooltip>
                <Tooltip className='stat-items' title='captureResolutionWidth'><small><FormatSizeTwoTone color='primary'/>: {stats.video.captureResolutionWidth}px</small></Tooltip>
                <Tooltip className='stat-items' title='codecType'><small><VideoFileTwoTone color='primary'/>{stats.video.codecType}</small></Tooltip>
                <Tooltip className='stat-items' title='currentPacketLossRate'><small><ArrowDropDownCircleTwoTone color='primary'/>{stats.video.currentPacketLossRate}f</small></Tooltip>
                <br/>
              {/**/}
                <Tooltip className='stat-items' title='codecType'><small><MusicVideoTwoTone/>{stats.audio.codecType}</small></Tooltip>
                <Tooltip className='stat-items' title='sendVolumeLevel'><small><VolumeUpTwoTone/>{stats.audio.sendVolumeLevel}</small></Tooltip>
              {/*<Tooltip className='stat-items' title='Audio network stats'>*/}
              {/*  <CloudUploadTwoTone color={(stats?.networkStats?.uplinkNetworkQuality) ? 'success' : 'secondary'}/>*/}
              {/*  <small>{Math.round(stats?.audio?.sendBytes / 1000000)} MB <small>({Math.round(stats?.audio?.sendBitrate / 10000)/100} mb/s)</small></small>*/}
              {/*</Tooltip>*/}

                </span>
              }



            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button size="large" variant="outlined"  onClick={()=>leaveRoom()}>Leave room!</Button>
          <IconButton onClick={()=>mute("audio")} >
            {(trackState.audio) ? <MicOffTwoTone color='secondary' /> : <MicTwoTone color='success' />}
          </IconButton>
          <IconButton onClick={()=>mute("video")} >
            {(trackState.video) ? <VideocamOffTwoTone color='secondary' /> : <VideocamTwoTone color='success' />}
          </IconButton>
        </CardActions>
      </Card>

      {users.map( u => {
        return (
          <Card key={u.uid} sx={{ minWidth: 275 }} className="member-cards">
            <AgoraVideoPlayer className='vid' videoTrack={u.videoTrack} style={{height: '300px', width: '100%'}} key={u.uid} />
            <CardContent>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                <small>uid: {u.uid}</small>
              </Typography>
            </CardContent>
          </Card>
        )
      })}


    </div>
  )
}

export default CallBox;