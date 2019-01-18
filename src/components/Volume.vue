<template>
    <div>
        <div class="volume-icon"  v-if="!volumeAdjust" @mouseenter="volumeAdjustToggle">    
            <i class="material-icons md-36" v-if="volume > 0" title="Adjust audio">volume_up</i>
            <i class="material-icons md-36" v-else title="Adjust audio">volume_off</i>
        </div>
        <div class="volume-slider" v-else @touchend="volumeAdjustToggle" @mouseleave="volumeAdjustToggle">
            <input type="range" id="volume-slider-input" name="volume-slider" orient="vertical" min="0" max="100" step="1" v-model="volume">
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { mapState } from 'vuex'

export default {
    name: 'Volume',
    computed: {
        ...mapState([
            'volumeAdjust'
        ]),
    volume: {
        get () {
            return this.$store.state.volume
        },
        set (val) {
            this.$store.commit('updateVolume', val)
        }
    }
    },
    methods: {
        ...mapMutations([
            'volumeAdjustToggle'
        ])
    },
    watch: {
        volume() {
            // eslint-disable-next-line
            audio.volume = this.volume / 100
        }
    }
}
</script>

<style>
#volume-slider-input {
    -webkit-appearance: slider-vertical;
    writing-mode: bt-lr;
    height: 40px;
    margin-top: 1px;
    width: 33px;
}
.volume-icon {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: white;
    cursor: pointer;
    margin-top: 5px;
}
.volume-slider {
    color: white;
    cursor: pointer;
}
</style>
