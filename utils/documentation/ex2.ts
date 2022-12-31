/**
 * Curvature analysis example
```js
const Module = require('./pmp')

Module().then( pmp => {
    const vertices  = [...]
    const triangles = [...]

    const surface   = pmp.buildSurface(vertices, triangles)

    const a = surface.curvature('mean') // mean, gauss, min or max
    console.log('Displaying curvature attribute:')
    a.forEach( v => console.log(v))
})
```
*/
export namespace Example_2 {}