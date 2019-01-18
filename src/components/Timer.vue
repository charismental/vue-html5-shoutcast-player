<template>
    <div class="item-timer">
        <div class="timer">{{ time || "00:00" }}</div>
    </div>
</template>

<script>
export default {
    name: 'Timer',
    computed: {
        currentTime: function() {
            return this.$store.state.currentTime
        },
        time: function() {
            return this.minutes + ":" + this.seconds
        },
        minutes: function() {
            var min = Math.floor(this.currentTime / 60)
            return min >= 10 ? min : '0' + min
        },
        seconds: function() {
            var sec = this.currentTime - (this.minutes * 60)
            return sec >= 10 ? sec : '0' + sec
        }
    }
}
</script>

<style>
.item-timer {
  grid-area: hh;
  font-size: 36px;
  font-family: 'Yantramanav', sans-serif;
  font-weight: 100;
  text-align: center;
  color: white;
}
.timer {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
