<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {
    mapGetters
  } from 'vuex'
  import {
    getSongList
  } from 'api/recommend'
  import {
    ERR_OK
  } from 'api/config'
  
  
  export default {
    name: "disc",
    components: {
      MusicList
    },
    data() {
      return {
  
      }
    },
    created() {
      this._getSongList();
    },
    mounted() {
      console.log(this.disc)
    },
    methods: {
      _getSongList() {
        // 调用歌单详情列表数据
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }
        getSongList(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            console.log(res)
          }
        })
      }
    },
    computed: {
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to 
    transform: translate3d(100%, 0, 0)
</style>
