import React, {Component} from 'react'
import AddTask from './AddTask'
import List from './List'
import { Container, Row, Col } from 'reactstrap'

class App extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Col sm={{ size: 8, offset: 2 }}>
            <AddTask />
            <List/>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default App