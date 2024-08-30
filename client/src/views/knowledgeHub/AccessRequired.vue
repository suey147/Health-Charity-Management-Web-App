<template>
  <h1 class="text-center">Knowledge Hub</h1>
  <p>Access to the Knowledgehub is currently restricted to members only. If you are interested in accessing the Knowledgehub please
    <router-link to="/register" class="text-black me-2" active-class="active">Register</router-link>
    <router-link :to="{ path: '/login', query: { redirect: $route.query.redirect || '/knowledge-hub' } }"
                class="text-black me-2" active-class="active">Login</router-link>
  </p>

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
