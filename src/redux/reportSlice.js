import { createSlice } from '@reduxjs/toolkit';
import { getLastFriday } from '../utils/reportGenerator';

const initialState = {
  reports: [],
};

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    generateReport: (state, action) => {
      const { filteredPurchases, filteredDistributions } = action.payload;
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const startDate = `${daysOfWeek[getLastFriday().getDay()]}, ${getLastFriday().toISOString().split("T")[0]}`;
      const endDate = `${daysOfWeek[new Date().getDay()]}, ${new Date().toISOString().split("T")[0]}`;

      const reportExists = state.reports.some(
        report => report.startDate === startDate && report.endDate === endDate
      );

      if (reportExists) {
        return;
      }

      const sortedDistributions = filteredDistributions.sort((a, b) => {
        return new Date(a.itemUseDate) - new Date(b.itemUseDate);
      });

      const totalDistributions = sortedDistributions.reduce((acc, item) => {
        if (acc[item.itemName]) {
          acc[item.itemName].issues += Number(item.issues);
          acc[item.itemName].balance -= item.issues;
        } else {
          acc[item.itemName] = {
            itemName: item.itemName,
            issues: Number(item.issues),
            balance: item.balance
          };
        }
        return acc;
      }, {});

      const distributionsArray = Object.values(totalDistributions);

      const newReport = {
        startDate,
        endDate,
        purchasesData: filteredPurchases,
        distributionsData: distributionsArray,
      };

      if (state.reports.length >= 20) {
        state.reports.shift();
      }

      state.reports.push(newReport);
    },
  },
});

export const { generateReport } = reportSlice.actions;
export default reportSlice.reducer;
