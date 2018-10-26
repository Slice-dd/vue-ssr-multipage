const glob = require('glob')
const path = require('path')

module.exports = function getEntryPath(side) {

  const pathRoot = path.resolve(__dirname, `../src/**/entry-${side}.js`)

  const entryPath = glob.sync(pathRoot)
  
  const entry = {}
  
  entryPath.forEach(file => {
    entry[file.split('src/')[1].split('/')[0]] = file
  })

  return entry

  // return   new Promise((resolve, reject) => {
  //   glob(pathRoot, function (err, files) {
  //     if (err) {
  //       reject(err)
  //     }

  //     const entry = {}
      
  //     files.fprEach(file => {
  //       entry[file.split('src/')[1].split('/')[0]] = file
  //     })
      
  //     resolve(entry)
  //   })
  // })
}


