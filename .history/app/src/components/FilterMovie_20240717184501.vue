

<template>
  <v-main>
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
      <v-btn type="submit" color="primary">Filter</v-btn>
      <v-btn @click="clearFilter" color="secondary">Clear Filter</v-btn>
    </v-form>
  </v-main> 
</template>


