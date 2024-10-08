<template>
    <div class="col-md-8 col-8 offset-2 offset-md-2">
    <div class="forum-wrapper">
      <div class="col-full push-top">
        <div class="forum-header">
          <div class="forum-details">
            <h1 v-if="createNewThread == false">Forum Threads</h1>
            <h1 v-else>Create New Thread</h1>
            <div style="text-align: left" class="justify-content-end">
                <button type="submit" class="btn btn-primary" @click="createNewThread = !createNewThread" v-if="createNewThread == false">Create New Thread</button>
            </div>
          </div>
            <DataTable :value="threads" tableStyle="min-width: 50rem" @rowClick="onRowClick" v-if="createNewThread == false">
                <Column field="title" header="Threads"></Column>
            </DataTable>
            <form v-else>
                <div class="form-group">
                    <label for="newthreadTitle">New Thread Title</label>
                    <input type="text" class="form-control" id="newthreadTitle" v-model="newThread.title" aria-describedby="emailHelp" placeholder="New Thread Title">
                </div>
                <div class="form-group">
                    <label for="threadDescription">New Thread Description</label>
                    <textarea v-model="newThread.description" class="form-control"  id="threadDescription" placeholder="Thread Description"></textarea>
                </div>
                <div class="d-flex gap-4 mt-1 justify-content-end">
                    <button type="submit" class="btn btn-primary" @click="createThread">Submit</button>
                    <button class="btn btn-danger" @click="createNewThread==false">Cancel</button>
                </div>
            </form>
        </div>
      </div>
    </div>
</div>
  </template>
  
<script setup>
    import { useStore } from 'vuex'
    import { computed, onMounted, ref } from 'vue';
    import data from '@/data.json'
    import DataTable from 'primevue/datatable';
    import Column from 'primevue/column';
    import Button from 'primevue/button';
    import { useRouter } from 'vue-router';
    import { database } from '@/firebase';
    import { ref as dbRef, set, push, onValue } from "firebase/database";

    const store = useStore();
    const router = useRouter();
    const forum = ref();
    const threads = ref();
    const newThread = ref({
      title: '',
      description: ''
    });
    const createNewThread = ref(false);
    
    onMounted(() =>{   
        // getForum()    
        // threads.value = Object.entries(data.threads)
        //     .filter(([key, thread]) => thread.forumId === '-KpOx5Y4AqRr3sB4Ybwj')
        //     .map(([key, thread]) => ({
        //         id: key,  
        //         ...thread  
        //     }));

        fetchThreads();
    })
    
    const onRowClick = (event) => {
        const thread = event.data;
        
        router.push({
            name: 'ThreadShow',
            params: {id: thread.id}
        })
    }

    const createThread = () => { 
        if(newThread.value.title && newThread.value.description)
        {
            const threadsRef = dbRef(database, 'threads');
            const newThreadRef = push(threadsRef);
            set(newThreadRef, {
                title: newThread.value.title,
                description: newThread.value.description,
                createdAt: new Date().toISOString()
            }).then(() => {
                newThread.value.title = '';
                newThread.value.description = '';
            }).catch((error) => {
                console.error("Error creating new thread:", error);
            })
        }
    }

    const fetchThreads = () => {
        const threadsRef = dbRef(database, 'threads'); 
        onValue(threadsRef, (snapshot) => {
            if (snapshot.exists()) {
                threads.value = Object.entries(snapshot.val()).map(([key, value]) => ({
                    id: key,
                    ...value
                }));
            } else {
                threads.value = [];
            }
        });
    }
  </script>
  
  <style scoped>
    .forum-wrapper {
      width: 100%;
    }
  </style>