const STORAGE_KEY = 'ridelog/v0';

function retrieveData() {
  return JSON.parse(window.localStorage.getItem(STORAGE_KEY));
}

function storeData(data) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export { storeData, retrieveData }
