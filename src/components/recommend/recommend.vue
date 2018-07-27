<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
          <div>
            <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
              <swiper :aspect-ratio="300/800"
                      :loop="true"
                      :auto="true"
                      :interval="2500"
                      dots-position="center"
                      style="width:100%;margin:0 auto;">
                <swiper-item class="swiper-demo-img" v-for="(item, index) in recommends" :key="index">
                  <a :href="item.linkUrl"><img @load="loadImage" :src="item.picUrl"></a>
                </swiper-item>
              </swiper>
            </div>
            <div class="recommend-list">
              <h1 class="list-title">热门歌单推荐</h1>
              <ul>
                <li v-for="(item, index) in discList" @click="selectItem(item)" class="item" :key=index>
                  <div class="icon">
                    <img width="60" height="60"  v-lazy="item.imgurl">
                  </div>
                  <div class="text">
                    <h2 class="name" v-html="item.creator.name"></h2>
                    <p class="desc" v-html="item.dissname"></p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="loading-container" v-show="!discList.length">
            <loading></loading>
          </div>
        </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Slider from 'base/slider/slider'
  import Loading from 'base/loading/loading'
  import Scroll from 'base/scroll/scroll'
  import {getRecommend, getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import { Swiper, SwiperItem } from 'vux'
  import { mapMutations } from 'vuex'

  export default {
    data() {
      return {
        recommends: [],
        discList: []
      }
    },
    components: {
      Slider,
      Loading,
      Scroll,
      Swiper,
      SwiperItem
    },
    created() {
      setTimeout(() => {
        this._getRecommend()
        this._getDiscList()
      }, 20)

    },
    methods: {
      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item)
      },
      loadImage() {
        if (!this.checkloaded) {
          this.checkloaded = true
          this.$refs.scroll.refresh()
        }
      },
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      },
      _getDiscList() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
