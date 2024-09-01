<template>
    <!-- Page content -->
    <div class="container mt-5">
      <div class="row">
        <div class="col-9 order-md-1">
        <!-- Post content -->
          <article>
            <!-- Post header -->
            <header class="mb-4">
              <h1 class="fw-bolder mb-1">{{ selectedDocument.title }}</h1>
              <div class="text-muted fst-italic mb-2">Posted on {{ selectedDocument.publishedDate }} {{ selectedDocument.author }}</div>
            </header>
            <!-- Preview image -->
            <figure class="mb-4">
              <img class="img-fluid rounded" src="https://dummyimage.com/900x400/ced4da/6c757d.jpg" alt="..." />
            </figure>
            <!-- Post content -->
            <section class="mb-5" v-html="selectedDocument.content"></section>
          </article>
        </div>
        <div class="col-md-3 order-md-2 mb-4">
          
          <RatingForm :docId="selectedDocument.id"/>
        </div>
      </div>
    </div>
</template>

<script setup>
    import RatingForm from './RatingForm.vue';
    import { ref, computed } from 'vue';
    import { useRoute } from 'vue-router';
    import { defineProps } from 'vue';
    const props = defineProps({
      id: {
          type: String,
      }
    })
    const route = useRoute();
    const docId = route.params.id;
    const selectedDocument = computed(() => {
      const dataString = localStorage.getItem('documents');
      const documents = JSON.parse(dataString);
      return documents.flatMap(category => category.documents).find(doc => doc.id === docId);
    })
</script>
