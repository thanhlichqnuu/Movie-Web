<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useFilterCriteria } from "@/util/filterCriteria.js";

const router = useRouter();
const { statusOptions, countryOptions, categoryOptions } = useFilterCriteria();

const filters = ref({
  year: "",
  status: "",
  country: "",
  category: ""
});

const emit = defineEmits(["closeFilterModal"]);

const applyFilter = () => {
  const query = { ...filters.value, page: 1 };
  
  Object.keys(query).forEach(key => {
    if (query[key] === "") {
      delete query[key];
    }
  });

  router.push({ query });
  emit("closeFilterModal");
}

const clearFilter = () => {
  filters.value = { year: "", status: "", country: "", category: "" };
  router.push({ query: { page: 1 } });
  emit("closeFilterModal");
};
</script>

<template>
  <v-main>
    <div class="mt-n10">
      <h3 class="d-flex justify-start">{{ $t("filter") }}</h3>
      <div class="line" />
    </div>

    <v-form @submit.prevent="applyFilter">
      <v-text-field
        v-model="filters.year"
        :label="$t('releaseYearFilter')"
        type="number"
        variant="underlined"
        single-line
      ></v-text-field>
      <v-select
        v-model="filters.status"
        :items="statusOptions"
        :label="$t('statusFilter')"
        item-value="value"
        item-title="text"
        density="comfortable"
      ></v-select>
      <v-select
        v-model="filters.category"
        :items="categoryOptions"
        :label="$t('categoryFilter')"
        item-value="value"
        item-title="text"
        density="comfortable"
      ></v-select>
      <v-select
        v-model="filters.country"
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
