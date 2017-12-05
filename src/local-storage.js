const STORAGE_KEY = 'ridelog/v0';

// Adapted slightly from
// https://github.com/marcusasplund/hyperapp-todo-simple/blob/master/src/utils/local-storage.js

function retrieveData() {
  return JSON.parse(window.localStorage.getItem(STORAGE_KEY));
}

function storeData(data) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export { storeData, retrieveData }
