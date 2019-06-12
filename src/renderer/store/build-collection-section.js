export default function buildCollectionSection (collection) {
  return {
    selected: false,
    collection,
    key: 'coll-' + collection.name,
    class: 'item',
    type: 'collection',
    text: collection.name,
    data: collection.data
  }
}
