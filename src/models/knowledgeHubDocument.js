import { ref } from 'vue';

const createNewDocument = () => {
  return ref({
    title: '',
    author: '',
    date: '',
    content: '',
    category: '',
    rating: [0, 0],
  });
};

export default createNewDocument;