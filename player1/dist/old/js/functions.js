new Vue({
  el: "#app",
  data() {
    return {
      currentStream: 'http://136.0.16.57:8000/.stream',
      isPlaying: false,
      songInfo: '',
      refreshInterval: 10000,
      interval: '',
      url: 'https://radiomv.org/samHTMweb/info.json',
    }
  },
  methods: {
    playPause() {
      if (audio.paused) {
        audio.play()
        this.isPlaying = true
      } else {
        audio.pause()
        this.isPlaying = false
      }
    },
    getSongInfo() {
      axios
        .get(this.url)
        .then(response => {
          this.songInfo = response.data.song_info
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  computed: {
    picSrc() {
      return `https://radiomv.org/samHTMweb/${this.songInfo.picture}`
    }
  },
  created() {
    this.getSongInfo()
    this.interval = setInterval(this.getSongInfo, this.refreshInterval)
    window.addEventListener('keydown', (e) => {
      if (e.key == ' ') {
        this.playPause()
      }
    })
  }
})
