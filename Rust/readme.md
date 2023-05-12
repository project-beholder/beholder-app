# Setup

Assuming Rust and Cargo are installed. 

### Install and setup OpenCV (for Windows)
**Windows**
Install OpenCV >4.7.0 from releases page https://opencv.org/releases/

Set the following environment variables (where OPENCV_DIR = your OpenCV installation directory):
`OPENCV_LINK_LIBS: opencv_world470,opencv_world470d`
`OPENCV_LINK_PATHS: "OPENCV_DIR\build\x64\vc16\lib"`
`OPENCV_INCLUDE_PATHS: "OPENCV_DIR\build\include"`

**Mac**
Install Homebrew: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
Install OpenCV: `brew install opencv`
Install pkg-config: `brew install pkg-config`

### Build and run project 
```
> cd rust
> cargo build
```

Once Cargo creates the `target` folder, go to `OPENCV_DIR\build\x64\vc16\bin\` and copy over all the `.dll` files to `target\debug\`. 

Run using 
```
> cargo run
```
