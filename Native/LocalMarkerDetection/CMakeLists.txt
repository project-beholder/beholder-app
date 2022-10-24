cmake_minimum_required(VERSION 3.7...3.24)
if (${CMAKE_VERSION} VERSION_LESS 3.12)
    cmake_policy(VERSION ${CMAKE_MAJOR_VERSION}.${CMAKE_MINOR_VERSION})
endif()

project( OpenCV_ArUco  VERSION 1.0 )

set(OpenCV_DIR "C:/OpenCV-4.5.5/install/install/opencv")
set(OpenCV_STATIC ON)
find_package(OpenCV REQUIRED)
include_directories(${OpenCV_INCLUDE_DIRS} include)

add_executable(detectMarkers src/marker_Detection_demo.cpp)

target_link_libraries(detectMarkers ${OpenCV_LIBS})
