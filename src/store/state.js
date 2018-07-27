import {playMode} from 'common/js/config'

const state = {
  singer: {},           // 歌手列表
  playing: false,       // 默认播放
  fullScreen: false,    // 全屏播放
  playlist: [],         // 播放列表
  sequenceList: [],     // 右下角播放顺序列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1,      // 当前播放索引
  disc: {}
}

export default state
