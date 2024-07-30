<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const url = computed(() => 
  `https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Fmotphimmoi.com%2F${route.params.slugMovie}&width=450&layout&action&size&share=true&height=35&appId=973607627550804`
);

</script>

<template>
  <v-container>
    <div class=" ml-9 mt-5" >
      <iframe 
        :src="url" 
        width="450" 
        height="35" 
        style="border:none;overflow:hidden;" 
        scrolling="no" 
        frameborder="0" 
        allowfullscreen="true" 
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      ></iframe>
    </div>
  </v-container>
</template>


