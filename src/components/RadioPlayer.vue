<template>
  <div id="radio-player">
    <history v-show="history" />
    <player v-show="!history" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { mapMutations } from 'vuex'
import { mapState } from 'vuex'
import History from './History.vue'
import Player from './Player.vue'
// import axios from 'axios'

export default {
  name: 'RadioPlayer',
  components: {
    History,
    Player
  },
  methods: {
    ...mapActions([
      'getSongInfo'
    ]),
    ...mapMutations([
      'newInterval'
    ])
  },
  created() {
    this.getSongInfo()
    this.newInterval(setInterval(this.getSongInfo, this.refreshInterval))
  },
  computed: {
    ...mapState([
      'refreshInterval'
    ]),
    history: function() {
      return this.$store.state.history
    }
  }
}
</script>

<style>
a { text-decoration: none; }

#radio-player {
  margin: 50px auto;
}

.material-icons.md-36 { font-size: 36px; }

@keyframes marquee {
  0% { transform: translateX(100%) }
  100% { transform: translateX(-115%) }
}

@-webkit-keyframes marquee {
  0% { transform: translateX(100%) }
  100% { transform: translateX(-115%) }
}

.marquee-container {
  overflow: hidden;
}
.marquee {
  white-space: nowrap;
  animation: marquee 8s linear infinite;
  -webkit-animation: marquee 8s linear infinite;
}
.marquee:hover {
  -webkit-animation-play-state: paused;
  animation-play-state: paused;
}

</style>
