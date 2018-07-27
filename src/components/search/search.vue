<template>
  <div class="search">
    <search-box ref="searchBox" @query="onQueryChange"></search-box>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="(item, index) in hotkey" @click="setQuery(item)" :key="index">
              <span>{{ item.k }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest @select="saveSearch" :query="query"></suggest>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import Suggest from 'components/suggest/suggest'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'

  export default {
    components: {
      SearchBox,
      Suggest
    },
    data() {
      return {
        hotkey: [],
        query: ''
      }
    },
    created() {
      this._getHotKey()
    },
    methods: {
      saveSearch() {

      },
      onQueryChange(query) {
        // 子组件search-box监听了自己的query数据 变化讲抛发出一个query方法
        // 然后给自组件的query值赋值了同时  也给当前页面赋值了query
        this.query= query
      },
      // 父组件调用子组件
      setQuery(query) {
        this.$refs.searchBox.setQuery(query.k)
      },

      _getHotKey() {
        let that = this
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            that.hotkey = res.data.hotkey.slice(0, 10)
            console.log(that.hotkey)
          }
        })
      },

    },
    watch: {
      
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>