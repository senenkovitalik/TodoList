import React, {Component} from 'react'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import _ from 'lodash'
import Task from "./Task";
import { Col, Form, FormGroup, Label, Input } from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

class List extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: "ACTIVE",
      action: 'DEFAULT',
      // selected tasks by filter
      ACTIVE: [],
      COMPLETED: [],
      ALL: []
    }
    this.selectTask = this.selectTask.bind(this)
  }

  selectTask(task) {
    const key = this.state.filter
    this.setState({
      [key]: _.xor(this.state[key], [task])
    })
  }

  _filter = (filter) => {
    this.setState({
      filter: filter,
    })
  }

  _handleAction = (e) => {
    switch (e.target.value) {
      case 'SELECT_ALL':
        this.setState({
          [this.state.filter]: this.props.tasks.tasks
        })
        break;
      case 'DESELECT_ALL':
        this.setState({
          [this.state.filter]: []
        })
        break;
      case 'CHECK_AS_ACTIVE':
        this.props.updateTaskStatus({
          variables: {
            status: 'ACTIVE',
            id_in: this.state[this.state.filter].map(task => task.id)
          },
          update: () => {
            this.setState({
              [this.state.filter]: []
            })
          }
        })
        break
      case 'CHECK_AS_COMPLETED':
        this.props.updateTaskStatus({
          variables: {
            status: 'COMPLETED',
            id_in: this.state[this.state.filter].map(task => task.id)
          },
          update: () => {
            this.setState({
              [this.state.filter]: []
            })
          }
        })
        break
      case 'DELETE':
        this.props.deleteManyTasks({
          variables: {
            id_in: this.state[this.state.filter].map(task => task.id)
          }
        })
        break;
      case 'DELETE_ALL':
        const tasks = this.state.filter === "ALL"
          ? this.props.tasks.tasks
          : _.filter(this.props.tasks.tasks, {'status': this.state.filter})

        this.props.deleteManyTasks({
          variables: {
            id_in:
              tasks.map(task => task.id)
          }
        })
        break;
      default:
    }
    this.setState({ action: 'DEFAULT' })
  }

  render() {
    if (this.props.data && this.props.data.loading) {
      return (<p>Loading</p>)
    }
    if (this.props.data && this.props.data.error) {
      return (<p>Error</p>)
    }
    const condition = this.state[this.state.filter].length === 0
    const tasks = this.state.filter === "ALL"
      ? this.props.tasks.tasks
      : _.filter(this.props.tasks.tasks, { 'status': this.state.filter })

    return (
      <Form>
        <FormGroup row>
          <Label for="filter" xs="2">Filter:</Label>
          <Col xs="10">
            <Input type="select" name="filter" id="filter" onChange={(e) => this._filter(e.target.value)}>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ALL">All</option>
            </Input>
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label for="action" xs={2}>Group actions:</Label>
          <Col xs={10}>
            <Input type="select" name="groupActions" id="action" value={this.state.action} onChange={this._handleAction}>
              <option value="DEFAULT">Choose an action</option>
              {
                condition
                  ? <option value="SELECT_ALL">Select all</option>
                  : <option value="DESELECT_ALL">Deselect all</option>
              }
              {
                this.state.filter === 'ALL' || this.state.filter === 'ACTIVE'
                  ? <option value="CHECK_AS_COMPLETED" disabled={condition}>Check as completed</option>
                  : null
              }
              {
                this.state.filter === 'ALL' || this.state.filter === 'COMPLETED'
                ? <option value="CHECK_AS_ACTIVE" disabled={condition}>Check as active</option>
                : null
              }
              <option value="DELETE" disabled={condition}>Delete</option>
              <option value="DELETE_ALL">Delete all</option>
            </Input>
          </Col>
        </FormGroup>

        {
          tasks.length > 0 ? <hr/> : null
        }
        {
          tasks.map(task => {
            return <Task key={task.id}
                         task={task}
                         select={this.selectTask}
                         selected={_.indexOf(this.state[this.state.filter], task) !== -1} />
          })
        }
        <hr/>
        Total: {tasks.length}
      </Form>
    )
  }
}

export const TASKS = gql`
  query tasks {
    tasks {
      id
      name
      status
    }
  }
`

const UPDATE_MANY_TASKS = gql`
  mutation updateTaskStatus($status: TaskStatus!, $id_in: [ID!]) {
    updateTaskStatus(
      data: {status: $status}, 
      where: {id_in: $id_in}
    ) {
      count
    }
  }
`

const DELETE_MANY_TASKS = gql`
  mutation deleteManyTasks($id_in: [ID!]) {
    deleteManyTasks(id_in: $id_in) {
      count
    }
  }
`

export default compose(
  graphql(TASKS, { name: 'tasks' }),
  graphql(UPDATE_MANY_TASKS, {
    name: 'updateTaskStatus',
    options: {
      refetchQueries: ['tasks']
    }
  }),
  graphql(DELETE_MANY_TASKS, {
    name: 'deleteManyTasks',
    options: {
      refetchQueries: ['tasks']
    }
  })
)(List)