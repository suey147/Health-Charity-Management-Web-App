<template>
    <div class="forum-wrapper">
      <div class="col-full push-top">
        <div class="forum-header">
          <div class="forum-details">
            <h1>Forum Threads</h1>
            <p class="text-lead">Test Forum</p>
          </div>
            <DataTable :value="threads" tableStyle="min-width: 50rem" @rowClick="onRowClick">
                <Column field="title" header="Threads"></Column>
            </DataTable>

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
    import { useRouter } from 'vue-router';
    
    const store = useStore();
    const router = useRouter();
    const forum = ref();
    const threads = ref();

    const getForum = () => {
        return data.forums['-KpOx5Y4AqRr3sB4Ybwj']
    }
    
    onMounted(() =>{   
        getForum()    
        threads.value = Object.entries(data.threads)
            .filter(([key, thread]) => thread.forumId === '-KpOx5Y4AqRr3sB4Ybwj')
            .map(([key, thread]) => ({
                id: key,  
                ...thread  
            }));
    })
    
    const onRowClick = (event) => {
        const thread = event.data;
        
        router.push({
            name: 'ThreadShow',
            params: {id: thread.id}
        })
    }
  </script>
  
  <style scoped>
    .forum-wrapper {
      width: 100%;
    }
  </style>