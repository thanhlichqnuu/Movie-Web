<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';
import genreOptions, ts from "@/util/speechRecognition";

const router = useRouter();
const { t } = useI18n();

const year = ref("");
const status = ref("");
const country = ref("");
const genre = ref("");
const emit = defineEmits(["closeFilterModal"]);



const applyFilter = () => {
  const query = {};
  if (year.value) query.year = year.value;
  if (status.value) query.status = status.value;
  if (country.value) query.country = country.value;
  if (genre.value) query.category = genre.value;
  query.page = 1;
  router.push({ query });
  emit("closeFilterModal");
};

const clearFilter = () => {
  year.value = "";
  status.value = "";
  country.value = "";
  genre.value = "";
};
</script>

<template>
  <v-main>
    
    <div class="mt-n10">
      <h3 class="d-flex justify-start">{{ $t('filter') }}</h3>
      <div class="line" />
    </div>

    <v-form @submit.prevent="applyFilter">
      <v-text-field
        v-model="year"
        :label="$t('releaseYearFilter')"
        type="number"
        variant="underlined"
        single-line
      ></v-text-field>
      <v-select
        v-model="status"
        :items="statusOptions"
        :label="$t('statusFilter')"
        item-value="value"
        item-title="text"
        density="comfortable"
      ></v-select>
      <v-select
        v-model="genre"
        :items="genreOptions"
        :label="$t('genreFilter')"
        item-value="value"
        item-title="text"
        density="comfortable"
      ></v-select>
      <v-select
        v-model="country"
        :items="countryOptions"
        :label="$t('countryFilter')"
        item-value="value"
        item-title="text"
        density="comfortable"
      ></v-select>

      <div>
        <v-btn type="submit" color="red" class="mr-4">Filter</v-btn>
        <v-btn @click="clearFilter" color="blue">Clear</v-btn>
      </div>
    </v-form>
  </v-main>
</template>
<style scoped>
.line {
  border: 1px solid #b5e745;
  width: 100%;
}

.v-main {
  padding-right: 2rem;
  padding-left: 2rem;
  padding-bottom: 2rem;
  margin-top: 3rem;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
}

.v-form {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.v-btn:hover {
  opacity: 0.8;
}
</style>
