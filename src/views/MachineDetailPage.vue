<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getRiskClasses, machines, type Machine } from '@/data/dashboard'

const route = useRoute()
const machineId = computed<string>(() => {
  const value = route.params.id
  const resolvedValue = Array.isArray(value) ? (value[0] ?? '') : (value ?? '')
  return resolvedValue
})

const machine = computed<Machine>(() => {
  const match = machines.find((item) => item.id === machineId.value)
  return match ?? (machines[0] as Machine)
})

const chartPoints = computed(() => {
  const values = machine.value?.trend ?? []
  const width = 360
  const height = 180
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1

  return values
    .map((point, index) => {
      const x = (index / (values.length - 1)) * width
      const y = height - ((point - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')
})

const riskHistoryPoints = computed(() => {
  const values = machine.value?.riskHistory ?? []
  const width = 360
  const height = 140
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1

  return values
    .map((point, index) => {
      const x = (index / (values.length - 1)) * width
      const y = height - ((point - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
    <div class="mx-auto flex max-w-7xl flex-col gap-6">
      <header class="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/30">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <router-link to="/overview" class="text-sm text-violet-300 transition hover:text-violet-200">← Back to fleet view</router-link>
            <div class="mt-3 flex items-center gap-3">
              <span class="text-3xl">{{ machine.icon }}</span>
              <div>
                <h1 class="text-3xl font-semibold text-white">{{ machine.name }}</h1>
                <p class="text-sm text-slate-400">Online monitoring and predictive guidance</p>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <div class="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm">
              <p class="text-slate-400">Current risk score</p>
              <p class="mt-1 text-2xl font-semibold text-white">{{ machine.risk }}/100</p>
            </div>
            <span :class="['rounded-full border px-3 py-2 text-sm font-semibold uppercase tracking-[0.2em]', getRiskClasses(machine.risk)]">
              {{ machine.status }}
            </span>
          </div>
        </div>
      </header>

      <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
          <p class="text-sm text-slate-400">Vibration</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ machine.vibration }} mm/s</p>
          <p class="mt-1 text-sm text-rose-300">▲ above baseline</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
          <p class="text-sm text-slate-400">Temperature</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ machine.temperature }} °C</p>
          <p class="mt-1 text-sm text-amber-300">▲ rising steadily</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
          <p class="text-sm text-slate-400">Current draw</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ machine.currentDraw }} A</p>
          <p class="mt-1 text-sm text-violet-300">▲ load shift</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
          <p class="text-sm text-slate-400">Acoustic level</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ machine.acoustic }} dB</p>
          <p class="mt-1 text-sm text-emerald-300">● stable input</p>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div class="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm uppercase tracking-[0.3em] text-violet-300">Trend view</p>
              <h2 class="mt-2 text-xl font-semibold text-white">Critical degrading signal</h2>
            </div>
            <div class="text-sm text-slate-400">Last 6 samples</div>
          </div>
          <div class="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <svg viewBox="0 0 360 180" class="h-56 w-full">
              <line x1="0" y1="150" x2="360" y2="150" stroke="#334155" stroke-width="1" />
              <line x1="0" y1="90" x2="360" y2="90" stroke="#334155" stroke-width="1" />
              <line x1="0" y1="30" x2="360" y2="30" stroke="#334155" stroke-width="1" />
              <line :x1="(machine.thresholds.warning / 8) * 360" y1="0" :x2="(machine.thresholds.warning / 8) * 360" y2="180" stroke="#f59e0b" stroke-dasharray="6 4" />
              <line :x1="(machine.thresholds.critical / 8) * 360" y1="0" :x2="(machine.thresholds.critical / 8) * 360" y2="180" stroke="#fb7185" stroke-dasharray="6 4" />
              <polygon points="0,180 0,120 360,70 360,180" fill="#ac41ff" fill-opacity="0.08" />
              <polyline :points="chartPoints" fill="none" stroke="#ac41ff" stroke-width="3" stroke-linecap="round" />
              <circle cx="360" cy="70" r="6" fill="#f8fafc" />
            </svg>
          </div>
        </div>

        <div class="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
          <p class="text-sm uppercase tracking-[0.3em] text-violet-300">Prediction</p>
          <div class="mt-4 space-y-4">
            <div>
              <p class="text-sm text-slate-400">Estimated time to failure</p>
              <p class="text-3xl font-semibold text-white">{{ machine.projectedFailureDays }} days</p>
            </div>
            <div>
              <p class="text-sm text-slate-400">Contributing factors</p>
              <ul class="mt-2 space-y-2 text-sm text-slate-300">
                <li v-for="factor in machine.contributingFactors" :key="factor" class="rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2">
                  {{ factor }}
                </li>
              </ul>
            </div>
            <div class="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              Confidence is based on the current trend profile and recent sensor shifts.
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div class="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm uppercase tracking-[0.3em] text-violet-300">Risk history</p>
              <h2 class="mt-2 text-xl font-semibold text-white">Score progression over time</h2>
            </div>
            <div class="text-sm text-slate-400">Escalating toward critical</div>
          </div>
          <div class="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <svg viewBox="0 0 360 140" class="h-44 w-full">
              <line x1="0" y1="120" x2="360" y2="120" stroke="#334155" stroke-width="1" />
              <polyline :points="riskHistoryPoints" fill="none" stroke="#f43f5e" stroke-width="3" stroke-linecap="round" />
            </svg>
          </div>
        </div>

        <div class="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
          <p class="text-sm uppercase tracking-[0.3em] text-violet-300">Recommended action</p>
          <div class="mt-4 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4 text-sm text-violet-100">
            {{ machine.recommendedAction }}
          </div>
          <div class="mt-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-400">
            <p class="font-medium text-white">Suggested response window</p>
            <p class="mt-2">Inspect within 5 days to avoid unplanned downtime while preserving production continuity.</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
