import images from "../utils/images";
import Header from "./header";

function Reports() {
  return(
    <>
    <Header header={'Reports'}/>
      <h1 className="no-content">No Content Yet</h1>
      <div className="video-container">
      <video autoPlay loop muted className="background-video">
        <source src={images.noData} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      </div>
    </>
  );
}

export default Reports;