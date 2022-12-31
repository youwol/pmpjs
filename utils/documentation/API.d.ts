
/**
 * @brief An array of number of any size
 */
export type Vectord = Array<number>

export namespace pmp {

    /**
     * @brief Build a SurfaceMesh given the packed position and index
     */
    export function buildSurface(position: Vectord, index: Vectord): SurfaceMesh 

    export class SurfaceMesh {

        /**
         * @brief Get the mean edge length of this SurfaceMesh
         */
        meanEdgeLength(): number

        /**
         * @brief Get the curvatures at vertices
         * @param {string} name The name of the curvature (`mean`, `gauss`, `min` or `max`)
         * @returns {Vectord} The curvature as an array 
         */
        curvature(name: string): Vectord

        /**
         * @brief Get the position of all vertices in a packed array
         */
        position(): Vectord

        /**
         * @brief Get the indices of all triangles in a packed array
         */
        index(): Vectord

        /**
         * @brief Uniform remesh the surface
         * @param edge_length 
         * @param iterations Default is 10
         * @param use_projection Default is true
         * @see meanEdgeLength
         */
        uniformRemesh(edge_length: number, iterations: number, use_projection: boolean): void

        /**
         * @brief Adaptive remeshing
         * @param min_edge_length 
         * @param max_edge_length 
         * @param approx_error 
         * @param iterations Default is 10
         * @param use_projection Default is true
         */
        adaptiveRemesh(min_edge_length: number,max_edge_length: number, approx_error: number, iterations: number, use_projection: boolean): void

        /**
         * @brief Simplify the surface
         * @param nb_vertices
         * @param aspect_ratio Default is 0
         * @param edge_length Default is 0
         * @param max_valence Default is 0
         * @param normal_deviation Default is 0
         * @param hausdorff_error Default is 0
         */
        simplify(nb_vertices: number, aspect_ratio: number, edge_length: number, max_valence: number, normal_deviation: number, hausdorff_error: number): void

        /**
         * @brief Explicit smoothing of the surface
         * @param iters Default is 10
         * @param use_uniform_laplace Default is false 
         */
        explicitSmoothing(iters: number, use_uniform_laplace: boolean)

        /**
         * @brief Implicit smoothing of the surface
         * @param timestep Default is 0.001
         * @param use_uniform_laplace Default is false
         * @param rescale Default is true
         */
        implicitSmoothing(timestep: number, use_uniform_laplace: boolean, rescale: boolean): void
    }
    
}
