<template>
        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" v-model="filters['global'].value">

        <DataTable v-model:expandedRows="expandedRows" :value="docs" dataKey="id"
                @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" v-if="!isSearching">
            <template #header>
                <div class="flex flex-wrap justify-end gap-2 text-end">
                    <Button class="btn-light btn bi bi-plus" @click="expandAll">Expand All</Button>
                    <Button class="btn-light btn bi bi-dash" @click="collapseAll">Collapse All</Button>
                </div>
            </template>

            <template>
                <Column field="title" header="Category" class="bg-info" ></Column>
                <Column expander style="width: 3rem" class="bg-info"/>
            </template>
            <template #expansion="slotProps" >
                <div class="p-4">
                    <DataTable :value="slotProps.data.documents" @rowClick="onRowClick">
                        <Column field="id" header="Id" sortable></Column>
                        <Column field="title" header="Title" sortable></Column>
                        <Column field="date" header="Date" sortable></Column>
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

        <!--Took Row Expansion example from PrimeVue as example-->
        <Toast />

</template>

<script setup>
    import { ref, onMounted, computed} from 'vue';
    import { useToast } from 'primevue/usetoast';
    import { knowledgeHub } from '../../assets/knowledgeHub/documents.js';
    import DataTable from "primevue/datatable";
    import Column from "primevue/column";
    import router from '@/router/index.js';
    import { FilterMatchMode } from "@primevue/core/api"

    const docs = ref();
    const expandedRows = ref({});
    const toast = useToast();

    onMounted(() => {
        docs.value = knowledgeHub.getKnowledge();
    });

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