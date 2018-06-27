
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
        knex('projects').insert({
          name: 'Project Mayhem'
        }, 'id')
        .then(projectId => {
          return knex('palettes').insert([
            {
              name: 'First Palette',
              color1: 'rgba(1, 2, 3)',
              color2: 'rgba(2, 3, 4)',
              color3: 'rgba(3, 4, 5)',
              color4: 'rgba(4, 5, 6)',
              color5: 'rgba(9, 8, 7)',
              project_id: projectId[0]
            },
            {
              name: '2nd Palette',
              color1: 'rgba(1, 2, 3)',
              color2: 'rgba(2, 3, 4)',
              color3: 'rgba(3, 4, 5)',
              color4: 'rgba(4, 5, 6)',
              color5: 'rgba(9, 8, 7)',
              project_id: projectId[0]
            }
          ])
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
