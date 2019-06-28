<template>
  <el-select :value="value"
             clearable
             @change="handelChange">
    <el-option v-for="items  in channels"
               :key="items.id"
               :label="items.name"
               :value="items.id"></el-option>
  </el-select>
</template>
<script>
export default {
  name: 'publish',
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      channels: []
    }
  },
  created () {
    this.getChannels()
  },
  methods: {
    getChannels () {
      this.$http({
        method: 'GET',
        url: '/channels'
      }).then(data => {
        // console.log(data)
        this.channels = data.channels
      })
    },
    handelChange (value) {
      this.$emit('input', value)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
