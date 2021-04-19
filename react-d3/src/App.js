import React, {Component} from 'react';
import { Container, Row, Col, ListGroup, Form, Button, Alert } from 'react-bootstrap';
// import BubbleChart from './component/BubbleChart.component';
import NetworkGraph from './component/NetworkGraph.component';
import Films from './component/Films.component';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { rawdata } from './raw.js';

class App extends Component {
  _selectYear = (e) => {
    this.selectedYear = parseInt(e.target.id);
    this.setState({films: []});
    this._refreshChart();
  }

  _setSearchText = (e) => {
    this.setState({search_text: e.target.value});
  }

  _searchPeople = () => {
    var peopleMap = this.peopleMaps[this.selectedYear];
    if(peopleMap.has(this.state.search_text)) {
      this.chart.search(peopleMap.get(this.state.search_text));
      this.setState({alert: "hidden"});
    } else {
      this.setState({alert: ""});
    }
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
        this.peopleMaps[year] = peopleMap;
    }

    this._refreshChart();
  }

  constructor(props){
    super(props);
    // this.bubblechart = new BubbleChart();
    var that = this;
    this.chart = new NetworkGraph();
    this.chart.setCallback((films) => {
      that.setState({films: films});
    });
    this.data = {};
    this.peopleMaps = {};
    this.selectedYear = 1910;
    this.state = {count: 0, search_text: "", alert: "hidden", films: []};
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
              <Col sm={1}>
                <Row>
                  <ListGroup defaultActiveKey="#1910">
                    {
                      yearSelection.map((year) => {
                        return <ListGroup.Item href={"#"+year} id={year} action onClick={this._selectYear}>
                        {year}'s
                      </ListGroup.Item>;
                      })
                    }
                  </ListGroup>
                </Row>
              </Col>
              <Col>
                <p>Total connections: {this.state.count}</p>
                <Row>
                  <Col sm={4}><div className="director"></div></Col>
                  <Col sm={5}>導演</Col>
                </Row>
                <Row>
                  <Col sm={4}><div className="actor"></div></Col>
                  <Col sm={5}>演員</Col>
                </Row>
                <Row>
                  <Col sm={4}><div className="both"></div></Col>
                  <Col sm={5}>導演+演員</Col>
                </Row>
                <br/>
                <Form>
                  <Form.Label>Search 導演/演員</Form.Label>
                  <Form.Control type="text" value={this.state.search_text} onChange={this._setSearchText}/>
                  <br/>
                  <Button variant="primary" onClick={this._searchPeople}>
                    Search
                  </Button>
                </Form>
                <br/>
                <Alert variant='danger' hidden={this.state.alert}>
                  No search found!
                </Alert>
                <br/>
                <Films films={this.state.films} />
              </Col>
          </Row>
      </Container>
    );
  }
}

export default App;
