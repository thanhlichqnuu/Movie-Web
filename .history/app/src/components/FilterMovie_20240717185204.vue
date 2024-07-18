<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const year = ref('');
const status = ref('');
const country = ref('');
const category = ref('');

const statusOptions = [
  { value: 'trailer', text: 'Trailer' },
  { value: 'ongoing', text: 'Đang tiến hành' },
  { value: 'thai-lan', text: 'Đã hoàn taâtất' },
];

const countryOptions = [
  { value: 'viet-nam', text: 'Việt Nam' },
  { value: 'trung-quoc', text: 'Trung Quốc' },
  { value: 'thai-lan', text: 'Thái Lan' },
];
const categoryOptions = [
  { value: 'tinh-cam', text: 'Tình cảm' },
  { value: 'hai-huoc', text: 'Hài hước' },
  { value: 'chinh-kich', text: 'Chính kịch' },
];

const router = useRouter();

const applyFilter = () => {
  const query = {};
  if (year.value) query.year = year.value;
  if (status.value) query.status = status.value;
  if (country.value) query.country = country.value;
  if (category.value) query.category = category.value;
  query.page = 1;
  router.push({ query });
};

const clearFilter = () => {
  year.value = '';
  status.value = '';
  country.value = '';
  category.value = '';
};
</script>

<template>
  <v-main>
    <div class="mb-2 mt-n2">
      <h3 class="d-flex justify-start animate-charcter">
        Filter
      </h3>
      <div class="line" />
    </div>
    
    <v-form @submit.prevent="applyFilter">
      <v-text-field
        v-model="year"
        label="Năm công chiếu"
        type="number"
      ></v-text-field>
      <v-select
        v-model="status"
        :items="statusOptions"
        label="Status"
      ></v-select>
      <v-select
        v-model="country"
        :items="countryOptions"
        label="Quốc gia"
        item-value="value"
        item-title="text"
      ></v-select>
      <v-select
        v-model="category"
        :items="categoryOptions"
        label="Thể loại"
        item-value="value"
        item-title="text"
      ></v-select>
      <div><v-btn type="submit" color="red" class="mr-4">Filter</v-btn>
        <v-btn @click="clearFilter" color="blue">Clear</v-btn></div>
      
    </v-form>
  </v-main> 
</template>

<style scoped>
.line {
  border: 1px solid #b5e745;
  width: 100%;
}
</style>

