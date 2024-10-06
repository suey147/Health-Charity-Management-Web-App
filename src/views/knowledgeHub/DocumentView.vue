<template>
    <!-- Page content -->
    <div class="container mt-5" ref="content">
      <div class="row">
        <div style="text-align: left" class="justify-content-start">
            <Button icon="pi pi-external-link" label="Export" @click="exportPDF()" />
        </div>
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
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { defineProps, ref } from 'vue';
  import jsPDF from 'jspdf';
  import html2canvas from 'html2canvas';
  /**
   * Props passed to the component.
   * @type {Object}
   * @property {string} id - The ID of the document.
   */
  defineProps({
    id: {
        type: String,
    }
  })

  /**
   * Route instance for accessing route parameters.
   */
  const route = useRoute();
  /**
   * Document ID from the route parameters.
   */
  const docId = route.params.id;
  const content = ref();
  /**
   * Computed property to get the selected document based on the document ID.
   * @function selectedDocument
   * @returns {Object} The selected document.
   */
  const selectedDocument = computed(() => {
    const dataString = localStorage.getItem('documents');
    const documents = JSON.parse(dataString);
    return documents.flatMap(category => category.documents).find(doc => doc.id === docId);
  })

  const exportPDF = () => {
    const doc = new jsPDF();
    const canvasElement = document.createElement('canvas');
    html2canvas(content.value, { canvas: canvasElement})
      .then(function (canvas) {
        const img = canvas.toDataURL("image/jpeg", 0.8);
        doc.addImage(img,'JPEG',20,20);
        doc.save("sample.pdf");
      })
  }
</script>
