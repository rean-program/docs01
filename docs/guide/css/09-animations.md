# Animations

Learn CSS transitions and animations for interactive effects.

## Introduction

Animations bring your website to life! They provide visual feedback, guide user attention, and make interactions feel smooth and natural.

::: tip Transitions vs Animations
| Transitions | Animations |
|-------------|------------|
| Simple A → B changes | Complex multi-step sequences |
| Triggered by state changes (hover, focus) | Can run automatically |
| Two states only | Multiple keyframes |
| Perfect for: hover effects, focus states | Perfect for: loading spinners, attention grabbers |
:::

### Animation Best Practices

1. **Be subtle** - Too much animation is distracting
2. **Be purposeful** - Animation should serve a function
3. **Be performant** - Stick to `transform` and `opacity` for smooth 60fps
4. **Be accessible** - Respect `prefers-reduced-motion`

## Transitions

Transitions create smooth changes between property values. They're the easiest way to add polish to your site.

### Basic Transition

```css
.button {
    background: #007bff;
    transition: background 0.3s;
}

.button:hover {
    background: #0056b3;
}
```

### Transition Properties

```css
.element {
    /* Individual properties */
    transition-property: background, transform;
    transition-duration: 0.3s;
    transition-timing-function: ease;
    transition-delay: 0s;

    /* Shorthand: property duration timing-function delay */
    transition: background 0.3s ease 0s;

    /* Multiple transitions */
    transition:
        background 0.3s ease,
        transform 0.2s ease-out,
        box-shadow 0.3s;

    /* All properties */
    transition: all 0.3s ease;
}
```

### Timing Functions

```css
.timing {
    transition-timing-function: linear;       /* Constant speed */
    transition-timing-function: ease;         /* Slow-fast-slow (default) */
    transition-timing-function: ease-in;      /* Slow start */
    transition-timing-function: ease-out;     /* Slow end */
    transition-timing-function: ease-in-out;  /* Slow start and end */

    /* Custom bezier curve */
    transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Common Transition Patterns

```css
/* Hover lift effect */
.card {
    transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Color change */
.link {
    color: #333;
    transition: color 0.2s;
}

.link:hover {
    color: #007bff;
}

/* Scale on hover */
.image {
    transition: transform 0.3s;
}

.image:hover {
    transform: scale(1.05);
}

/* Fade in/out */
.fade {
    opacity: 0;
    transition: opacity 0.3s;
}

.fade.visible {
    opacity: 1;
}
```

## Keyframe Animations

More complex animations with multiple steps.

### Defining Keyframes

```css
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideIn {
    0% {
        transform: translateX(-100%);
        opacity: 0;
    }
    100% {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-30px);
    }
    60% {
        transform: translateY(-15px);
    }
}
```

### Animation Properties

```css
.animated {
    /* Individual properties */
    animation-name: fadeIn;
    animation-duration: 1s;
    animation-timing-function: ease;
    animation-delay: 0s;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-fill-mode: forwards;
    animation-play-state: running;

    /* Shorthand */
    animation: fadeIn 1s ease 0s 1 normal forwards running;

    /* Common shorthand */
    animation: fadeIn 1s ease-out;
}
```

### Iteration Count

```css
.loop {
    animation-iteration-count: 1;         /* Once */
    animation-iteration-count: 3;         /* Three times */
    animation-iteration-count: infinite;  /* Forever */
}
```

### Direction

```css
.direction {
    animation-direction: normal;           /* Forward */
    animation-direction: reverse;          /* Backward */
    animation-direction: alternate;        /* Forward then backward */
    animation-direction: alternate-reverse; /* Backward then forward */
}
```

### Fill Mode

```css
.fill {
    animation-fill-mode: none;      /* No styles before/after */
    animation-fill-mode: forwards;  /* Keep end state */
    animation-fill-mode: backwards; /* Apply start state during delay */
    animation-fill-mode: both;      /* Both forwards and backwards */
}
```

### Play State

```css
.pauseable {
    animation: spin 2s linear infinite;
}

.pauseable:hover {
    animation-play-state: paused;
}
```

## Common Animation Examples

### Fade In

```css
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.fade-in {
    animation: fadeIn 0.5s ease-out;
}
```

### Slide In

```css
@keyframes slideInLeft {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideInUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.slide-in-left {
    animation: slideInLeft 0.5s ease-out;
}

.slide-in-up {
    animation: slideInUp 0.3s ease-out;
}
```

### Pulse

```css
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.pulse {
    animation: pulse 2s ease-in-out infinite;
}
```

### Spin

```css
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.spinner {
    animation: spin 1s linear infinite;
}
```

### Shake

```css
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.shake {
    animation: shake 0.5s ease-in-out;
}
```

### Bounce

```css
@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-20px);
    }
    60% {
        transform: translateY(-10px);
    }
}

.bounce {
    animation: bounce 1s ease infinite;
}
```

### Loading Dots

```css
@keyframes dotPulse {
    0%, 80%, 100% {
        transform: scale(0);
    }
    40% {
        transform: scale(1);
    }
}

.loading-dots span {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin: 0 5px;
    background: #007bff;
    border-radius: 50%;
    animation: dotPulse 1.4s ease-in-out infinite;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }
.loading-dots span:nth-child(3) { animation-delay: 0s; }
```

## Transform Property

Used with transitions and animations.

### 2D Transforms

```css
.transform-2d {
    transform: translateX(50px);
    transform: translateY(20px);
    transform: translate(50px, 20px);

    transform: rotate(45deg);

    transform: scale(1.5);
    transform: scale(1.5, 2);
    transform: scaleX(1.5);
    transform: scaleY(2);

    transform: skew(10deg);
    transform: skew(10deg, 5deg);

    /* Multiple transforms */
    transform: translate(50px, 20px) rotate(45deg) scale(1.2);
}
```

### 3D Transforms

```css
.transform-3d {
    transform: rotateX(45deg);
    transform: rotateY(45deg);
    transform: rotateZ(45deg);
    transform: rotate3d(1, 1, 0, 45deg);

    transform: translateZ(50px);
    transform: translate3d(50px, 20px, 10px);

    transform: perspective(500px) rotateY(45deg);
}

/* Enable 3D space for children */
.container-3d {
    perspective: 1000px;
    transform-style: preserve-3d;
}
```

### Transform Origin

```css
.origin {
    transform-origin: center;        /* Default */
    transform-origin: top left;
    transform-origin: 50% 50%;
    transform-origin: 0 0;
}
```

## Performance Tips

### Hardware Acceleration

```css
/* Use transform and opacity for smooth animations */
.smooth {
    transform: translateZ(0);  /* Triggers GPU */
    will-change: transform;    /* Hint for browser */
}
```

### Properties to Animate

```css
/* Fast (compositor-only) */
.fast {
    transform: translateX(100px);
    opacity: 0.5;
}

/* Slower (causes repaint/reflow) */
.slow {
    left: 100px;          /* Avoid */
    width: 200px;         /* Avoid */
    background-color: red; /* Moderate */
}
```

### Reduce Motion

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

## Practice Exercise

Create an animated button:

```css
.animated-button {
    position: relative;
    padding: 12px 24px;
    font-size: 1rem;
    font-weight: 600;
    color: white;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
}

/* Hover lift */
.animated-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

/* Click effect */
.animated-button:active {
    transform: translateY(0);
    box-shadow: 0 5px 10px rgba(102, 126, 234, 0.2);
}

/* Shine effect */
.animated-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        120deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
    );
    transition: left 0.5s;
}

.animated-button:hover::before {
    left: 100%;
}

/* Ripple effect */
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.animated-button .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    transform: scale(0);
    animation: ripple 0.6s linear;
}
```
