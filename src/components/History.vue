<template>
    <div id="history">
      <simplebar id="history-container" data-simplebar-auto-hide="true">
        <div class="history-item" v-for="(song, i) in songHistory.slice(0,29)" :key="i">
          <div class="history-album">
            <a :href="itemUrl(song)" target="_blank"><img :src="itemImg(song)" onerror="this.src='https://radiomv.org/samHTMweb/customMissing.jpg'" alt="song.title" class="history-img"></a>
          </div>
          <div class="history-meta marquee-container">
            <a :href="itemUrl(song)" target="_blank">
              <span class="song-name" :class="[marqueeCheck(song.title, 26) ? 'marquee' : 'normal']">{{ song.title | capitalize }}</span>
            </a>
            <span class="artist">{{ song.artist }}</span>
            <hr>
          </div>
        </div>
      </simplebar>
      <div class="item-history" id="clear" @click="historyToggle">
        <i class="material-icons md-36" title="Click to return to Radio Player">clear</i>
      </div>
      <div class="item-history paused" id="history-play" title="Play/Pause the Radio" @click="playPause" @keyup.space="playPause" :class="[isPlaying ? 'playing' : 'paused']">
        <!-- <i class="material-icons md-36" title="Play/Pause the Radio">play_circle_outline</i> -->
      </div>
      <volume />
    </div>
</template>

<script>
import simplebar from 'simplebar-vue'
import Volume from './Volume.vue'
import { mapMutations } from 'vuex'
import { mapActions } from 'vuex'
import { mapState } from 'vuex'
import 'simplebar/dist/simplebar.min.css'

export default {
  name: 'History',
  components: {
      simplebar,
      Volume
  },
  computed: {
    ...mapState([
      'songHistory',
      'isPlaying'
    ])
  },
  methods: {
    ...mapMutations([
      'historyToggle'
    ]),
    ...mapActions([
      'getSongInfo',
      'playPause',
      'pause'
    ]),
    marqueeCheck(str, num) {
      if(str && str.length > num) {
        return true
      }
    },
    itemImg(item) {
      const url = 'https://radiomv.org/samHTMweb/'
      if (item.picture) {
        return url + item.picture
      } else {
        return url + 'customMissing.jpg'
      }
    },
    itemUrl(item) {
      if (item.buycd) {
        return item.buycd
      } else {
        return 'https://www.radiomv.org'
      }
    }
  },
  created() {
    window.addEventListener('keydown', (e) => {
      if (e.key == ' ') {
        this.playPause()
      }
    })
  }
}
</script>

<style scoped>
.item-history {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  cursor: pointer;
}
#clear {
  grid-area: e;
}
#history-play {
  grid-area: b;
  width: 36px;
  height: 36px;
  cursor: pointer;
  /* dont like this solution... */
  margin-top: 7px;
}
#history-volume {
  grid-area: c;
  margin-top: -5px;
  margin-left: 2px;
}
#history-play.paused {
  background: url("../assets/play.svg");
  background-size: cover; 
}
#history-play.playing {
  background: url("../assets/pause.svg");
  background-size: cover;
}
#history-container {
  grid-area: a;
  overflow: auto;
  padding-left: 5px;
  padding-top: 5px;
  color: white;
  display: inline-flex;
}
.history-item {
  height: 50px;
}
.history-img {
  max-height: 42px;
  max-width: 42px;
  border: 1px solid white;
  border-radius: 10px;
}
.history-album {
  float: left;
  padding-right: 15px;
  width: 50px;
  text-align: center;
}
.history-meta span.song-name {
  font-family: "Open Sans", sans-serif;
  font-weight: 250;
  font-size: 16px;
  color: #fff;
  display: block; }
.history-meta span.artist {
  font-family: "Open Sans", sans-serif;
  font-weight: 100;
  font-size: 12px;
  color: #fff;
  display: block; }
.history-meta hr  {
  border: 0;
  height: 1px;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0)); }
#history {
  margin: inherit;
  background-color: #202136;
  border-radius: 10px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  max-width: 540px;
  max-height: 150px;
  display: grid;
  grid-template-rows: repeat(3, 50px);
  grid-template-columns: 50px auto 40px;
  grid-template-areas:  "a a e"
                        "a a b"
                        "a a c";
}
@media only screen and (max-width: 600px) {
  .history-meta span.song-name {
    font-weight: 200;
    font-size: 14px;
  }
}
@media only screen and (max-width: 480px) {
  .history-meta span.song-name {
    font-weight: 150;
    font-size: 12px;
  }
  #history {
    max-width: 440px;
  }
}
</style>
