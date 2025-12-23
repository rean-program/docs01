<script setup lang="ts">
interface Props {
  src?: string
  youtube?: string
  poster?: string
  width?: string
  autoplay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  autoplay: false
})

const youtubeEmbedUrl = props.youtube
  ? `https://www.youtube.com/embed/${props.youtube}`
  : null
</script>

<template>
  <div class="video-player" :style="{ maxWidth: width }">
    <!-- YouTube Embed -->
    <div v-if="youtubeEmbedUrl" class="video-wrapper">
      <iframe
        :src="youtubeEmbedUrl"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
    </div>

    <!-- Local/External Video -->
    <video
      v-else-if="src"
      controls
      :poster="poster"
      :autoplay="autoplay"
      playsinline
    >
      <source :src="src" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
</template>

<style scoped>
.video-player {
  margin: 1.5rem 0;
}

.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  border-radius: 8px;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

video {
  width: 100%;
  border-radius: 8px;
  background: #000;
}
</style>
