## ArUco Marker Detection 

### Installation requirements
* OpenCV
* Visual Studio (for Windows and maybe Mac)
* CMake

### Steps 
* Navigate to `marker_detection` directory
* Create build directory `build_win` or `build_mac`
* Follow the steps below on a terminal
```
> cd build_xxx
> cmake ..
> cmake --build .
```
* This should create an executable (.exe in the `build_win/Debug` folder on Windows) that can be run from the terminal `> Debug/detectMarkers.exe`