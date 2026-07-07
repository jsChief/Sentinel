<script setup lang="ts"></script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <nav class="border-b border-white/10 bg-slate-900/80 backdrop-blur">
      <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p class="text-sm uppercase tracking-[0.3em] text-violet-300">Sentinel</p>
          <h2 class="text-lg font-semibold text-white">Reliability command center</h2>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <router-link
            to="/overview"
            class="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            exact-active-class="bg-violet-500/20 text-white"
          >
            Overview
          </router-link>
          <router-link
            to="/alerts"
            class="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            exact-active-class="bg-violet-500/20 text-white"
          >
            Alerts
          </router-link>
        </div>
      </div>
    </nav>

    <main>
      <router-view />
    </main>
  </div>
</template>
