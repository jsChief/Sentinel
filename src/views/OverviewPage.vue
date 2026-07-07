<script setup lang="ts">
import { computed } from 'vue'
import { machines, getRiskClasses, getRiskTone } from '@/data/dashboard'

const criticalMachine = computed(() => machines.find((machine) => machine.status === 'Critical'))
const healthCount = computed(() => machines.filter((machine) => machine.status !== 'Normal').length)

function buildSparkline(points: number[]) {
  const width = 140
  const height = 56
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1

  return points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * width
      const y = height - ((point - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
    <div class="mx-auto flex max-w-7xl flex-col gap-6">
      <header class="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/30">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm uppercase tracking-[0.3em] text-violet-300">Sentinel Plant</p>
            <h1 class="mt-2 text-3xl font-semibold text-white sm:text-4xl">Predictive maintenance overview</h1>
            <p class="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
              The fleet is presenting a clear early-warning picture, with the highest-risk equipment flagged for action.
            </p>
          </div>
          <div class="rounded-2xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-sm text-violet-200">
            <p class="font-semibold">Current date</p>
            <p class="mt-1 text-lg text-white">07 Jul 2026 · 08:20</p>
          </div>
        </div>
      </header>

      <section class="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/30">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="text-sm uppercase tracking-[0.3em] text-amber-300">Plant health</p>
            <h2 class="mt-2 text-2xl font-semibold text-white">{{ healthCount }} machines need attention</h2>
            <p class="mt-2 text-sm text-slate-400">The platform surfaces risk before failure and highlights the next best action.</p>
          </div>
          <div class="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            <p class="font-semibold">Critical alert</p>
            <p class="mt-1 text-white">{{ criticalMachine?.name }} is trending into failure.</p>
          </div>
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-3">
        <div class="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
          <p class="text-sm text-slate-400">Machines monitored</p>
          <p class="mt-2 text-3xl font-semibold text-white">{{ machines.length }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
          <p class="text-sm text-slate-400">Active warnings</p>
          <p class="mt-2 text-3xl font-semibold text-white">{{ healthCount }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
          <p class="text-sm text-slate-400">Downtime avoided</p>
          <p class="mt-2 text-3xl font-semibold text-white">18.4 hrs</p>
        </div>
      </section>

      <section class="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="machine in machines"
          :key="machine.id"
          class="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-black/20"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-2xl">{{ machine.icon }}</span>
                <h3 class="text-xl font-semibold text-white">{{ machine.name }}</h3>
              </div>
              <p class="mt-2 text-sm text-slate-400">{{ machine.summary }}</p>
            </div>
            <span :class="['rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]', getRiskClasses(machine.risk)]">
              {{ machine.status }}
            </span>
          </div>

          <div class="mt-6 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div
                class="flex h-16 w-16 items-center justify-center rounded-full"
                :style="{ background: `conic-gradient(${getRiskTone(machine.risk)} 0 ${machine.risk}%, #111827 ${machine.risk}% 100%)` }"
              >
                <div class="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                  {{ machine.risk }}
                </div>
              </div>
              <div>
                <p class="text-sm text-slate-400">Risk score</p>
                <p class="text-xl font-semibold text-white">{{ machine.risk }}/100</p>
              </div>
            </div>
            <router-link
              :to="{ name: 'machine-detail', params: { id: machine.id } }"
              class="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20"
            >
              View details
            </router-link>
          </div>

          <div class="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <div class="flex items-center justify-between text-sm text-slate-400">
              <span>Recent trend</span>
              <span>{{ machine.trend.at(-1) }} mm/s</span>
            </div>
            <svg viewBox="0 0 140 56" class="mt-3 h-16 w-full">
              <polyline
                :points="buildSparkline(machine.trend)"
                fill="none"
                stroke="#ac41ff"
                stroke-width="3"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </article>
      </section>
    </div>
  </div>
</template>
