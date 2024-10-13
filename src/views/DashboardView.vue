<template>
  <div class="admin-dashboard container">
    <h1>Admin Dashboard</h1>
    <div class="col-md-12 col-sm-12 col-12 text-center">
      <SelectButton v-model="value" :options="options" aria-labelledby="basic" severity="success" />
    </div>
    <!-- Overview Cards for Users -->
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Number of Donors</h5>
            <p class="card-text">{{ userStats.donor }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Number of Participants</h5>
            <p class="card-text">{{ userStats.participant }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Number of Volunteers</h5>
            <p class="card-text">{{ userStats.volunteer }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Knowledge Hub Overview -->
    <div class="row mb-4">
      <div class="col-md-12">
        <h3>User Statistics</h3>
        <canvas id="userStatsChart"></canvas>
      </div>
    </div>
    <div class="row mb-4">
      <div class="col-md-12">
    <h3>Send Bulk Email</h3>
    <DataTable v-if="users" v-model:selection="selectedUsers" v-model:filters="filters" :value="users" dataKey="id" paginator :rows="10" filterDisplay="row">
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column field="username" filterField="username" header="Name" sortable>
            <template #body="{ data }">
                <span>{{ data.username }}</span>
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by name" />
            </template>
        </Column>
        <Column field="email" filterField="email" header="Email" sortable>
            <template #body="{ data }">
                {{ data.email}}
            </template>
            <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by email" />
            </template>
        </Column>
        <Column field="role" filterField="role" header="Role" :showFilterMenu="false" sortable>
            <template #body="{ data }">
                {{ data.role }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <Select v-model="filterModel.value" @change="filterCallback()" :options="role" placeholder="Select role" style="min-width: 12rem" :showClear="true">
                    <template #option="slotProps">
                        <Tag :value="slotProps.option" />
                    </template>
                </Select>
            </template>
        </Column>
    </DataTable>
    <button type="submit" class="btn btn-primary" @click="emailDialog=true">Write email</button>
    </div>
    </div>
  </div>
  <Toast/>

  <Dialog v-model:visible="emailDialog" header="Send bulk email" :modal="true">
      <form @submit.prevent="sendBulkEmail">
        <div class="flex flex-col gap-6">
          <div class="mb-3">
            <label for="subject" class="block font-bold mb-3 form-label">Subject</label>
            <input
              type="text"
              id="subject"
              class="form-control"
              v-model.trim="newEmail.subject"
              required="true"
              autofocus
              fluid
            />
          </div>
          <div class="mb-3">
            <label for="content" class="block font-bold mb-3 form-label">Content</label>
            <QuillEditor
              theme="snow"
              class="form-control"
              id="content"
              v-model:content="newEmail.content"
              content-type="html"
              required="true"
              style="height: 200px;"
            />
          </div>

          <FileUpload ref="fileupload" class="form-control" id="fileupload" mode="basic" name="attach" accept="application/pdf" :maxFileSize="1000000" @select="onUpload" :auto="true" chooseLabel="Upload">
            </FileUpload>
            <label v-if="file !== null">{{ file.name }}</label>
        </div>
        <div class="d-flex justify-content-end">
          <button class="bi bi-times btn btn-light" text @click="emailDialog=false" type="button">Cancel</button>
          <button class="bi bi-check btn btn-primary" type="submit">Send</button>
        </div>
      </form>
    </Dialog>
</template>

<script setup>
    import { onMounted, ref, watch } from 'vue'
    import { db } from '../firebase' // Import Firebase configuration
    import { doc, getDoc } from 'firebase/firestore'
    import Chart from 'chart.js/auto'
    import SelectButton from 'primevue/selectbutton'
    import axios from 'axios'
    import DataTable from "primevue/datatable";
    import Column from "primevue/column";
    import InputText from 'primevue/inputtext';
    import Select from 'primevue/select';
    import Tag from 'primevue/tag';
    import Dialog from 'primevue/dialog'
    import { useToast } from 'primevue/usetoast'
    import { QuillEditor } from '@vueup/vue-quill'
    import Toast from 'primevue/toast'
    import FileUpload from 'primevue/fileupload'
    import { FilterMatchMode, FilterOperator } from "@primevue/core/api"
    import '@vueup/vue-quill/dist/vue-quill.snow.css';

    const options = ref(['User', 'KnowledgeHub'])
    const value = ref('User')
    const userStats = ref({
      donor: 0,
      participant: 0,
      volunteer: 0
    })

    const knowledgeHubStats = ref({
      funding: 0,
      health: 0,
      family: 0
    })

    const users = ref();
    const selectedUsers = ref();
    const metaKey = ref(true);
    const role = ref(['participant, volunteer']);
    const toast = useToast();
    const newEmail = ref({users: '', subject: '', content: '', attach: ''});
    const emailDialog = ref(false);

    // Fetch data on component mount
    onMounted(() => {
      fetchData();
      getUsers();
    })
    // Fetch data from Firebase
    const fetchData = async () => {
      try {
        // Get users data
        const userDocRef = doc(db, 'Count', 'users')
        const userDocSnap = await getDoc(userDocRef)
        if (userDocSnap.exists()) {
          userStats.value = userDocSnap.data()
          console.log(userStats.value)
          createUserStatsChart(userStats.value)
        }

        const knowledgeHubDocRef = doc(db, 'Count', 'knowledgeHub')
        const knowledgeHubDocSnap = await getDoc(knowledgeHubDocRef)
        if (knowledgeHubDocSnap.exists()) {
          knowledgeHubStats.value = knowledgeHubDocSnap.data()
          // createKnowledgeHubChart(knowledgeHubStats.value)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    const getUsers = async() => {
        try {
            const response = await axios.get('https://getusers-bj37ljbsda-uc.a.run.app');
            const documents = response.data;
            console.log(response.data)
            users.value = documents;
        } catch (error) {
            console.log('Error fetch users: ', error);
        }
    }


    const sendBulkEmail = async () => {
      if(!selectedUsers.value){
        toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select users to send email', life: 3000 });
        return
      }
      const users = selectedUsers.value.map(user => user.email)
      let uploadedFile = null;
      if (file.value){
        uploadedFile = file.value
      }

      const formData = new FormData(); 

      formData.append('users', users);
      formData.append('attach', uploadedFile); 
      formData.append('subject', newEmail.value.subject); 
      formData.append('emailBody', newEmail.value.content); 
      try {
        const send = await axios.post('https://fit5032-assignment.pages.dev/sendBulkEmail', formData, {headers: {'Content-Type': 'multipart/form-data'}});
        toast.add({ severity: 'success', summary:  'Bulk email sent', detail: 'Emails has sent to selected users', life: 3000 });
        newEmail.value = { users: '', subject: '', content: '', attach: '' };
        file.value = null;
        selectedUsers.value = null;
        emailDialog.value = false
      } catch (error) {
          toast.add({ severity: 'error', summary: 'Error Message', detail: 'Failed to register event', life: 3000 });
          newEmail.value = { users: '', subject: '', content: '', attach: '' };
          file.value = null;
          selectedUsers.value = null;
          emailDialog.value = false
          console.log('Error register event: ', error);
      }
      emailDialog.value = false
    }

    const createUserStatsChart = (data) => {
      const ctx = document.getElementById('userStatsChart').getContext('2d')
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Donors', 'Participants', 'Volunteers'],
          datasets: [
            {
              label: 'Number of Users',
              data: [data.donor, data.participant, data.volunteer],
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })
    }

    const filters = ref();
    const initFilters = () => {
        filters.value = {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            username: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            role: { value: null, matchMode: FilterMatchMode.EQUALS },
        };
    };
    initFilters();
    const fileupload = ref(null);
    const file = ref(null);
    const onUpload = () => {
      toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
      file.value = fileupload.value.files[0]
    };
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}

.card {
  margin: 20px 0;
}
</style>
