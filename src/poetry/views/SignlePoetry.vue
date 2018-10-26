<template>
  <div class="signle-poetry">
    <h1>精彩古诗词句</h1>
    <p class="describe">{{signleData.category}}</p>

    <div class="poetry-container">
      <div class="item">
        <span>{{signleData.origin}}</span>
        <span class="author">{{signleData.author}}</span>
        
        <el-row>
          <el-col :span="6" :offset="10">
            
          </el-col>
          <el-col :span="2">
            
          </el-col>
        </el-row>
      </div>

      <div class="item">
        <span>{{signleData.content}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  asyncData({ store, router }) {
    return store.dispatch("FETCH_SINGLEPOETRY")
  },
  computed: {
    signleData() {
      return this.$store.state.singlePoetry
    }
  }
};
</script>

<style lang="stylus">
.signle-poetry 
  text-align: center
  .describe
    font-size: 12px
    margin-bottom: 16px
    color: #999
  h1 
    margin-bottom: 16px
  .item 
    margin-bottom: 16px
    position relative
    .author 
      margin-left 24px
      position: absolute
      color #999
</style>