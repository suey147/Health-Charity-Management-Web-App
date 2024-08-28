<template>
    <div>
            <h1>{{ selectedDocument.title }}</h1>
            <p>Date: {{ selectedDocument.date }}</p>
            <p>content: {{ selectedDocument.content }}</p>
            <button @click="goBack">Back to Knowledge Hub</button>

    </div>
</template>

<script setup>
    import { knowledgeHub } from '@/assets/knowledgeHub/school';
    import { computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

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

</script>
