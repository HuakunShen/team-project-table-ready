import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Card, CardBody, CardHeader, Col, Row, Table} from 'reactstrap';
import axios from 'axios';

const log = console.log;

function RestRow(props) {
  const rest = props.rest;
  const del = props.delete;
  const restLink = `/restaurants/${rest._id}`;
  const ownerLink = `/users/${rest.owner}`;

  return (
    <tr key={rest._id.toString()}>
      <th scope="row"><Link to={restLink}>{rest.name}</Link></th>
      <td><Link to={ownerLink}>{rest.owner}</Link></td>
      {/*<td>{rest.registered}</td>*/}
      {/*<td>{rest.owner}</td>*/}
      <td>{rest.location}</td>
      <td><Button outline color="danger" size="sm" onClick={() => {
        del(rest._id);
      }}>Delete
      </Button></td>
    </tr>
  );
}

class Restaurants extends Component {
  constructor(props) {
    super(props);
    this.deleteRest = this.deleteRest.bind(this);
    this.state = {
      rest: [],
      query: this.props.query
    };
  }

  componentWillReceiveProps(nextProp) {
    this.setState(nextProp);
  }

  componentDidMount() {
    axios.get('api/restaurants')
      .then(res => {
        if (res.data.length > 0) {
          this.setState({
            rest: res.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

  }

  deleteRest(id) {
    axios.delete('api/restaurants/' + id)
      .then(res => {
        this.setState({
          rest: this.state.rest.filter(el => el._id !== id)
        });
      })
      .catch(err => {
        log(err);
      });
  }


  restList() {
    let res = this.state.rest;

    if (this.state.query !== "") {
      res = res.filter((r) => {
        return r.name.toLowerCase().match(this.state.query);
      });
    }

    return res.map((rest, index) =>
      <RestRow key={index} rest={rest} delete={this.deleteRest}/>
    );
  }


  render() {
    return (
      <div className="animated fadeIn mx-auto">
        <Row>
          <Col xl={6}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Restaurants
              </CardHeader>
              <CardBody>
                <Table responsive hover>
                  <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Owner</th>
                    <th scope="col">Location</th>
                    {/*<th scope="col">registered</th>*/}
                    {/*<th scope="col">Role</th>*/}
                    <th scope="col">Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    this.restList()
                  }
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Restaurants;
