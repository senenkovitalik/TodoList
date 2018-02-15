import React, {Component} from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { Card, CardBody, } from 'reactstrap'

const select = {
  borderStyle: 'solid',
  borderWidth: 1+'px',
  borderColor: 'black',
  backgroundColor: '#FFA500'
}

class Task extends Component {
  state = {
    selected: false
  }

  _changeStatus = (e) => {
    const status = this.props.task.status === 'ACTIVE'
      ? 'COMPLETED'
      : 'ACTIVE'
    this.props.mutate({
      variables: {
        id: this.props.task.id,
        status
      }
    })
  }

  _select = () => {
    this.setState({ selected: !this.state.selected })
    this.props.select(this.props.task)
  }

  render() {
    return (
      <Card onClick={() => this._select()} style={this.props.selected ? select : null}>
        <CardBody style={{padding: 1+'rem'}}>
          <input type="checkbox" style={{marginRight: 5+'px'}} checked={this.props.task.status === 'COMPLETED'} onChange={e => this._changeStatus(e)} />
          {this.props.task.name}
        </CardBody>
      </Card>
    )
  }
}

const CHANGE_STATUS = gql`
  mutation chnageStatus($id: ID!, $status: TaskStatus!) {
    changeStatus(id: $id, status: $status) {
      id
      name
      status
    }
  }
`

export default graphql(CHANGE_STATUS)(Task)