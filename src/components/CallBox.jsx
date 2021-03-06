import * as React from 'react';
import {useEffect, useState} from 'react';
import {createClient, createMicrophoneAndCameraTracks} from "agora-rtc-react";
import {InCallCard} from "./InCallCard";
import {CallVideos} from "./CallVideos";
import {UserCard} from "./UserCard";

const config = {mode: "rtc", codec: "vp8"}
const useClient = createClient(config);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const CallBox = () => {
  const client = useClient();
  const {ready, tracks} = useMicrophoneAndCameraTracks();
  const [inCall, setInCall] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [users, setUsers] = useState([]);
  const [secrets, setSecrets] = useState({});
  const [trackState, setTrackState] = useState({audio: true, video: true});
  const [statOpen, setStatOpen] = useState(false);
  const [stats, setStats] = useState({
    networkStats: {
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
    audio: {
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

  useEffect(() => {
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
      if (medyaType === 'video') {
        setUsers((prevUsers) => {
          return [...prevUsers, user];
        })
      } else if (medyaType === 'audio') {
        user.audioTrack.play();
      }
    });

    client.on("user-unpublished", (user, mediaType) => {
      if (mediaType === 'audio') {
        if (user.audioTrack) user.audioTrack.stop();
      } else if (mediaType === 'video') {
        setUsers(prevUsers => prevUsers.filter(u => u.uid !== u.uid));
      }
    });

    client.on('exception', (e) => {
      console.error('Exception ::: ', e);
    });

    client.on('user-left', (user) => {
      setUsers(prevUsers => prevUsers.filter(u => u.uid !== u.uid));
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
    client.on("connection-state-change", (stats) => {
      console.info('connection-state-change ... ', stats)
    })

    try {
      await client.join(secrets.appId, 'test', secrets.token, null)
    } catch (err) {
      console.error('ERRRRR!!', err);
    }

    if (tracks) await client.publish([tracks[0], tracks[1]]);


  };

  const joinRoom = async (channelName) => {
    await getSecrets(channelName)
      .then(secrets => {
        if (ready && tracks && secrets.appId && secrets.token) {
          try {
            init(channelName, secrets);
            setInCall(true);
          } catch (err) {
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
        return {...ps, audio: !ps.audio};
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return {...ps, video: !ps.video};
      });
    }
  };

  if (!inCall) {
    return (
      <InCallCard
        ready={ready}
        tracks={tracks}
        onClick={() => joinRoom("test")}
        micOff={() => mute("audio")}
        trackState={trackState} camOff={() => mute("video")}
      />
    )
  }

  return (
    <div>
      <UserCard
        ready={ready}
        tracks={tracks}
        secrets={secrets}
        client={client}
        onChange={(s) => {setStatOpen(s.target.checked)}}
        checked={statOpen}
        stats={stats}
        onClick={() => leaveRoom()}
        cameraOff={() => mute("audio")}
        trackState={trackState}
        microphoneOff={() => mute("video")}
      />

      {users.map(u => {
        return (
          <CallVideos key={u.uid} u={u}/>
        )
      })}


    </div>
  )
}

export default CallBox;