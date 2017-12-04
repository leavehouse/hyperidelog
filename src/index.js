import { app } from "hyperapp"
import { retrieveData } from './local-storage'
import { mainView } from './view'

const newPaymentInitState = ({ isInit: false, value: '' });

function createNewRide() {
  return { timestamp: Date.now() }
}

function createNewPayment(amount) {
  return { timestamp: Date.now(), amount: amount }
}

const initState = retrieveData() || ({
  rides: { list: [] },
  payments: {
    list: [],
    new: newPaymentInitState,
  },
});

const ridelog = {
  state: initState,
  view: mainView,
  actions: {
    rides: {
      add: () => state => ({ list: state.list.concat([createNewRide()]) }),
      remove: ts => state => ({ list: state.list.filter(ride => ride.timestamp !== ts) }),
    },
    payments: {
      new: {
        init: () => state => ({ isInit: true, value: state.value }),
        update: newValue => state => ({ isInit: state.isInit, value: newValue }),
        cancel: () => state => newPaymentInitState,
      },
      submit: event => state => {
        event.preventDefault();
        const parsedAmount = parseInt(state.new.value);
        if (isNaN(parsedAmount)) {
          alert("Payment amount must be an integer.");
          return { list: state.list, new: state.new }
        } else {
          return { list: state.list.concat([createNewPayment(parsedAmount)]),
                   new: newPaymentInitState }
        }
      },
      remove: ts => state => ({ list: state.list.filter(ride => ride.timestamp !== ts),
                                new: state.new }),
    },
  }
};

app(ridelog)
