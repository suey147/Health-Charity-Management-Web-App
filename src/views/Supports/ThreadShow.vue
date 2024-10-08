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
                                <span class="fw-medium text-muted">{{ item.author }}</span>
                                <div class="fs-5 fw-medium mt-2">{{ item.content }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </DataView>
    <input v-model="newPost.content" placeholder="Write a post..." />
        <button @click="addPost">Submit</button>
    </div>
</template>
  
  <script setup>
    import { computed, onMounted, ref } from 'vue';
    import data from '@/data.json';
    import DataView from 'primevue/dataview';
    import { database } from '@/firebase';
    import { ref as dbRef, onValue, set, push } from "firebase/database";
    import { useStore } from 'vuex';
    const props = defineProps({ id: String });
    const thread = ref(null);
    const posts = ref(null);
    const store = useStore();

    onMounted(() => {
        // getThreads();
        // getPosts();
        fetchThreadData();
        console.log(posts.value)
        newPost.value.author = store.getters.currentUser;
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
    const newPost = ref({
      author: '',
      content: ''
    });
    function addPost() {
        if (newPost.value.author && newPost.value.content) {
        const postsRef = dbRef(database, `threads/${props.id}/posts`);
        const newPostRef = push(postsRef);
        set(newPostRef, {
          author: newPost.value.author,
          content: newPost.value.content,
          createdAt: new Date().toISOString()
        }).then(() => {
          // Clear input fields after creation
          newPost.value.author = '';
          newPost.value.content = '';
        }).catch((error) => {
          console.error("Error creating new post:", error);
        });
      }
    }

    const fetchThreadData = () => {
        const threadDataRef = dbRef(database, `threads/${props.id}`);
        onValue(threadDataRef, (snapshot) => {
            if(snapshot.exists()){
                thread.value = snapshot.val();
            }
        });

        const postRef = dbRef(database, `threads/${props.id}/posts`);
        onValue(postRef, (snapshot) => {
            if(snapshot.exists()){
                posts.value = Object.entries(snapshot.val()).map(([key, value]) => ({
                    id: key,
                    ...value
                }));
                console.log(posts.value)
            } else {
                posts.value = [];
            }
        })
    }
  </script>