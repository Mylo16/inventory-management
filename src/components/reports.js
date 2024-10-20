import { useDispatch, useSelector } from "react-redux";
import images from "../utils/images";
import Header from "./header";
import { filterDistrubutionsFromLastFriday, filterPurchasesFromLastFriday } from "../utils/reportGenerator";
import { generateReport } from "../redux/reportSlice";
import { useState } from "react";
import '../css/reports.css';

function Reports() {
  const dispatch = useDispatch();
  const {purchases, distributions} = useSelector(state => state.inventory);
  const reports = useSelector(state => state.report.reports);

  const handleGenerateReport = () => {
    const filteredPurchases = filterPurchasesFromLastFriday(purchases);
    const filteredDistributions = filterDistrubutionsFromLastFriday(distributions);
    dispatch(generateReport({filteredPurchases, filteredDistributions}));
  };


  return(
    <>
    <Header header={'Reports'}/>
      <button className="generate-btn" onClick={handleGenerateReport}>Generate Report</button>
      {reports.length > 0 ? (
        <div className="report-container">
        {reports.map((report, index) => (
          <div key={index} className="report-card">
            <div className="report-dates">
              <span className="date-label">Period: </span>
              <span>{report.startDate} to {report.endDate}</span>
            </div>
  
            <div className="distributions-list">
              {report.distributionsData.map((distribution, distIndex) => (
                <div key={distIndex} className="distribution-item">
                  <div className="item-name">{distribution.itemName}</div>
                  <div className="item-info">
                    <span>Issues: {distribution.issues}</span>
                    <span>Balance: {distribution.balance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      ):(
        <>
        <h1 className="no-content">No Content Yet</h1>
        <div className="video-container">
        <video autoPlay loop muted className="background-video">
          <source src={images.noData} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        </div>
        </>
      )}
     
    </>
  );
}

export default Reports;