<template>
  <div class="pc-widget" style="display:flex;gap:0.5rem;align-items:center">
    <div>Hallo {{ props.label || 'Welt' }}!</div>
    <button @click="emitAction">Sagen</button>
    <small v-if="lastMsg">zuletzt: {{ lastMsg.payload }}</small>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: "Hello",
  inject: ['$socket'],
  props: ['id','props','state'],
  computed: {
    ...mapState('data', ['messages']),
    lastMsg(){ return this.messages?.[this.id] || null }
  },
  methods: {
    emitAction(){
      const msg = { payload: `Hallo ${this.props.label || 'Welt'}`, topic: 'hello/action' }
      this.$socket.emit('widget-action', this.id, msg)
    }
  }
}
</script>
