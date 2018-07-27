<template>
  <scroll class="suggest" 
          :data="result" 
          :pullup="pullup" 
          @scrollToEnd="searchMore"
  >
    <ul class="suggest-list">
        <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
          <div class="icon">
            <i :class="getIconCls(item)"></i>
          </div>
          <div class="name">
            <p class="text" v-html="getDisplayName(item)"></p>
          </div>
        </li>
    </ul>
  </scroll> 
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'

  const TYPE_SINGER = 'singer'
  const perpage = 20  

  export default {
    components: {
      Scroll
    },
    props: {
      showSinger: {
        type: Boolean,
        default: true
      },
      query: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        pullup: true,   // 开启上拉加载
        hasMore: true   // 是否加载完
      }
    },
    methods: {
      searchMore() {

      },
      // 请求接口后搜索数据列表
      search() {
        search(this.query, this.page, this.showSinger).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data)
            console.log(res.data)
          }
        })
      },
      selectItem(item) {
        this.$emit('select', item)
      },
      _genResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      // 是否加载完毕数据
      _checkMore(data) {
        const song = data.song
        if (!song.length || (song.curnum + song.curpage * 20) > song.totalnum) {
          this.hasMore = false
        }
      },
      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
    },
    watch: {
      query() {
        this.search()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>