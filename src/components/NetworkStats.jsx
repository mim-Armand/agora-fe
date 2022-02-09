import {
  ArrowDropDownCircleTwoTone,
  DownloadTwoTone,
  FormatSizeTwoTone,
  GamepadTwoTone,
  HeightTwoTone,
  MusicVideoTwoTone,
  SwitchAccountTwoTone,
  UploadTwoTone,
  VideoFileTwoTone,
  VolumeUpTwoTone,
  WatchLaterTwoTone,
  WaterTwoTone
} from "@mui/icons-material";
import {Tooltip} from "@mui/material";
import * as React from "react";
import * as PropTypes from "prop-types";

export function StatDetails(props) {
  return <span>
              {props.statOpen &&
                <span>
                <UploadTwoTone color={(props.stats.networkStats.uplinkNetworkQuality) ? "success" : "secondary"}/>
                <small>{Math.round(props.stats.rtc.RecvBytes / 1000000)} MB <small>({Math.round(props.stats.rtc.RecvBitrate / 10000) / 100} mb/s)</small></small>
                <DownloadTwoTone color={(props.stats.networkStats.downlinkNetworkQuality) ? "success" : "secondary"}/>
                <small>{Math.round(props.stats.rtc.SendBytes / 1000000)} MB <small>({Math.round(props.stats.rtc.SendBytes / 10000) / 100} mb/s)</small></small><br/>

                <small><WatchLaterTwoTone/>: {props.stats.rtc.Duration}"</small> -
                <Tooltip className="stat-items" title="Outgoing available Bandwidth"><small><WaterTwoTone
                  color="primary"/>: {Math.round(props.stats.rtc.OutgoingAvailableBandwidth)}</small></Tooltip>
                <Tooltip className="stat-items" title="User count"><small><SwitchAccountTwoTone
                  color="primary"/>: {Math.round(props.stats.rtc.UserCount)}</small></Tooltip>
                <Tooltip className="stat-items" title="RTT"><small>RTT: {props.stats.rtc.RTT}</small></Tooltip>
                <br/>
                  {/**/}
                  <Tooltip className="stat-items" title="Capture frame rate"><small><GamepadTwoTone
                    color="primary"/>: {props.stats.video.captureFrameRate}fps</small></Tooltip>
                <Tooltip className="stat-items" title="captureResolutionHeight"><small><HeightTwoTone
                  color="primary"/>: {props.stats.video.captureResolutionHeight}px</small></Tooltip>
                <Tooltip className="stat-items" title="captureResolutionWidth"><small><FormatSizeTwoTone
                  color="primary"/>: {props.stats.video.captureResolutionWidth}px</small></Tooltip>
                <Tooltip className="stat-items" title="codecType"><small><VideoFileTwoTone
                  color="primary"/>{props.stats.video.codecType}</small></Tooltip>
                <Tooltip className="stat-items" title="currentPacketLossRate"><small><ArrowDropDownCircleTwoTone
                  color="primary"/>{props.stats.video.currentPacketLossRate}f</small></Tooltip>
                <br/>
                  {/**/}
                  <Tooltip className="stat-items"
                           title="codecType"><small><MusicVideoTwoTone/>{props.stats.audio.codecType}</small></Tooltip>
                <Tooltip className="stat-items"
                         title="sendVolumeLevel"><small><VolumeUpTwoTone/>{props.stats.audio.sendVolumeLevel}</small></Tooltip>
                  {/*<Tooltip className='stat-items' title='Audio network stats'>*/}
                  {/*  <CloudUploadTwoTone color={(stats?.networkStats?.uplinkNetworkQuality) ? 'success' : 'secondary'}/>*/}
                  {/*  <small>{Math.round(stats?.audio?.sendBytes / 1000000)} MB <small>({Math.round(stats?.audio?.sendBitrate / 10000)/100} mb/s)</small></small>*/}
                  {/*</Tooltip>*/}

                </span>
              }
              </span>;
}


StatDetails.propTypes = {
  statOpen: PropTypes.bool,
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
  })
};