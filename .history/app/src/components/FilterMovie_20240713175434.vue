<template>
    <v-card>
      <v-card-title>Lọc phim</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="applyFilter">
          <v-text-field
            v-model="year"
            label="Năm công chiếu"
            type="number"
          ></v-text-field>
          
          <v-select
            v-model="status"
            :items="statuses"
            label="Status"
          ></v-select>
          
          <v-select
            v-model="country"
            :items="countries"
            label="Quốc gia"
          ></v-select>
          
          <v-select
            v-model="category"
            :items="categories"
            label="Thể loại"
          ></v-select>
          
          <v-btn type="submit" color="primary">Filter</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const props = defineProps({
    type: {
      type: String,
      required: true,
    },
  });
  
  const emit = defineEmits(['filter']);
  
  const year = ref('');
  const status = ref('');
  const country = ref('');
  const category = ref('');
  
  const statuses = ['ongoing', 'trailer', 'completed'];
  const countries = [
    { text: 'Việt Nam', value: 'viet-nam' },
    { text: 'Trung Quốc', value: 'trung-quoc' },
    // Add more country options here...
  ];
  const categories = [
    { text: 'Tình cảm', value: 'tinh-cam' },
    { text: 'Hài hước', value: 'hai-huoc' },
    // Add more category options here...
  ];
  
  const applyFilter = () => {
    const filterParams = {
      year: year.value,
      status: status.value,
      country: country.value,
      category: category.value,
      type: props.type,
      page: 1,
    };
    
    emit('filter', filterParams);
  };
  </script>
  