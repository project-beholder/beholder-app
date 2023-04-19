# Beholder
Beholder is a computer vision (CV) toolkit for building tangible controllers for interactive computer systems. Beholder facilitates designers to build physical inputs that are instrumented with CV markers. By observing the properties of these markers, a CV system can detect physical interactions that occur. Beholder provides a software editor that enables designers to map CV marker behavior to keyboard events; thus connecting the CV-driven tangible controllers to any software that responds to keyboard input.

## Building From Source
Currently we are still in early development of Beholder so we do not have any releases to give out yet. If you would like to try Beholder in it's current state, you may build it from source with the following instructions

## Windows Instructions
1. If you do not have it already install [node.js](https://nodejs.org/en).
2. Install OpenCV, on Windows it is easiest to do this from the [OpenCV installer](https://opencv.org/releases/). *Make sure you add OpenCV to Path or Beholder will not work properly.*
3. Clone this repository on to your computer and open a terminal at the root folder.
4. Run `npm install` in the terminal to install all of the Javascript dependencies.
5. Replace the `Native` folder in the code base with the [Windows Binaries Here](https://o365coloradoedu-my.sharepoint.com/:u:/g/personal/pegy8859_colorado_edu/EYBRymB2_sBGlkfNLS3GO0UB2dru28osh3_rWVrHQUybJA?e=JJ5ycQ).
6. Run `npm run build` in the terminal to build the Javascript code base.
7. Run `npm start` from the terminal and the app should open.
- *If you have issues with the camera feed try terminating the app and restarting it. You can tell the app is loading properly if the green play button appears.*

## Mac Instructions
1. If you do not have it already install [node.js](https://nodejs.org/en).
2. Install OpenCV, on Mac it is easiest to do this through Homebrew.
    - To install Homebrew, follow the instructions on their [website](https://brew.sh/).
    - To install OpenCV, use the following command in the terminal `brew install opencv`.
3. Clone this repository on to your computer and open a terminal at the root folder.
4. Run `npm install` in the terminal to install all of the Javascript dependencies.
5. Replace the `Native` folder in the code base with the [Mac Binaries Here](https://o365coloradoedu-my.sharepoint.com/:u:/g/personal/pegy8859_colorado_edu/ETYytOt6-dRDkEOfeW--43YB6-jo_Xnw0J_H8DrZOz-h1g?e=ouHBBh)
6. Run `npm run build` in the terminal to build the Javascript code base.
7. Run `npm start` from the terminal and the app should open.
- *If you have issues with the camera feed try terminating the app and restarting it. You can tell the app is loading properly if the green play button appears.*

## Usage
1. Run `npm start` from the terminal and the app should open.
2. If you see a green play button you are good to Go!

### Creating Nodes
To create nodes for now, we have a placeholder menu that appears as a drop down when you right click. There are...

### The Detection Node
For the detection to connect to markers and trigger keyboard emulation, you must create a `Webcam Detection` from the dropdown menu. You then need to connect the `FEED` property of that panel to the `Source` property of any marker nodes you want to use.

### Running A Beholder Program
Once you have a node chain that ends with a keyboard output node, you can test your application. All you need to do is click the green play button in the upper righthand corner. It should turn red to indicate that the program is running.

### Saving and Loading Beholder Programs
In the bottom right hand corner there are two icons, one is for downloading a program and the other is for uploading. Beholder saves programs as a JSON object and can be loaded at any time. We do not recommend modifying these files by hand.

## When developing
- Use the `npm run dev` command instead of the `build` command (this will automatically rebuild the JS when you make changes).
- Then open a separate terminal window to run `npm start`.
