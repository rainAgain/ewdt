<template>
  <div id="order">
    <top-title :title-config="titleConfig"></top-title>
    <div class="content">
      {{msg}}
    </div>
    <foot-guide></foot-guide>
  </div>
</template>
<script>
  import TopTitle from 'TopTitle'
  import FootGuide from 'FootGuide'
  export default {
    name: "order",
    data: () => ({
      msg: 'hello this is order page',
      titleConfig: {
        title: '订单',
        isTitleBlack: 1
      }
    }),
    components: {
      TopTitle,
      FootGuide,
    }
  }
</script>
<style lang="scss" scoped src="../../assets/style/order/order.scss"></style>
