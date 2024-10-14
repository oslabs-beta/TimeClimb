import Knex from 'knex';
const pg = Knex({
    client: 'pg',
    //needs to be moved to env
    connection: 'postgresql://postgres:Dudeman32%211@localhost:5432/time_climb'
})

function logData(req, res, next){
    pg
      .select('*')
      .from('step_functions')
      .then((data) => {
        console.log(data)
        next()
      })
      .catch(err => console.log(err))

}


export default logData
   

