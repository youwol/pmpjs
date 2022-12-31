
project(pmp-library)

cmake_minimum_required(VERSION 3.0.2)

cmake_policy(SET CMP0048 NEW)
if(${CMAKE_VERSION} VERSION_GREATER "3.11.0")
cmake_policy(SET CMP0072 OLD)
endif()

set(PMP_MAJOR_VERSION 1)
set(PMP_MINOR_VERSION 2)
set(PMP_PATCH_VERSION 1)
set(PMP_VERSION ${PMP_MAJOR_VERSION}.${PMP_MINOR_VERSION}.${PMP_PATCH_VERSION})

set(CMAKE_PROJECT_VERSION ${PMP_VERSION})
set(CMAKE_PROJECT_VERSION_MAJOR ${PMP_MAJOR_VERSION})
set(CMAKE_PROJECT_VERSION_MINOR ${PMP_MINOR_VERSION})
set(CMAKE_PROJECT_VERSION_PATCH ${PMP_PATCH_VERSION})

option(EMSCRIPTEN         "Build the PMP JS lib"        ON)
option(PMP_BUILD_APPS     "Build the PMP applications"  OFF)
option(PMP_BUILD_EXAMPLES "Build the PMP examples"      OFF)
option(PMP_BUILD_TESTS    "Build the PMP test programs" OFF)
option(PMP_BUILD_DOCS     "Build the PMP documentation" OFF)

# set output paths
set(PROJECT_BINARY_DIR ${CMAKE_CURRENT_BINARY_DIR})
set(LIBRARY_OUTPUT_PATH ${PROJECT_BINARY_DIR})
set(EXECUTABLE_OUTPUT_PATH ${PROJECT_BINARY_DIR})

set(CMAKE_MODULE_PATH ${PROJECT_SOURCE_DIR}/cmake)

set(EIGEN_SOURCE_DIR "external/eigen")
set(RPLY_SOURCE_DIR "external/rply")

# setup PLY
include_directories(${RPLY_SOURCE_DIR})
add_subdirectory(${RPLY_SOURCE_DIR})

# setup Eigen
include_directories(${EIGEN_SOURCE_DIR})

include(AddFileDependencies)
include_directories(${PROJECT_SOURCE_DIR}/src/)

# set default compiler flags
if((UNIX OR APPLE) AND CMAKE_COMPILER_IS_GNUCXX)
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11 -pedantic -Wall -Wextra -Wno-deprecated-copy")
  if(CMAKE_CXX_COMPILER_VERSION VERSION_GREATER "7.0.0")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wno-int-in-bool-context")
  endif()
endif()

if(WIN32)
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -D_USE_MATH_DEFINES -DNOMINMAX -D_CRT_SECURE_NO_WARNINGS")
endif()

if (EMSCRIPTEN)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11 --bind -s WASM=1 --no-heap-copy -s ALLOW_MEMORY_GROWTH=1")
    if (PMP_BUILD_APPS)
      set(CMAKE_EXECUTABLE_SUFFIX ".html")
    endif()
endif()


# make a release build by default
if(NOT CMAKE_BUILD_TYPE)
  message(STATUS "No build type specified. Using 'Release' as default.")
  set(CMAKE_BUILD_TYPE "Release"
    CACHE STRING "The build type. Possible values: Debug Release RelWithDebInfo MinSizeRel."
    FORCE)
endif()


if(${CMAKE_BUILD_TYPE} STREQUAL "Debug")
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -ggdb")
endif()

# choose size of the scalar type
if(PMP_SCALAR_TYPE EQUAL 64)
  message(STATUS "Using 64-bit scalar type")
  add_definitions(-DPMP_SCALAR_TYPE_64)
endif()

# choose size of the index type
if(PMP_INDEX_TYPE EQUAL 64)
  message(STATUS "Using 64-bit index type")
  add_definitions(-DPMP_INDEX_TYPE_64)
endif()

# setup clang-tidy if program found
#include(clang-tidy)

# which directories to process
if (EMSCRIPTEN)
    add_subdirectory(src/pmp)
endif()

set(CPACK_PACKAGE_VERSION ${PMP_VERSION})
set(CPACK_SOURCE_PACKAGE_FILE_NAME "${CMAKE_PROJECT_NAME}-${CPACK_PACKAGE_VERSION}")
set(CPACK_SOURCE_IGNORE_FILES "/build/;/.git/;~$;${CPACK_SOURCE_IGNORE_FILES}")
set(CPACK_SOURCE_GENERATOR "ZIP")
include(CPack)

# add clang-format target if program is found
include(clang-format)
