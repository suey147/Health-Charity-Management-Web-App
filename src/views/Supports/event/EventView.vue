<template>
    <h1 class="text-center">Events</h1>
    <!-- <div class="col-md-8 col-8 offset-2 offset-md-2 text-end">
        <SelectButton v-model="value" :options="view" aria-labelledby="basic" severity="primary"/>
    </div> -->
    <div class="card col-md-8 col-8 offset-2 offset-md-2">
        <EventList/>
        <!-- <EventList2 :filters="filters"/> -->
        <EventMap/>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { FilterMatchMode, FilterOperator } from "@primevue/core/api"
    import EventList from './EventListView.vue'
    import EventList2 from './EventListView copy.vue'
    import EventMap from './EventViewInMap.vue'
    import DatePicker from 'primevue/datepicker';
    

    const value = ref('List');

    const view = ref(['List', 'Map']);


    /**
     * Reactive reference to store filter settings.
     * @type {Object}
     */
    const filters = ref();

    const initFilters = () => {
        filters.value = {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { value: null, matchMode: FilterMatchMode.CONTAINS },
            date: {value: null, matchMode: FilterMatchMode.DATE_IS },
        };
    };
    initFilters();
</script>

<style scoped>
.events-date {
    text-align: center;
    position: absolute;
    background-color: rgba(25, 47, 89, 0.9);
    color: #fff;
    padding: 12px 20px 8px 20px;
    text-transform: uppercase
}
</style>