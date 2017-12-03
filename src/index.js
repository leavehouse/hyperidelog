import { h, app } from "hyperapp"

// in US dollars
const FEE_PER_RIDE = 3;

const AddPanel = ({ addRide, initPayment, updatePaymentValue, cancelPayment,
                    submitPayment, paymentIsInit, paymentValue }) => {
  const newPaymentForm = !paymentIsInit ? null : (
    h('form', { onsubmit(e) { submitPayment(e) } }, [
      h('input', { type: 'number', placeholder: 'Amount',
                   oninput(e) { updatePaymentValue(e.target.value) }}),
      h('button', { type: 'submit' }, 'Submit'),
      h('button', { type: 'button', onclick() { cancelPayment() } }, 'Cancel'),
    ]));

  return h('div', {}, [
    h('button', { type: 'button', onclick() { addRide() } }, 'Add Ride'),
    h('button', { type: 'button', onclick() { initPayment() },
                  disabled: paymentIsInit }, 'Add Payment'),
    newPaymentForm,
  ])
};

const BalanceDisplay = ({ numRides, paymentAmounts }) => (
  h('h1', {}, 'Balance: '+(numRides*FEE_PER_RIDE - paymentAmounts.reduce((a, b) => a+b, 0)))
);

function displayTimestamp(ts) {
  return new Date(ts).toLocaleString();
}

const RidesView = ({ rides, removeRide }) => (
  h('div', {}, [
    h('h1', {}, 'Rides'),
    h('ul', {}, [
      rides.map(ride => h('li', {}, [
        displayTimestamp(ride.timestamp),
        h('button', { type: 'button', onclick() { removeRide(ride.timestamp) } }, '×')
      ])).reverse()
    ]),
  ])
);

const PaymentsView = ({ payments, removePayment }) => (
  h('div', {}, [
    h('h1', {}, 'Payments'),
    h('ul', {}, [
      payments.map(payment => h('li', {}, [
        '$'+payment.amount+' on '+displayTimestamp(payment.timestamp),
        h('button', { type: 'button', onclick() { removePayment(payment.timestamp) } }, '×')
      ])).reverse()
    ]),
  ])
);

function createNewRide() {
  return { timestamp: Date.now() }
}

function createNewPayment(amount) {
  return { timestamp: Date.now(), amount: amount }
}

const ridelog = {
  state: {
    rides: { list: [] },
    payments: {
      list: [],
      new: {
        isInit: false,
        value: ''
      },
    },
  },
  view: state => actions => (
    h('main', {}, [
      AddPanel({ addRide: actions.rides.add, initPayment: actions.payments.new.init,
                 updatePaymentValue: actions.payments.new.update,
                 cancelPayment: actions.payments.new.cancel,
                 submitPayment: actions.payments.submit,
                 paymentIsInit: state.payments.new.isInit,
                 paymentValue: state.payments.new.value }),
      BalanceDisplay({ numRides: state.rides.list.length,
                       paymentAmounts: state.payments.list.map(p => p.amount) }),
      RidesView({ rides: state.rides.list, removeRide: actions.rides.remove }),
      PaymentsView({ payments: state.payments.list,
                     removePayment: actions.payments.remove }),
    ])
  ),
  actions: {
    rides: {
      add: () => state => ({ list: state.list.concat([createNewRide()]) }),
      remove: ts => state => ({ list: state.list.filter(ride => ride.timestamp !== ts) }),
    },
    payments: {
      new: {
        init: () => state => ({ isInit: true, value: state.value }),
        update: newValue => state => ({ isInit: state.isInit, value: newValue }),
        cancel: () => state => ({ isInit: false, value: '' }),
      },
      submit: event => state => {
        event.preventDefault();
        const parsedAmount = parseInt(state.new.value);
        if (isNaN(parsedAmount)) {
          alert("Payment amount must be an integer.");
          return { list: state.list, new: state.new }
        } else {
          return { list: state.list.concat([createNewPayment(parsedAmount)]),
                   new: { isInit: false, value: '' } }
        }
      },
      remove: ts => state => ({ list: state.list.filter(ride => ride.timestamp !== ts),
                                new: state.new }),
    },
  }
};

app(ridelog)
