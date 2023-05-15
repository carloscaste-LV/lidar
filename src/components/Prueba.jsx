import React from 'react';
import './css/csvButton.css';
import {buttonNumPressed,initCount} from './Control.jsx'

let dataPack = [];
let beginNewDataCount =  true;



class CSVWriter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fulldata:[],
      data: [['metaX', 'metaY', 'rPositionX', 'rPositionY', 'angulo', 'sensor1', 'sensor2', 'sensor3']]
    };
  }
  
  componentDidMount() {
    setInterval(() => {
      //if(buttonNumPressed){beginNewDataCount = true}
      const batchData = this.props.dataBatch();
      const { data } = this.state;
      if (batchData && buttonNumPressed) {
        console.log(buttonNumPressed);
        const newData = [...data, batchData];
        this.setState({ data: newData });
        if (data.length === 60) {
          initCount();
          beginNewDataCount =false;
          dataPack.push(data.slice(1,data.length));
          console.log(dataPack);
          this.setState({ data: [['metaX', 'metaY', 'rPositionX', 'rPositionY', 'angulo', 'sensor1', 'sensor2', 'sensor3']] });
        }
      }
    }, 50);
  }
  
  downloadCSV = () => {
    const { data } = this.state;
    const csvContent = "data:text/csv;charset=utf-8," + dataPack.map(batch => batch.map(row => row.join(",")).join("\n")).join("\n\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
  }
  

  render() {
    return (
      <div>
        <button id='csvButton' className='button' style={{height:"30px",width:"90px"}} onClick={this.downloadCSV}>Descargar CSV</button>
      </div>
    );
  }
}
export  {beginNewDataCount}
export default CSVWriter;
