const Module = require('./pmp')
const io     = require('@youwol/io')
const df     = require('@youwol/dataframe')
const fs     = require('fs')
const { exit } = require('process')

/*
surface.uniformRemesh
surface.adaptiveRemesh
surface.simplify
surface.explicitSmoothing
surface.implicitSmoothing
*/

Module().then( pmp => {
    if (process.argv.length<3) {
        console.log(`Missing filename.
Usage:
    node script.js myFileName.ts`)
        exit(0)
    }
    const surfs = io.decodeGocadTS( fs.readFileSync(process.argv[2], 'utf8') )
    if (surfs===undefined || surfs.length===0) {
        console.error("No loaded surface, bad filename "+process.argv[2]) ;
        exit(-1)
    }

    surfs.forEach( (surf, i) => {
        console.log('doing surface', i)
        const surface   = pmp.buildSurface(surf.series['positions'].array, surf.series['indices'].array)
        const meanEdge  = surface.meanEdgeLength()
        console.log('  init triangles: ' + surf.series['indices'].count)
        surface.adaptiveRemesh(meanEdge*1.5, meanEdge*2, meanEdge/100, 10, true)
        surf.series.positions.array = surface.position()
        surf.series.indices.array = surface.index()
        console.log('  final triangles: ' + surf.series['indices'].count)
    })

    const bufferOut = io.encodeGocadTS(surfs)
    fs.writeFile(process.argv[2]+'-remeshed.ts', bufferOut, 'utf8', err => {})
})
