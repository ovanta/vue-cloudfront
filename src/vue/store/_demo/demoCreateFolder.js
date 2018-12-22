export default parent => ({
    id: Math.round(Math.random() * 1e13).toString(16),
    parent: parent,
    type: 'dir',
    name: 'New Folder',
    lastModified: Date.now(),
    color: '#7E58C2',
    marked: false,
    editable: true
})
