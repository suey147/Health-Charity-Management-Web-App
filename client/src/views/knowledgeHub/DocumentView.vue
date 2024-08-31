<template>
    <!-- Page content -->
    <div class="container mt-5">
      <div class="row">
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
    </div>

    <RatingForm :initialRating="selectedDocument.rating"/>
</template>

<script setup>
    import { knowledgeHub } from '@/assets/knowledgeHub/documents';
    import RatingForm from '@/components/RatingForm.vue';
    import { computed } from 'vue';
    import { useRoute } from 'vue-router';
    import { defineProps } from 'vue';
    const props = defineProps({
      id: {
          type: String,
      }
    })
    const route = useRoute();
    const docId = route.params.id;

    const categories = knowledgeHub.getKnowledge();

    const selectedDocument = computed(() => {
        // return categories.flatMap(category => category.documents).find(doc => doc.id === docId);
      const dataString = localStorage.getItem('documents');
      const documents = JSON.parse(dataString);
      return documents.flatMap(category => category.documents).find(doc => doc.id === docId);
    })
</script>
