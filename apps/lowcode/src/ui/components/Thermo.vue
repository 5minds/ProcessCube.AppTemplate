<template>
  <div class="pc-widget" style="display:flex;gap:1rem;align-items:center">
    <div>Temp: <strong>{{ valueDisplay }}</strong> °C</div>
    <input type="number" :value="value" @change="onInputChange($event.target.value)" style="width:6rem" />
    <input type="range" :min="min" :max="max" :value="value" @input="onInputChange($event.target.value)" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: "Thermo",
  inject: ['$socket', '$dataTracker'],
  props: ['id','props','state'],
  computed: {
    ...mapState('data', ['messages']),
    msg(){ return this.messages?.[this.id] || { payload: this.props.start ?? 20 } },
    value(){ return Number(this.msg?.payload ?? this.props.start ?? 20) },
    min(){ return Number(this.props.min ?? -50) },
    max(){ return Number(this.props.max ?? 150) },
    valueDisplay(){ return isFinite(this.value) ? this.value : '-' }
  },
  mounted(){
    if (typeof this.$dataTracker === 'function') this.$dataTracker(this.id)
  },
  methods: {
    onInputChange(v){
      const n = Number(v)
      if (!isFinite(n)) return
      this.$socket.emit('widget-change', this.id, n)
    }
  }
}
</script>
