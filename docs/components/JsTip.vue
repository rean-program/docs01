<template>
    <div class="tips-container">
        <div
            v-for="(tip, index) in jsTips"
            :key="index"
            class="tip-card"
            :class="{ 'tip-card--active': activeTips.has(index) }"
        >
            <button @click="toggleTip(index)" class="tip-header">
                <div class="tip-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 18h6"/>
                        <path d="M10 22h4"/>
                        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
                    </svg>
                </div>
                <span class="tip-title">{{ tip.title }}</span>
                <span class="tip-arrow" :class="{ 'tip-arrow--open': activeTips.has(index) }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m6 9 6 6 6-6"/>
                    </svg>
                </span>
            </button>

            <Transition name="expand">
                <div v-if="activeTips.has(index)" class="tip-content">
                    <p class="tip-description">{{ tip.description }}</p>

                    <!-- Result Preview -->
                    <div v-if="tip.resultHtml" class="tip-result">
                        <div class="tip-result-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                            <span>Output</span>
                        </div>
                        <div class="tip-result-preview" v-html="tip.resultHtml"></div>
                    </div>

                    <!-- Code Block -->
                    <div v-if="tip.code" class="tip-code">
                        <div class="tip-code-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="16 18 22 12 16 6"/>
                                <polyline points="8 6 2 12 8 18"/>
                            </svg>
                            <span>JavaScript Code</span>
                        </div>
                        <pre><code>{{ tip.code }}</code></pre>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import jsTipsData from './jsTips.json'

interface JsTip {
    title: string
    description: string
    code?: string
    resultHtml?: string
}

const jsTips: JsTip[] = jsTipsData
const activeTips = ref<Set<number>>(new Set())

function toggleTip(index: number) {
    if (activeTips.value.has(index)) {
        activeTips.value.delete(index)
    } else {
        activeTips.value.add(index)
    }
    activeTips.value = new Set(activeTips.value)
}
</script>

<style scoped>
.tips-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
}

.tip-card {
    background: var(--vp-c-bg-soft);
    border-radius: 12px;
    border: 1px solid var(--vp-c-divider);
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.tip-card:hover {
    border-color: #f7df1e;
    box-shadow: 0 4px 16px rgba(247, 223, 30, 0.15);
}

.tip-card--active {
    border-color: #f7df1e;
    box-shadow: 0 4px 20px rgba(247, 223, 30, 0.2);
}

.tip-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background 0.2s ease;
}

.tip-header:hover {
    background: var(--vp-c-bg-mute);
}

.tip-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #f7df1e, #e8c50b);
    border-radius: 10px;
    color: #323330;
    flex-shrink: 0;
}

.tip-title {
    flex: 1;
    font-size: 15px;
    font-weight: 600;
    color: var(--vp-c-text-1);
    line-height: 1.4;
}

.tip-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: var(--vp-c-bg-mute);
    color: var(--vp-c-text-2);
    transition: all 0.3s ease;
    flex-shrink: 0;
}

.tip-arrow--open {
    background: rgba(247, 223, 30, 0.2);
    color: #b8a609;
    transform: rotate(180deg);
}

.tip-content {
    padding: 0 16px 16px 16px;
}

.tip-description {
    margin: 0 0 16px 0;
    padding-left: 48px;
    font-size: 14px;
    color: var(--vp-c-text-2);
    line-height: 1.6;
}

/* Result Preview */
.tip-result {
    margin-bottom: 12px;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid var(--vp-c-divider);
    background: var(--vp-c-bg-alt);
}

.tip-result-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: var(--vp-c-bg-soft);
    border-bottom: 1px solid var(--vp-c-divider);
    font-size: 12px;
    font-weight: 600;
    color: var(--vp-c-text-2);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.tip-result-header svg {
    color: #f7df1e;
}

/* Code Block */
.tip-code {
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid var(--vp-c-divider);
    background: var(--vp-c-bg-alt);
}

.tip-code-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: var(--vp-c-bg-soft);
    border-bottom: 1px solid var(--vp-c-divider);
    font-size: 12px;
    font-weight: 600;
    color: var(--vp-c-text-2);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.tip-code-header svg {
    color: #f7df1e;
}

.tip-code pre {
    margin: 0;
    padding: 16px;
    overflow-x: auto;
}

.tip-code code {
    font-family: var(--vp-font-family-mono);
    font-size: 13px;
    line-height: 1.7;
    color: var(--vp-c-text-1);
    background: none;
}

/* Transition */
.expand-enter-active,
.expand-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
    opacity: 0;
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
}

.expand-enter-to,
.expand-leave-from {
    max-height: 800px;
}

/* Dark mode adjustments */
:root.dark .tip-card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

:root.dark .tip-card:hover {
    box-shadow: 0 4px 16px rgba(247, 223, 30, 0.1);
}

:root.dark .tip-card--active {
    box-shadow: 0 4px 20px rgba(247, 223, 30, 0.15);
}

:root.dark .tip-arrow--open {
    color: #f7df1e;
}
</style>
