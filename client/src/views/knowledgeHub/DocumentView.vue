<template>
    <!-- Page content -->
    <div class="container mt-5">
      <div class="row">
        <!-- Post content -->
          <article>
            <!-- Post header -->
            <header class="mb-4">
              <h1 class="fw-bolder mb-1">{{ selectedDocument.title }}</h1>
              <div class="text-muted fst-italic mb-2">Posted on {{ selectedDocument.date }}</div>
              <a href="#" class="badge bg-secondary text-decoration-none link-light">{{ selectedDocument.subCategory }}</a>
            </header>
            <!-- Preview image -->
            <figure class="mb-4">
              <img class="img-fluid rounded" src="https://dummyimage.com/900x400/ced4da/6c757d.jpg" alt="..." />
            </figure>
            <!-- Post content -->
            <section class="mb-5">
                <!-- Loop through sections -->
                <div v-for="(section, index) in selectedDocument.content.sections" :key="index">
                <h2>{{ section.heading }}</h2>
                
                <!-- Loop through content items -->
                <div v-for="(item, idx) in section.content" :key="idx">
                    <!-- Check if it's a list or plain text -->
                    <ul v-if="typeof item === 'object' && item.list">
                    <li v-for="(listItem, listIdx) in item.list" :key="listIdx">
                        {{ listItem }}
                    </li>
                    </ul>
                    <p v-else>
                    {{ item }}
                    </p>
                </div>
                </div>

                <h3>{{ selectedDocument.content.conclusion.content }}</h3>
            </section>
          </article>
        </div>
    </div>

    <RatingForm :initialRating="selectedDocument.rating"/>
</template>

<script setup>
    import { knowledgeHub } from '@/assets/knowledgeHub/documents';
    import RatingForm from '@/components/RatingForm.vue';
    import { computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { ref } from 'vue';
    

    const router = useRouter();
    const route = useRoute();
    const docId = route.params.id;

    const categories = knowledgeHub.getKnowledge();

    const selectedDocument = computed(() => {
        return categories.flatMap(category => category.documents).find(doc => doc.id === docId);
    })

    const goBack = () => {
        const redirect = { name: 'Knowledgehub' };
        router.push(redirect);
    }

    const value = ref(null)
</script>
