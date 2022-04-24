import Storage from 'vue-ls';
const options = {
  name: 'ls',
  storage: 'local',
};

const { ls } = Storage.useStorage(options)

export default ls