<template>
        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" v-model="filters['global'].value">

        <DataTable v-model:expandedRows="expandedRows" :value="docs" dataKey="id"
                @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" v-if="!isSearching">
            <template #header>
                <div class="flex flex-wrap justify-end gap-2 text-end">
                    <button class="btn-light btn bi bi-plus" @click="expandAll">Expand All</button>
                    <button class="btn-light btn bi bi-dash" @click="collapseAll">Collapse All</button>
                    <RouterLink class="btn-light btn bi bi-gear" v-if="$store.getters.isAdmin" to="/knowledge-hub/edit"> Edit</RouterLink>
                </div>
            </template>

            <template>
                <Column field="category" header="Category" class="bg-info" ></Column>
                <Column expander style="width: 3rem" class="bg-info"/>
            </template>
            <template #expansion="slotProps" >
                <div class="p-4">
                    <DataTable :value="slotProps.data.documents" @rowClick="onRowClick">
                        <Column field="title" header="Title" sortable></Column>
                        <Column field="publishedDate" header="Date" sortable></Column>
                        <Column field="rating" header="Reviews"></Column>
                    </DataTable>
                </div>
            </template>
        </DataTable>

        <DataTable v-model:selection="docs" :filters="filters" :value="combinedDocuments" @rowClick="onRowClick" v-if="isSearching">
            <Column field="id" header="Id" sortable></Column>
            <Column field="title" header="Title" sortable></Column>
            <Column field="date" header="Date" sortable></Column>
            <Column field="rating" header="Reviews"></Column>
        </DataTable>

</template>

<script setup>
    import { ref, onMounted, computed} from 'vue';
    import { useToast } from 'primevue/usetoast';
    import DataTable from "primevue/datatable";
    import Column from "primevue/column";
    import router from '@/router/index.js';
    import { FilterMatchMode } from "@primevue/core/api"
    import axios from 'axios'

    const docs = ref();
    const expandedRows = ref({});
    const toast = useToast();

    onMounted(() => {
        getDocumentsData();
    });

    const fetchAndStoreData = async () => {
        try {
            const response = await axios.post('http://localhost:5000/getDocuments');
            const alldocs = [];
            for (const category in response.data.documents){
                const categoryEntry = {
                    category: category,
                    id: category,
                    documents: response.data.documents[category].map(doc => ({
                        id: doc.id,
                        ...doc.data
                    }))
                }
                alldocs.push(categoryEntry);
            }
            
            const dataString = JSON.stringify(alldocs);
            
            localStorage.setItem('documents', dataString);
            return alldocs;
        } catch (error){
            console.log('Error: '+error.message);
            return [];
        }
    }
    
    const getDocumentsData = async () => {
        const dataString = localStorage.getItem('documents');
        let alldocs;
        
        if (dataString){
            alldocs = JSON.parse(dataString);   
        } else {
            alldocs = await fetchAndStoreData();
        }
        docs.value = alldocs;
    }

    const onRowExpand = (event) => {
        toast.add({ severity: 'info', summary: 'Row Expanded', detail: event.data.name, life: 3000 });
    };
    const onRowCollapse = (event) => {
        toast.add({ severity: 'success', summary: 'Row Collapsed', detail: event.data.name, life: 3000 });
    };
    const expandAll = () => {
        expandedRows.value = docs.value.reduce((acc, p) => (acc[p.id] = true) && acc, {});
    };
    const collapseAll = () => {
        expandedRows.value = null;
    };

    const onRowClick = (event) => {
        const document = event.data;
        console.log(document.id)
        router.push({
            name: 'DocumentPage',
            params: {id: document.id}
        })
    }
    const combinedDocuments = computed(() => {
            return docs.value.flatMap(category => category.documents);
    });

    const filters = ref({
        'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    });
    
    // Check if the search input is not empty
    const isSearching = computed(() => {
        return filters.value['global'].value !== null && filters.value['global'].value !== ""
    });
    
</script>

<style scoped>


</style>