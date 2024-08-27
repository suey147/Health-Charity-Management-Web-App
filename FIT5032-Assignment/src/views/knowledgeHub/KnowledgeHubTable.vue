<template>
    <div class="card">
        <DataTable v-model:expandedRows="expandedRows" :value="docs" dataKey="id"
                @rowExpand="onRowExpand" @rowCollapse="onRowCollapse">
            <template #header>
                <div class="flex flex-wrap justify-end gap-2">
                    <Button class="btn-light btn bi bi-plus" @click="expandAll">Expand All</Button>
                    <Button class="btn-light btn bi bi-dash" @click="collapseAll">Collapse All</Button>
                </div>
            </template>
            <Column expander style="width: 2rem" />
            <Column field="title"></Column>

            <template #expansion="slotProps">
                <div class="p-4">
                    <DataTable :value="slotProps.data.documents" @row-click="onRowClick">
                        <Column field="id" header="Id" sortable></Column>
                        <Column field="title" header="Title" sortable></Column>
                        <Column field="date" header="Date" sortable></Column>
                        <Column field="rating" header="Reviews"></Column>
                    </DataTable>
                </div>
            </template>
        </DataTable>
        <Toast />
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useToast } from 'primevue/usetoast';
    import { knowledgeHub } from '../../assets/knowledgeHub/school.js';
    import DataTable from "primevue/datatable";
    import Column from "primevue/column";
    import router from '@/router/index.js';

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



</script>

<style scoped>


</style>