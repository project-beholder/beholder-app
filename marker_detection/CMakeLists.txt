cmake_minimum_required(VERSION 3.13)
project( OpenCV_ArUco )

set(OpenCV_DIR "C:\\OpenCV-4.5.5\\install\\install\\opencv\\")
find_package(OpenCV REQUIRED)
include_directories(${OpenCV_INCLUDE_DIRS})

add_executable(detectMarkers src/marker_Detection.cpp)

target_link_libraries(detectMarkers ${OpenCV_LIBS})