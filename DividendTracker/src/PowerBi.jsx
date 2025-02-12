import React from "react";
import "./Chart.css"

function PowerBIReport ({showChart, setshowChart}){
    return (
        <div className="chart_background">
            <button className="close_button" onClick={() => {setshowChart(false)}}>X</button>
            <div className="chart_content">
                <iframe
                    title="Dividends Report"
                    width="1140"
                    height="541"
                    src="https://app.powerbi.com/reportEmbed?reportId=ef9b5f1e-d02d-434d-9318-9985a1510d7e&autoAuth=true&ctid=62c9c600-58b7-410d-806a-f711e71bd333"
                    allowFullScreen={true}
                    style={{ border: "none", width: "100%", height: "80vh" }}
                    
                />
            </div>
        </div>
        
    );
};

export default PowerBIReport;
