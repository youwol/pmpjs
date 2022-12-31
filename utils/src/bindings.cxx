#include "SurfaceMesh.h"
#include "MatVec.h"
#include "algorithms/SurfaceRemeshing.h"
#include "algorithms/SurfaceSmoothing.h"
#include "algorithms/SurfaceSimplification.h"
#include "algorithms/SurfaceCurvature.h"

#include <emscripten/bind.h>
#include <emscripten/val.h>

using namespace pmp;
using namespace emscripten;

void uniformRemesh(
    SurfaceMesh& mesh, 
    Scalar edge_length, 
    unsigned int iterations = 10, 
    bool use_projection = true)
{
    SurfaceRemeshing algo(mesh);
    algo.uniform_remeshing(edge_length, iterations, use_projection);
}

void adaptiveRemesh(
    SurfaceMesh& mesh, 
    Scalar min_edge_length,
    Scalar max_edge_length,
    Scalar approx_error,
    unsigned int iterations = 10,
    bool use_projection = true)
{
    SurfaceRemeshing algo(mesh);
    algo.adaptive_remeshing(min_edge_length, max_edge_length, approx_error, iterations, use_projection);
}

void simplify(
    SurfaceMesh& mesh,
    unsigned int nb_vertices,
    Scalar aspect_ratio = 0.0,
    Scalar edge_length = 0.0,
    unsigned int max_valence = 0, 
    Scalar normal_deviation = 0.0,
    Scalar hausdorff_error = 0.0)
{
    SurfaceSimplification algo(mesh);
    algo.initialize(aspect_ratio, edge_length, max_valence, normal_deviation, hausdorff_error);
    algo.simplify(nb_vertices);
}

void explicitSmoothing(
    SurfaceMesh& mesh,
    unsigned int iters = 10,
    bool use_uniform_laplace = false)
{
    SurfaceSmoothing algo(mesh);
    algo.explicit_smoothing(iters, use_uniform_laplace);
}

void implicitSmoothing(
    SurfaceMesh& mesh,
    Scalar timestep = 0.001,
    bool use_uniform_laplace = false,
    bool rescale = true)
{
    SurfaceSmoothing algo(mesh);
    algo.implicit_smoothing(timestep, use_uniform_laplace, rescale);
}

/*
void curvatures(SurfaceMesh& mesh, emscripten::val cb) {
    SurfaceCurvature algo(mesh) ;
    unsigned int post_smoothing_steps = 0 ;
    algo.analyze(post_smoothing_steps) ;
    for (auto v : mesh.vertices()) {
        cb(algo.mean_curvature(v), algo.gauss_curvature(v), algo.min_curvature(v), algo.max_curvature(v)) ;
    }
}
*/

val curvature(SurfaceMesh& mesh, const std::string& name) {
    int index = -1 ;
    if (name == "mean")  index = 0 ;
    if (name == "gauss") index = 1 ;
    if (name == "min")   index = 2 ;
    if (name == "max")   index = 3 ;
    if (index==-1) {
        std::cerr << "Error in surface.curvature: unknown curvature named " << name << std::endl ;
        return val::undefined() ;
    }
    SurfaceCurvature algo(mesh) ;
    unsigned int post_smoothing_steps = 0 ;
    algo.analyze(post_smoothing_steps) ;
    std::vector<double> b(mesh.n_vertices(), 0) ;
    unsigned int i = 0;
    for (auto v : mesh.vertices()) {
        switch (index) {
            case 0: b[i++] = algo.mean_curvature(v); break ;
            case 1: b[i++] = algo.gauss_curvature(v); break ;
            case 2: b[i++] = algo.min_curvature(v); break ;
            case 3: b[i++] = algo.max_curvature(v); break ;
        }
    }
    return val::array(b) ;
}

std::unique_ptr<SurfaceMesh> buildSurface(const val& position, const val& index) {
    auto mesh = std::make_unique<SurfaceMesh>();
    std::vector<double> pos = vecFromJSArray<double>(position);
    for (unsigned int i=0; i<pos.size(); i+=3) {
        mesh->add_vertex(Point(pos[i], pos[i+1], pos[i+2])) ;
    }
    std::vector<int> idx = vecFromJSArray<int>(index);
    for (unsigned int i=0; i<idx.size(); i+=3) {
        mesh->add_triangle(Vertex(idx[i]), Vertex(idx[i+1]), Vertex(idx[i+2])) ;
    }
    return mesh ;
}

double meanEdgeLength(SurfaceMesh& mesh) {
    Scalar l(0);
    for (auto eit : mesh.edges())
        l += distance(mesh.position(mesh.vertex(eit, 0)),
                      mesh.position(mesh.vertex(eit, 1)));
    l /= (Scalar)mesh.n_edges();
    return l;
}


/*
 * @brief Iterate over the vertices
 * 
 * @param mesh The SurfaceMesh
 * @param cb The callback with parameters (x, y, z, id)
void forEachVertex(SurfaceMesh& mesh, emscripten::val cb) {
    auto points = mesh.get_vertex_property<Point>("v:point");
    unsigned int id = 0;
    for (auto v : mesh.vertices()) {
        auto p = points[v] ;
        cb(p[0], p[1], p[2], id);
        id++;
    }
}
*/

val getPosition(SurfaceMesh& surface) {
    std::vector<double> pos(surface.n_vertices()*3, 0) ;
    auto points = surface.get_vertex_property<Point>("v:point");
    unsigned int id = 0;
    for (auto v : surface.vertices()) {
        auto p = points[v] ;
        pos[id++] = p[0] ; pos[id++] = p[1] ; pos[id++] = p[2] ;
    }
    return val::array(pos) ;
}

val getIndex(SurfaceMesh& surface) {
    std::vector<IndexType> index(surface.n_faces()*3, 0) ;
    unsigned int id = 0;
    for (auto f : surface.faces()) {
        auto halfedge = surface.halfedge(f) ;
        index[id++]   = surface.to_vertex(halfedge).idx() ;
        halfedge      = surface.next_halfedge(halfedge) ;
        index[id++]   = surface.to_vertex(halfedge).idx() ;
        halfedge      = surface.next_halfedge(halfedge) ;
        index[id++]   = surface.to_vertex(halfedge).idx() ;
    }
    return val::array(index) ;
}

/*
std::vector<Scalar> getVertices(SurfaceMesh& mesh) {
    std::vector<Scalar> position;
    auto points = mesh.get_vertex_property<Point>("v:point");

    for (auto v : mesh.vertices()) {
        const auto& p = points[v] ;
        position.push_back(p[0]);
        position.push_back(p[1]);
        position.push_back(p[2]);
    }

    return position;
}
*/

/*
 * @brief Iterate over the triangles
 * 
 * @param mesh The SurfaceMesh
 * @param cb The callback with parameters (i, j, k, id)
void forEachTriangle(SurfaceMesh& mesh, emscripten::val cb) {
    unsigned int id = 0;
    for (auto f : mesh.faces()) {
        auto halfedge = mesh.halfedge(f) ;
        IndexType i = mesh.to_vertex(halfedge).idx() ;
        halfedge = mesh.next_halfedge(halfedge) ;
        IndexType j = mesh.to_vertex(halfedge).idx() ;
        halfedge = mesh.next_halfedge(halfedge) ;
        IndexType k = mesh.to_vertex(halfedge).idx() ;
        cb(i,j,k, id) ;
        id++;
    }
}
*/

// ----------------------------------------------------

EMSCRIPTEN_BINDINGS(Module) {

    register_vector<int>   ("StdVectorInt");
    register_vector<double>("StdVectorDouble");

    class_<SurfaceMesh>("SurfaceMesh")
        .constructor<>()
        .function("nbVertices",        &SurfaceMesh::n_vertices)
        .function("nbTriangles",       &SurfaceMesh::n_faces)
        .function("curvature",         &curvature)
        .function("meanEdgeLength",    &meanEdgeLength)
        .function("position",          &getPosition)
        .function("index",             &getIndex)
        .function("uniformRemesh",     &uniformRemesh)
        .function("adaptiveRemesh",    &adaptiveRemesh)
        .function("simplify",          &simplify)
        .function("explicitSmoothing", &explicitSmoothing)
        .function("implicitSmoothing", &implicitSmoothing)
    ;

    function("buildSurface", &buildSurface);
    //function("forEachVertex", &forEachVertex);
    //function("getVertices", &getVertices);
    //function("forEachTriangle", &forEachTriangle);
    //function("meanEdgeLength", &meanEdgeLength);
    // function("uniformRemesh",     &uniformRemesh);
    // function("adaptiveRemesh",    &adaptiveRemesh);
    // function("simplify",          &simplify);
    // function("explicitSmoothing", &explicitSmoothing);
    // function("implicitSmoothing", &implicitSmoothing);
    // function("curvatures",        &curvatures);
}
