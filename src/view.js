import { h } from "hyperapp"
import { storeData } from './local-storage'

// in US dollars
const FEE_PER_RIDE = 3;

const AddPanel = ({ addRide, newPayment, submitPayment, state }) => {
  const newPaymentForm = !state.isInit ? null : (
    h('form', { onsubmit(e) { submitPayment(e) } }, [
      h('input', { type: 'number', placeholder: 'Amount', value: state.value,
                   oninput(e) { newPayment.update(e.target.value) },
                   oncreate(e) { e.focus() } }),
      h('button', { type: 'submit' }, 'Submit'),
      h('button', { type: 'button', onclick() { newPayment.cancel() } }, 'Cancel'),
    ]));

  return h('div', {}, [
    h('button', { type: 'button', onclick() { addRide() } }, 'Add Ride'),
    h('button', { type: 'button', onclick() { newPayment.init() },
                  disabled: state.isInit }, 'Add Payment'),
    newPaymentForm,
  ])
};

const BalanceDisplay = ({ numRides, paymentAmounts }) => (
  h('h1', {}, 'Balance: $'+(numRides*FEE_PER_RIDE - paymentAmounts.reduce((a, b) => a+b, 0)))
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

export const mainView = state => actions => (
  h('main', { onupdate() { storeData(state) } }, [
    AddPanel({ addRide: actions.rides.add, newPayment: actions.payments.new,
               submitPayment: actions.payments.submit,
               state: state.payments.new }),
    BalanceDisplay({ numRides: state.rides.list.length,
                     paymentAmounts: state.payments.list.map(p => p.amount) }),
    RidesView({ rides: state.rides.list, removeRide: actions.rides.remove }),
    PaymentsView({ payments: state.payments.list,
                   removePayment: actions.payments.remove }),
  ])
);
