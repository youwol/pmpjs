const Module = require('./pmp')
const fs     = require('fs')

/*
class StreamStringTS {
    constructor() {
        this.buffer = `GOCAD TSurf 1.0
HEADER {
    name: surface
}
`
    this.id = 0
    }
    write(s)   { if (s !== undefined) { this.buffer += s } }
    writeln(s) { this.write(s); this.write('\n') }

    addPt(x, y, z) {
        this.writeln(`VRTX ${this.id++} ${x} ${y} ${z}`)
    }
    addTr(i, j, k) {
        this.writeln(`TRGL ${i} ${j} ${k}`)
    }
    end() {
        this.writeln('END')
    }
}
*/

Module().then( pmp => {
    const vertices  = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, -0.5877852439880371, 0.80901700258255, 0, -3.599146555896214e-17, 0.80901700258255, 0.5877852439880371, 0.5877852439880371, 0.80901700258255, 7.198293111792428e-17, 1.0797439998560886e-16, 0.80901700258255, -0.5877852439880371, -0.5877852439880371, 0.80901700258255, -1.4396586223584855e-16, -0.9510565400123596, 0.30901700258255005, 0, -5.823541433041957e-17, 0.30901700258255005, 0.9510565400123596, 0.9510565400123596, 0.30901700258255005, 1.1647082866083914e-16, 1.747062496087036e-16, 0.30901700258255005, -0.9510565400123596, -0.9510565400123596, 0.30901700258255005, -2.329416573216783e-16, -0.9510565400123596, -0.30901700258255005, 0, -5.823541433041957e-17, -0.30901700258255005, 0.9510565400123596, 0.9510565400123596, -0.30901700258255005, 1.1647082866083914e-16, 1.747062496087036e-16, -0.30901700258255005, -0.9510565400123596, -0.9510565400123596, -0.30901700258255005, -2.329416573216783e-16, -0.5877852439880371, -0.80901700258255, 0, -3.599146555896214e-17, -0.80901700258255, 0.5877852439880371, 0.5877852439880371, -0.80901700258255, 7.198293111792428e-17, 1.0797439998560886e-16, -0.80901700258255, -0.5877852439880371, -0.5877852439880371, -0.80901700258255, -1.4396586223584855e-16, -1.2246468525851679e-16, -1, 0, -7.498798786105971e-33, -1, 1.2246468525851679e-16, 1.2246468525851679e-16, -1, 1.4997597572211942e-32, 2.2496396358317913e-32, -1, -1.2246468525851679e-16, -1.2246468525851679e-16, -1, -2.9995195144423884e-32]
    const triangles = [0, 5, 6, 1, 6, 7, 2, 7, 8, 3, 8, 9, 6, 5, 11, 5, 10, 11, 7, 6, 12, 6, 11, 12, 8, 7, 13, 7, 12, 13, 9, 8, 14, 8, 13, 14, 11, 10, 16, 10, 15, 16, 12, 11, 17, 11, 16, 17, 13, 12, 18, 12, 17, 18, 14, 13, 19, 13, 18, 19, 16, 15, 21, 15, 20, 21, 17, 16, 22, 16, 21, 22, 18, 17, 23, 17, 22, 23, 19, 18, 24, 18, 23, 24, 21, 20, 26, 22, 21, 27, 23, 22, 28, 24, 23, 29]
    const surface   = pmp.buildSurface(vertices, triangles)
    const meanEdge  = surface.meanEdgeLength()

    // surface.uniformRemesh
    // surface.adaptiveRemesh
    // surface.simplify
    // surface.explicitSmoothing
    // surface.implicitSmoothing
    surface.uniformRemesh(meanEdge/2, 10, true)

    const a = surface.curvature('mean') // mean, gauss, min or max
    console.log('Displaying curvature attribute:')
    a.forEach( v => console.log(v))

    console.log('Displaying positions:')
    const position = surface.position()
    for (let i=0; i<position.length; i+=3) {
        console.log(position[i], position[i+1], position[i+2])
    }

    console.log('Displaying curvature indices:')
    const index = surface.index()
    for (let i=0; i<index.length; i+=3) {
        console.log(index[i], index[i+1], index[i+2])
    }
})


/*
if (1) {
    const stream = new StreamStringTS()
    pmp.forEachVertex(surface, (x,y,z) => stream.addPt(x,y,z) )
    pmp.forEachTriangle(surface, (i,j,k) => stream.addTr(i,j,k) )
    stream.end()
    fs.writeFile('/Users/fmaerten/platform/test/data/files/gocad/ts/remeshed.ts', stream.buffer, function(err) {} )
}
*/
