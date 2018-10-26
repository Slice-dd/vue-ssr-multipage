<template>
  <div class="signle-poetry">
    <h1>个性签名</h1>
  
    <div class="poetry-container">
      <div class="item title">
        <span>{{recommendPoetryData.title}}</span>
        <span class="author">{{recommendPoetryData.authors}}</span>
      </div>
        
      <div class="item" v-for="poetry in poetryContent" :key="poetry">
        <span>{{poetry}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  asyncData({ store, router }) {
    return store.dispatch("FETCH_RECOMMENDPOETRY")
  },
  computed: {
    recommendPoetryData() {
      return this.$store.state.recommendPoetry
    },
    poetryContent() {
      const content = this.recommendPoetryData.content
      if(content) {
        return content.split('|')
      }
      return []
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
  .title
    margin-bottom: 24px
</style>