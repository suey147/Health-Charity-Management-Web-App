<template>
  <div class="card">
      <DataView :value="docs" paginator :rows="10">
        <template #header>
            <div class="flex text-end">
                <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                    <template #option="{ option }">
                        <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-map']" />
                    </template>
                </SelectButton>
            </div>
        </template>
          <template #list="slotProps">
              <div class="d-flex flex-column">
                  <div v-for="(item, index) in slotProps.items" :key="index">
                      <div class="d-flex flex-column flex-sm-row align-items-sm-center gap-4" :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
                          <div class="position-relative">
                              <img class="d-block mx-auto rounded" width="200" :src="`${item.image}`" :alt="item.name" />
                              <div class="bg-secondary position-absolute rounded-pill" style="left: 4px; top: 4px">
                                  <Tag :value="item.date"></Tag>
                              </div>
                          </div>
                          <div class="d-flex flex-column flex-md-row justify-content-between align-items-start flex-grow-1 gap-3">
                              <div class="d-flex flex-row flex-md-column justify-content-between align-items-start gap-2">
                                  <div>
                                      <span class="text-muted">{{ item.addr }}</span>
                                      <div class="s-5 fw-bold mt-2">{{ item.name }}</div>
                                  </div>
                                  <div class="bg-light p-1 rounded-pill" style="border-radius: 30px">
                                      <div class="d-flex align-items-center gap-2 justify-content-center py-1 px-2 bg-white rounded-pill shadow-sm">
                                          <span class="text-dark fw-bold">{{ item.time }}</span>
                                          <i class="pi pi-star-fill text-warning"></i>
                                      </div>
                                  </div>
                              </div>
                              <div class="d-flex flex-column align-items-md-end gap-2">
                                  <div class="d-flex gap-2 justify-content-end">
                                      <button class="btn btn-primary mr-2" @click="$event.stopPropagation()">Read more</button>
                                      <Button icon="pi pi-heart" outlined></Button>
                                      <!-- <Button icon="pi pi-shopping-cart" label="Buy Now" :disabled="item.inventoryStatus === 'OUTOFSTOCK'" class="flex-auto md:flex-initial whitespace-nowrap"></Button> -->
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </template>
      </DataView>
  </div>
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

const options = ref(['list', 'grid']);
const layout = ref('grid');
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
