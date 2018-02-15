import React, {Component} from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import {TASKS} from './List'
import 'bootstrap/dist/css/bootstrap.min.css'
import { InputGroup, Input, InputGroupAddon, Button } from 'reactstrap'

class AddTask extends Component {
  state = {
    task: "",
  }

  _handleChange = (e) => {
    this.setState({ task: e.target.value })
  }

  _createTask = () => {
    if (this.state.task.length > 0) {
      this.props.mutate({
        variables: { name: this.state.task },
        update: (store, { data: { createTask }}) => {
          const data = store.readQuery({ query: TASKS })
          data.tasks.push(createTask)
          store.writeQuery({ query: TASKS, data })
        }
      })
      this.setState({ task: '' })
    }
  }

  render() {
    return (
      <InputGroup style={{marginTop: 1+'rem', marginBottom: 1+'rem'}}>
        <Input type="text" placeholder="Add new task" bsSize="lg" value={this.state.task}
               onChange={this._handleChange}
               onKeyUp={e => {if (e.key === "Enter") this._createTask()}} />
        <InputGroupAddon addonType="append">
          <Button color="secondary" onClick={() => this._createTask()}>Add</Button>
        </InputGroupAddon>
      </InputGroup>
    )
  }
}

const CREATE_TASK = gql`
  mutation createTask($name: String!) {
    createTask(name: $name) {
      id
      name
      status
    }
  }
`

export default graphql(CREATE_TASK)(AddTask)