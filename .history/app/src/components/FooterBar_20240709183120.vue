<script setup>
const currentYear = new Date().getFullYear();
</script>

<template>
  <div>
    <v-footer class="d-flex flex-column align-center" color="#060608">
      <v-card-text class="grey darken-4 text-center w-100 py-2">
        {{ $t('Contact') }}: thanhlich2103gg@gmail.com
      </v-card-text>
      <v-card-text class="text-center w-100 py-2">
        © Copyright {{ currentYear }} MotPhimMoi.com. All rights reserved.
      </v-card-text>
    </v-footer>
  </div>
</template>
