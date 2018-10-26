<template>
  <div class="signle-poetry">
    <h1>小说榜111222222555555</h1>
    <div v-for="i in signleData" :key="i.bid"> 
      <p>{{i.bookname}}</p>
      <p>{{i.introduction}}</p>
      <p>{{i.tag}}</p>
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