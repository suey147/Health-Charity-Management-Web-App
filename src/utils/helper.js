/**
 * Categorizes documents by their category field and stores them in localStorage.
 * @function categorizedDocuments
 * @param {Array<Object>} documents - Array of document objects to categorize.
 */
const categorizedDocuments = (documents) => {
    const categorized = documents.reduce((acc, doc) => {
      const category = doc.category
      const eventDate = new Date(doc.date._seconds * 1000 + doc.date._nanoseconds / 1000);
      doc.date = eventDate;
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(doc)
      return acc
    }, {})
    const allDocs = Object.keys(categorized).map((category) => ({
      category,
      id: category,
      documents: categorized[category]
    }))
    localStorage.setItem('documents', JSON.stringify(allDocs))
    return allDocs;
}

export default categorizedDocuments;