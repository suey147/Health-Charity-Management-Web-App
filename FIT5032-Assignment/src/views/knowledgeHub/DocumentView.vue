<template>
    <div>
        <h1>Document: {{ selectedDocument.title }}</h1>
        <p>Category: {{ selectedDocument.category }}</p>
        <p>Description: {{ selectedDocument.description }}</p>
        <button @click="goBack">Back to Knowledge Hub</button>
    </div>
</template>

<script setup>
    import { knowledgeHub } from '@/assets/knowledgeHub/school';
    import { ref, onMounted, defineProps } from 'vue';

    const props = defineProps({
        docId: {
        type: String,
        required: true}
    })
    const selectedDocument = ref(null);
    onMounted(() => {
        const categories = knowledgeHub.getKnowledge()
        for (const category of categories)
        {
            const document = category.find(doc => doc.id === props.docId)
            if (document){
                selectedDocument.value = document;
                break
            }
        }
    })
</script>
