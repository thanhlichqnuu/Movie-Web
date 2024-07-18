<script setup>
import axios from "axios";

const filterAni = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch {
    const { toast } = await import('vue3-toastify');
    toast.error("Series list is currently unavailable!");
  }
};
</script>

<template>
    <div>
        <h1>Hello</h1>
       <v-text-field></v-text-field> 
    </div>
</template>