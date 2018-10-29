<template>
  <div class="signle-poetry">
    <h1>个性网名</h1>
    
    <div class="poetry-container">
      <div class="item" v-for="poetry in recommendPoetryData" :key="poetry.name">
        <span>{{poetry.femalename}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  asyncData({ store, router }) {
    return store.dispatch("FETCH_RECOMMENDPOETRY", {page: 1})
  },
  computed: {
    recommendPoetryData() {
      return this.$store.state.recommendPoetry
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