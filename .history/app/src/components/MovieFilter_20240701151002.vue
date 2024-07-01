<template>
    <v-select
      v-model="selectedCategory"
      :items="categories"
      label="Chọn thể loại"
      @change="applyFilter"
    />
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  const categories = [
    { text: 'Tình cảm', value: 'tinh-cam' },
    { text: 'Hài hước', value: 'hai-huoc' },
    // Thêm các thể loại khác ở đây...
  ];
  
  const selectedCategory = ref("");
  
  const applyFilter = () => {
    // Phát ra sự kiện 'filter' khi người dùng chọn một thể loại
    emit('filter', selectedCategory.value);
  };
  </script>
  