<template>
  <DataTable
    :value="docs"
    dataKey="id"
    table-style="min-width: 50rem"
    resizableColumns
    columnResizeMode="fit"
    :filters="filters"
  >
    <!-- Event Image -->
    <Column style="width: 25%">
      <template #body="slotProps">
        <div
          class="relative mx-auto position-relative container d-none d-lg-block position-relative img-fluid"
        >
          <div class="events-date">
            <div class="font-size28">{{ slotProps.data.date }}</div>
            <div class="font-size14">Mar</div>
          </div>
          <img :src="slotProps.data.image" width="200" />
        </div>
      </template>
    </Column>
    <!-- Event details -->
    <Column field="name" filter>
      <template #body="slotProps">
        <ul class="margin-10px-bottom md-margin-5px-bottom">
          <h2>{{ slotProps.data.name }}</h2>
          <li class="list-unstyled">
            <i class="pi pi-clock margin-10px-right"></i><span>Time:</span>{{ slotProps.data.time }}
          </li>
          <li class="list-unstyled">
            <i class="pi pi-map-marker margin-5px-right"></i><span>Address:</span
            >{{ slotProps.data.addr }}
          </li>
        </ul>
      </template>
    </Column>

    <!-- Register button -->
    <Column :exportable="false" style="width: 25%">
      <template #body="slotProps">
        <button class="btn btn-primary mr-2" @click="$event.stopPropagation()">Read more</button>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import DataView from 'primevue/dataview';
import Column from 'primevue/column'
import axios from 'axios'
import Tag from 'primevue/tag';
import { defineProps } from 'vue'

defineProps({
  filters: {
    type: Object,
    required: true
  }
})
/**
 * Reactive reference to store documents.
 */
const docs = ref()
/**
 * Lifecycle hook that runs when the component is mounted.
 * @function onMounted
 */
onMounted(() => {
  getEvents()
})

const getEvents = async () => {
  try {
    const response = await axios.get(
      'http://127.0.0.1:5001/fit5032-assignment-ce36f/us-central1/getEvents'
    )
    const documents = response.data
    docs.value = documents
  } catch (error) {
    console.error('Error fetching book count: ', error)
    this.error = error
  }
}
</script>

<style scoped>
.events-date {
  text-align: center;
  position: absolute;
  background-color: rgba(25, 47, 89, 0.9);
  color: #fff;
  padding: 12px 20px 8px 20px;
  text-transform: uppercase;
}
</style>
