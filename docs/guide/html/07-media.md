# Audio, Video, and Multimedia

Learn how to embed audio, video, and other multimedia content in your web pages.

## Video Element

### Basic Video

```html
<video src="movie.mp4" controls>
    Your browser does not support the video element.
</video>
```

### Video with Multiple Sources

Provide fallback formats for browser compatibility:

```html
<video controls width="640" height="360">
    <source src="movie.mp4" type="video/mp4">
    <source src="movie.webm" type="video/webm">
    <source src="movie.ogg" type="video/ogg">
    Your browser does not support the video element.
</video>
```

### Video Attributes

```html
<video src="movie.mp4"
       controls
       autoplay
       muted
       loop
       poster="thumbnail.jpg"
       width="640"
       height="360"
       preload="metadata">
</video>
```

| Attribute | Purpose |
|-----------|---------|
| `controls` | Show playback controls |
| `autoplay` | Start playing automatically |
| `muted` | Start muted (required for autoplay in most browsers) |
| `loop` | Restart when finished |
| `poster` | Image shown before playing |
| `width` / `height` | Dimensions |
| `preload` | none, metadata, or auto |
| `playsinline` | Play inline on mobile |

### Autoplay Guidelines

```html
<!-- Autoplay requires muted -->
<video autoplay muted loop playsinline>
    <source src="background-video.mp4" type="video/mp4">
</video>

<!-- Better: Let user initiate playback -->
<video controls preload="metadata">
    <source src="video.mp4" type="video/mp4">
</video>
```

::: warning
Most browsers block autoplay with sound. Use `muted` for autoplay, or let users click to play.
:::

## Audio Element

### Basic Audio

```html
<audio src="song.mp3" controls>
    Your browser does not support the audio element.
</audio>
```

### Audio with Multiple Sources

```html
<audio controls>
    <source src="song.mp3" type="audio/mpeg">
    <source src="song.ogg" type="audio/ogg">
    <source src="song.wav" type="audio/wav">
    Your browser does not support the audio element.
</audio>
```

### Audio Attributes

```html
<audio src="podcast.mp3"
       controls
       autoplay
       muted
       loop
       preload="auto">
</audio>
```

### Audio Player Example

```html
<figure>
    <figcaption>Listen to the podcast:</figcaption>
    <audio controls>
        <source src="podcast.mp3" type="audio/mpeg">
        <source src="podcast.ogg" type="audio/ogg">
        Download: <a href="podcast.mp3">MP3</a>
    </audio>
</figure>
```

## Video and Audio Formats

### Video Formats

| Format | MIME Type | Browser Support |
|--------|-----------|-----------------|
| MP4 (H.264) | video/mp4 | All modern browsers |
| WebM (VP9) | video/webm | Chrome, Firefox, Edge |
| Ogg (Theora) | video/ogg | Firefox, Chrome |

### Audio Formats

| Format | MIME Type | Browser Support |
|--------|-----------|-----------------|
| MP3 | audio/mpeg | All modern browsers |
| WAV | audio/wav | All modern browsers |
| Ogg Vorbis | audio/ogg | Firefox, Chrome |
| AAC | audio/aac | All modern browsers |

## Tracks and Captions

Add subtitles, captions, and descriptions:

```html
<video controls>
    <source src="movie.mp4" type="video/mp4">

    <track kind="subtitles"
           src="subtitles-en.vtt"
           srclang="en"
           label="English"
           default>

    <track kind="subtitles"
           src="subtitles-es.vtt"
           srclang="es"
           label="Spanish">

    <track kind="captions"
           src="captions-en.vtt"
           srclang="en"
           label="English Captions">

    <track kind="descriptions"
           src="descriptions-en.vtt"
           srclang="en"
           label="Audio Descriptions">
</video>
```

### Track Kinds

| Kind | Purpose |
|------|---------|
| `subtitles` | Translation of dialogue |
| `captions` | Dialogue + sound effects (for deaf/hard of hearing) |
| `descriptions` | Video content description (for blind users) |
| `chapters` | Chapter navigation |
| `metadata` | For scripts, not displayed |

### WebVTT File Format

```
WEBVTT

00:00:00.000 --> 00:00:04.000
Welcome to our tutorial.

00:00:04.000 --> 00:00:08.000
Today we'll learn about HTML5 video.

00:00:08.000 --> 00:00:12.000
Let's get started!
```

## Embedding External Content

### iframes

Embed content from other sources:

```html
<iframe src="https://example.com/page"
        width="600"
        height="400"
        title="Embedded content description">
</iframe>
```

### YouTube Videos

```html
<iframe width="560"
        height="315"
        src="https://www.youtube.com/embed/VIDEO_ID"
        title="Video title"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
</iframe>
```

### Vimeo Videos

```html
<iframe src="https://player.vimeo.com/video/VIDEO_ID"
        width="640"
        height="360"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
        title="Video title">
</iframe>
```

### Google Maps

```html
<iframe src="https://www.google.com/maps/embed?pb=..."
        width="600"
        height="450"
        style="border:0;"
        allowfullscreen=""
        loading="lazy"
        title="Google Maps location">
</iframe>
```

### iframe Security

```html
<iframe src="https://trusted-site.com"
        sandbox="allow-scripts allow-same-origin"
        referrerpolicy="no-referrer"
        loading="lazy">
</iframe>
```

| Sandbox Value | Allows |
|---------------|--------|
| `allow-scripts` | JavaScript execution |
| `allow-same-origin` | Same-origin access |
| `allow-forms` | Form submission |
| `allow-popups` | Popups |
| `allow-modals` | Modal dialogs |

## Object and Embed

### Object Element

Embed various media types:

```html
<!-- PDF -->
<object data="document.pdf"
        type="application/pdf"
        width="600"
        height="800">
    <p>Your browser doesn't support PDFs.
    <a href="document.pdf">Download the PDF</a>.</p>
</object>

<!-- Flash (legacy) -->
<object data="animation.swf"
        type="application/x-shockwave-flash"
        width="400"
        height="300">
    <param name="movie" value="animation.swf">
    <p>Flash is not supported.</p>
</object>
```

### Embed Element

```html
<embed src="document.pdf"
       type="application/pdf"
       width="600"
       height="800">
```

## SVG Images

### Inline SVG

```html
<svg width="100" height="100" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="40" fill="blue" />
    <text x="50" y="55" text-anchor="middle" fill="white">SVG</text>
</svg>
```

### External SVG

```html
<!-- As image -->
<img src="icon.svg" alt="Icon" width="50" height="50">

<!-- With object (allows styling) -->
<object data="icon.svg" type="image/svg+xml" width="50" height="50">
    <img src="icon.png" alt="Fallback icon">
</object>

<!-- Inline in HTML -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
</svg>
```

## Canvas Element

For drawing graphics via JavaScript:

```html
<canvas id="myCanvas" width="400" height="300">
    Your browser does not support the canvas element.
</canvas>

<script>
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Draw a rectangle
ctx.fillStyle = 'blue';
ctx.fillRect(50, 50, 150, 100);

// Draw text
ctx.font = '20px Arial';
ctx.fillStyle = 'white';
ctx.fillText('Hello Canvas', 70, 110);
</script>
```

## Picture Element for Art Direction

Serve different images for different scenarios:

```html
<picture>
    <!-- Dark mode -->
    <source media="(prefers-color-scheme: dark)"
            srcset="logo-dark.png">

    <!-- Light mode (default) -->
    <img src="logo-light.png" alt="Company Logo">
</picture>

<picture>
    <!-- Different crops for different screens -->
    <source media="(min-width: 1200px)"
            srcset="hero-wide.jpg">
    <source media="(min-width: 768px)"
            srcset="hero-medium.jpg">
    <img src="hero-mobile.jpg" alt="Hero image">
</picture>
```

## Responsive Media

### Responsive Video

```html
<style>
.video-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    height: 0;
    overflow: hidden;
}
.video-container iframe,
.video-container video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/VIDEO_ID"
            title="Video title"
            allowfullscreen>
    </iframe>
</div>
```

### Responsive Images

```html
<img src="image.jpg"
     srcset="image-320.jpg 320w,
             image-640.jpg 640w,
             image-1280.jpg 1280w"
     sizes="(max-width: 320px) 280px,
            (max-width: 640px) 600px,
            1200px"
     alt="Responsive image">
```

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Media Example</title>
    <style>
        .video-container {
            position: relative;
            padding-bottom: 56.25%;
            margin: 20px 0;
        }
        .video-container video {
            position: absolute;
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <main>
        <h1>Multimedia Gallery</h1>

        <section>
            <h2>Video</h2>
            <div class="video-container">
                <video controls poster="poster.jpg">
                    <source src="video.mp4" type="video/mp4">
                    <source src="video.webm" type="video/webm">

                    <track kind="captions"
                           src="captions.vtt"
                           srclang="en"
                           label="English"
                           default>

                    <p>Your browser doesn't support video.
                    <a href="video.mp4">Download the video</a>.</p>
                </video>
            </div>
        </section>

        <section>
            <h2>Audio</h2>
            <figure>
                <figcaption>Background Music:</figcaption>
                <audio controls>
                    <source src="music.mp3" type="audio/mpeg">
                    <source src="music.ogg" type="audio/ogg">
                    <a href="music.mp3">Download audio</a>
                </audio>
            </figure>
        </section>

        <section>
            <h2>Embedded Content</h2>
            <iframe width="560"
                    height="315"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="YouTube video"
                    allowfullscreen>
            </iframe>
        </section>

        <section>
            <h2>SVG Graphics</h2>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <rect width="200" height="200" fill="#f0f0f0"/>
                <circle cx="100" cy="100" r="80" fill="#3498db"/>
                <text x="100" y="110"
                      text-anchor="middle"
                      fill="white"
                      font-size="24">
                    SVG
                </text>
            </svg>
        </section>
    </main>
</body>
</html>
```

## Exercises

### Exercise 1: Video Player
Create a video player with poster image and captions.

::: details Solution
```html
<figure>
    <video controls
           poster="thumbnail.jpg"
           width="640"
           preload="metadata">
        <source src="tutorial.mp4" type="video/mp4">
        <source src="tutorial.webm" type="video/webm">

        <track kind="subtitles"
               src="subtitles-en.vtt"
               srclang="en"
               label="English"
               default>
        <track kind="subtitles"
               src="subtitles-es.vtt"
               srclang="es"
               label="Spanish">

        <p>Your browser doesn't support HTML5 video.</p>
        <a href="tutorial.mp4">Download the video</a>
    </video>
    <figcaption>Tutorial: Getting Started with HTML</figcaption>
</figure>
```
:::

### Exercise 2: Audio Playlist
Create a simple audio playlist with multiple tracks.

::: details Solution
```html
<section>
    <h2>Music Playlist</h2>

    <article>
        <h3>Track 1: Morning Sun</h3>
        <audio controls>
            <source src="track1.mp3" type="audio/mpeg">
            <source src="track1.ogg" type="audio/ogg">
        </audio>
    </article>

    <article>
        <h3>Track 2: Ocean Waves</h3>
        <audio controls>
            <source src="track2.mp3" type="audio/mpeg">
            <source src="track2.ogg" type="audio/ogg">
        </audio>
    </article>

    <article>
        <h3>Track 3: Mountain Air</h3>
        <audio controls>
            <source src="track3.mp3" type="audio/mpeg">
            <source src="track3.ogg" type="audio/ogg">
        </audio>
    </article>
</section>
```
:::

## Summary

- `<video>` and `<audio>` for native media playback
- Provide multiple source formats for compatibility
- Use `controls` for user playback controls
- `autoplay` requires `muted` in most browsers
- `<track>` adds subtitles and captions
- `<iframe>` embeds external content (YouTube, maps, etc.)
- Use `sandbox` for iframe security
- SVG for scalable vector graphics
- `<canvas>` for dynamic graphics with JavaScript
- Always provide fallback content

## Next Steps

Continue to [Advanced Features](/guide/html/08-advanced) to learn about meta tags, SEO, and HTML best practices.
