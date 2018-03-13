cmake_minimum_required(VERSION 2.8.2)
project(node)

set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/build)
set(CMAKE_CXX_STANDARD 14)
# This required that curlpp also be compiled with the -fPIC flag.
set(CMAKE_CXX_FLAGS "-fPIC")
include_directories(src external)

add_library(node SHARED src/nodeprovider.cpp)
target_link_libraries(node
    -lm libcurlpp.a libcurl.a -lz
    -lssl -lcrypto -lpthread
    -static-libstdc++)