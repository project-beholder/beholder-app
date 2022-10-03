## ArUco Marker Detection 

### Installation requirements
* OpenCV
* Visual Studio (for Windows and maybe Mac)
* CMake

### Setup OpenCV
* [Mac](https://docs.opencv.org/4.6.0/d0/db2/tutorial_macos_install.html)
* make the folders make sense for you
* run `cmake -DCMAKE_SYSTEM_PROCESSOR=arm64 -DCMAKE_OSX_ARCHITECTURES=arm64 -DWITH_OPENJPEG=OFF -DWITH_IPP=OFF -DCMAKE_BUILD_TYPE=RELEASE -DOPENCV_EXTRA_MODULES_PATH=../opencv_contrib/modules -DBUILD_EXAMPLES=ON ../opencv` - or at least this worked for me who knows could just be `cmake -DCMAKE_BUILD_TYPE=RELEASE -DOPENCV_EXTRA_MODULES_PATH=../opencv_contrib/modules -DBUILD_EXAMPLES=ON ../opencv`
* DONT FORGET TO RUN `make -j7`

### Steps build detection
* Navigate to `marker_detection` directory
* Alter the CMakeLists.txt line to match your opencv path `set(OpenCV_DIR "PATH/TO/OPENCV/BUILD")`
* Create build directory `build_win` or `build_mac`
* Follow the steps below on a terminal
```
> cd build_xxx
> cmake ../
> cmake --build .
```
* This should create an executable (.exe in the `build_win/Debug` folder on Windows) that can be run from the terminal `> Debug/detectMarkers.exe` or whatever your systetm equivalent is
