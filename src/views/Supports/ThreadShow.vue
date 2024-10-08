<template>
    <div class="thread" v-if="thread">
    <h2 >{{ thread.title }}</h2>
    <DataView :value="posts">
        <template #list="slotProps">
            <h6 class="border-bottom border-gray pb-2 mb-0">Posts</h6>
            <div v-for="(item, index) in slotProps.items" :key="index">
                <div class="d-flex flex-column flex-sm-row align-items-sm-center p-3 gap-3 border-top"  :class="{ 'border-top': index !== 0 }">
                    <div class="d-flex flex-row justify-content-between align-items-md-center flex-grow-1 gap-3">
                        <div class="d-flex flex-column justify-content-start">
                            <div>
                                <span class="fw-medium text-muted">{{ item.userId }}</span>
                                <div class="fs-5 fw-medium mt-2">{{ item.text }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </DataView>
    <input v-model="newPost" placeholder="Write a post..." />
        <button @click="addPost">Submit</button>
    </div>
</template>
  
  <script setup>
    import { computed, onMounted, ref } from 'vue';
    import data from '@/data.json';
    import DataView from 'primevue/dataview';

    const props = defineProps({ id: String });
    const thread = ref(null);
    const posts = ref(null);

    onMounted(() => {
        getThreads();
        getPosts();
        console.log(posts.value)
    });

    const getThreads = () => {
        thread.value = data.threads[props.id]
    }
    const getPosts = () => {
        posts.value = Object.entries(data.posts)
            .filter(([key]) => {
                const postid = Object.keys(thread.value.posts || {});
                return postid.includes(key)
            })
            .map(([key, postData]) => ({ id: key, ...postData }));
    };
    const newPost = ref('');

    function addPost() {
        if (newPost.value) {
            posts.value.push({ id: Date.now(), content: newPost.value });
            newPost.value = '';
        }
    }
  </script>