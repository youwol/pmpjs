
/**
 * Remesh example
```js
const Module = require('./pmp')

Module().then( pmp => {
    const vertices  = [...]
    const triangles = [...]
    const surface   = pmp.buildSurface(vertices, triangles)
    const meanEdge  = surface.meanEdgeLength()

    surface.uniformRemesh(meanEdge/2, 10, true)
    
    console.log('Displaying vertex position:')
    const position = surface.position()
    for (let i=0; i<position.length; i+=3) {
        console.log(position[i], position[i+1], position[i+2])
    }

    console.log('Displaying triangle indices:')
    const index = surface.index()
    for (let i=0; i<index.length; i+=3) {
        console.log(index[i], index[i+1], index[i+2])
    }
})
```
*/
export namespace Exemple_1 {}