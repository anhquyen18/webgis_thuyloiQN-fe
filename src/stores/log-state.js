import { defineStore } from 'pinia';

export const logState = defineStore('log', {
  state: () => ({
    logType: '',
    reservoirSafety: null, // báo cáo an toàn
    reservoirMaintainance: null, // báo cáo an toàn
    reservoirOperation: null, // báo cáo an toàn
  }),

  actions: {
    setLogType(logType) {
      this.logType = logType;
    },
    setReservoirSafety(reservoirSafety) {
      this.reservoirSafety = reservoirSafety;
    },
    setReservoirMaintainance(reservoirMaintainance) {
      this.reservoirMaintainance = reservoirMaintainance;
    },
    setReservoirOperation(reservoirOperation) {
      this.reservoirOperation = reservoirOperation;
    },
  },

  getters: {
    getLogType() {
      return this.logType;
    },
    getReservoirSafety() {
      return this.reservoirSafety;
    },
    getReservoirMaintainance() {
      return this.reservoirMaintainance;
    },
    getReservoirOperation() {
      return this.reservoirOperation;
    },
  },
});
