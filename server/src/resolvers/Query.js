const Query = {
  tasks(parent, args, ctx, info) {
    return ctx.db.query.tasks()
  }
}

module.exports =  { Query }