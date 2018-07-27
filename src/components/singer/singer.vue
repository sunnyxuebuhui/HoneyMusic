<template>
  <div class="singer">
    <listview :data="singers" @select="selectSinger"></listview>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  import Listview from 'base/listview/listview'
  import {mapMutations} from 'vuex'

  const HOT_SINGER_LEN = 10
  const HOT_NAME = '热门'

  export default {
    data() {
      return {
        singers: []
      }
    },
    components: {
      Listview
    },
    created() {
      this._getSingerList();
    },
    methods: {
      // 歌手详情页面跳转
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer);
      },
      // 拿到所有歌手数据
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list);
          }
        })
      },
      // 处理歌手接口返回数据做筛选
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        };
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(
              // Singer面向对象 类
              new Singer({
                name: item.Fsinger_name,
                id: item.Fsinger_mid
              })
            )
          }
          const key = item.Findex;
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        })

        // 为了得到所有的有序列表 需要处理map顺序
        let ret = [];
        let hot = [];
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      //状态及里面映射对应数据
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
