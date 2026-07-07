<script setup lang="ts">
import { computed, ref } from 'vue'
import { alerts, machines } from '@/data/dashboard'

const selectedMachine = ref('all')
const selectedSeverity = ref('all')
const fromDate = ref('2026-07-01')
const toDate = ref('2026-07-06')

const filteredAlerts = computed(() =>
  alerts.filter((alert) => {
    const alertDate = alert.timestamp.split(' ')[0] ?? ''
    const matchesMachine = selectedMachine.value === 'all' || alert.machineId === selectedMachine.value
    const matchesSeverity = selectedSeverity.value === 'all' || alert.severity === selectedSeverity.value
    const matchesRange = alertDate >= fromDate.value && alertDate <= toDate.value
    return matchesMachine && matchesSeverity && matchesRange
  }),
)
</script>

<template>
  <div class="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
    <div class="mx-auto flex max-w-7xl flex-col gap-6">
      <header class="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/30">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm uppercase tracking-[0.3em] text-violet-300">Alert log</p>
            <h1 class="mt-2 text-3xl font-semibold text-white">History and audit trail</h1>
            <p class="mt-3 max-w-2xl text-sm text-slate-400">Every important event is preserved to support decision-making and maintenance follow-up.</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
            <p class="font-semibold text-white">Audit window</p>
            <p class="mt-1">{{ alerts.length }} historical alerts</p>
          </div>
        </div>
      </header>

      <section class="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
        <div class="grid gap-4 md:grid-cols-4">
          <label class="text-sm text-slate-400">
            <span class="mb-2 block">Machine</span>
            <select v-model="selectedMachine" class="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-slate-100">
              <option value="all">All machines</option>
              <option v-for="machine in machines" :key="machine.id" :value="machine.id">{{ machine.name }}</option>
            </select>
          </label>

          <label class="text-sm text-slate-400">
            <span class="mb-2 block">Severity</span>
            <select v-model="selectedSeverity" class="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-slate-100">
              <option value="all">All severities</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
            </select>
          </label>

          <label class="text-sm text-slate-400">
            <span class="mb-2 block">From</span>
            <input v-model="fromDate" type="date" class="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-slate-100" />
          </label>

          <label class="text-sm text-slate-400">
            <span class="mb-2 block">To</span>
            <input v-model="toDate" type="date" class="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-slate-100" />
          </label>
        </div>
      </section>

      <section class="space-y-4">
        <article
          v-for="alert in filteredAlerts"
          :key="alert.id"
          class="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-black/20"
        >
          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div class="flex flex-wrap items-center gap-3">
                <p class="text-sm uppercase tracking-[0.3em] text-slate-500">{{ alert.timestamp }}</p>
                <span :class="alert.severity === 'Critical' ? 'bg-rose-500/15 text-rose-200' : 'bg-amber-500/15 text-amber-200'" class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                  {{ alert.severity }}
                </span>
              </div>
              <h2 class="mt-3 text-xl font-semibold text-white">{{ alert.title }}</h2>
              <p class="mt-2 text-sm text-slate-400">{{ alert.message }}</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
              <p class="font-semibold text-white">{{ machines.find((machine) => machine.id === alert.machineId)?.name }}</p>
              <p class="mt-1">Sensor snapshot captured at alert time</p>
            </div>
          </div>

          <details class="mt-5 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <summary class="cursor-pointer text-sm font-medium text-violet-200">Show sensor values</summary>
            <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div class="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Vibration</p>
                <p class="mt-1 text-lg font-semibold text-white">{{ alert.values.vibration }} mm/s</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Temperature</p>
                <p class="mt-1 text-lg font-semibold text-white">{{ alert.values.temperature }} °C</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Current draw</p>
                <p class="mt-1 text-lg font-semibold text-white">{{ alert.values.currentDraw }} A</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Acoustic</p>
                <p class="mt-1 text-lg font-semibold text-white">{{ alert.values.acoustic }} dB</p>
              </div>
            </div>
          </details>
        </article>
      </section>
    </div>
  </div>
</template>
