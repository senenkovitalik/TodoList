const Mutation = {
  createTask(parent, { name }, ctx, info) {
    return ctx.db.mutation.createTask({
      data: {
        name
      },
      info
    })
  },
  deleteTask(parent, { id }, ctx, info) {
    return ctx.db.mutation.deleteTask({
      where: {
        id
      },
      info
    })
  },
  deleteManyTasks(parent, { id_in }, ctx, info) {
    return ctx.db.mutation.deleteManyTasks({
      where: {
        id_in: id_in
      },
      info
    })
  },
  changeStatus(parent, {id, status}, ctx, info) {
    return ctx.db.mutation.updateTask({
      data: {
        status
      },
      where: {
        id
      }
    })
  },
  updateTaskStatus(parent, args, ctx, info) {
    const {data: {status}, where: {id_in}} = args
      return ctx.db.mutation.updateManyTasks({
        data: {
          status
        },
        where: {
          id_in
        }
      })
  }
}

module.exports = {
  Mutation
}