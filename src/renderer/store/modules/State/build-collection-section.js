export default function buildCollectionSection (state) {
  return (collection) => {
    return {
      isActive: false,
      renaming: false,
      collection,
      key: 'coll-' + collection.name,
      class: 'item',
      type: 'collection',
      text: collection.name,
      data: collection.data
    }
  }
}
