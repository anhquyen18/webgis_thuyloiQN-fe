import { defineStore } from 'pinia';

export const irrigationState = defineStore('irrigation', {
  state: () => ({
    reservoirs: null, // all reservoirs
    safetyReports: null,
  }),

  actions: {
    setSafetyReports(safetyReports) {
      this.safetyReports = safetyReports;
    },
    setReservoirs(reservoirs) {
      this.reservoirs = reservoirs;
    },
  },

  getters: {
    getSafetyReports() {
      return this.safetyReports;
    },
    getReservoirs() {
      return this.reservoirs;
    },
  },
});
