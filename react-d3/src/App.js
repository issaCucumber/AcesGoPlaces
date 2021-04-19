import React, {Component} from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
// import BubbleChart from './component/BubbleChart.component';
import NetworkGraph from './component/NetworkGraph.component';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { rawdata } from './raw.js';

class App extends Component {
  _selectYear = (e) => {
    this.selectedYear = parseInt(e.target.id);
    this._refreshChart();
  }

  _refreshChart = () => {
    if(this.data[this.selectedYear] && this.data[this.selectedYear].stats) {
      var selectedSet = this.data[this.selectedYear].stats;
      this.chart.drawChart(selectedSet);
      this.setState({count: this.data[this.selectedYear].count});
    }
  }

  _fetchData = () => {
    this.data = {};
    for (var year in rawdata) {

        this.data[year] = {count: 0, stats: {}, maps: {}};

        let count = 0;
        let people = [];
        let connections = [];
        let peopleMap = new Map();

        let pairs = rawdata[year];

        let result = Object.keys(pairs).map((key) => {return [key, pairs[key]]});
        result.sort((a, b) => {
          return b[1].length - a[1].length;
        });

        if(year == 1950) {
          console.log(result.slice(0, 20));
        }

        let top = 0;
        let top_limit = 10;
        result.forEach((item) => {
            let key = item[0];
            let pair = item[1];
            let isTop = (top < top_limit);

            let parts = key.split("|||");
            let director = parts[0];
            let actor = parts[1];

            let directorId = null;
            if(peopleMap.has(director)) {
              directorId = peopleMap.get(director);
              let dobj = people[directorId];
              dobj.weight++;
              people[directorId] = dobj;
            } else {
              directorId = people.length;
              people.push({id: directorId, name: director, group: "director", weight: 1, top: isTop});
              peopleMap.set(director, directorId);
            }

            let actorId = null;
            if(peopleMap.has(actor)) {
              actorId = peopleMap.get(actor);
              let aobj = people[actorId];
              if(aobj.group == "director") {
                aobj.group = "both";
              }
              aobj.weight++;
              people[actorId] = aobj;
            } else {
              actorId = people.length;
              people.push({id: actorId, name: actor, group: "actor", weight: 1, top: isTop});
              peopleMap.set(actor, actorId);
            }

            connections.push({id: connections.length, "source":directorId, "target":actorId, "weight": pairs[key].length, films: pairs[key]});

            count += pair.length;
            top++;
        });
        
        this.data[year].count = count;
        this.data[year].stats = {nodes: people, links: connections};
    }

    this._refreshChart();
  }

  constructor(props){
    super(props);
    // this.bubblechart = new BubbleChart();
    this.chart = new NetworkGraph();
    this.data = {};
    this.selectedYear = 1910;
    this.state = {count: 0};
  }

  componentDidMount() {
    this._fetchData();
  }

  render() {
    const yearSelection = [1910];
    while(yearSelection[yearSelection.length - 1] < 2010) {
      yearSelection.push(yearSelection[yearSelection.length - 1] + 10);
    }

    return (
      <Container fluid>
          <Row>
              <Col sm={9}>
                <div id="graph"></div>
              </Col>
              <Col sm={3}>
                <ListGroup defaultActiveKey="#1910">
                  {
                    yearSelection.map((year) => {
                      return <ListGroup.Item href={"#"+year} id={year} action onClick={this._selectYear}>
                      {year}'s
                    </ListGroup.Item>;
                    })
                  }
                </ListGroup>
                <span>Total connections: {this.state.count}</span>
              </Col>
          </Row>
      </Container>
    );
  }
}

export default App;
