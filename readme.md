# Beholder
Beholder is a computer vision (CV) toolkit for building tangible controllers for interactive computer systems. Beholder facilitates designers to build physical inputs that are instrumented with CV markers. By observing the properties of these markers, a CV system can detect physical interactions that occur. Beholder provides a software editor that enables designers to map CV marker behavior to keyboard events; thus connecting the CV-driven tangible controllers to any software that responds to keyboard input.

## Building From Source
Currently we are still in early development of Beholder so we do not have any releases to give out yet. If you would like to try Beholder in it's current state, you may build it from source with the following instructions

## Windows Instructions
1. If you do not have it already install [node.js](https://nodejs.org/en).
2. Install OpenCV version 4.7, on Windows it is easiest to do this from the [OpenCV installer](https://opencv.org/releases/). *Make sure you add OpenCV to Path or Beholder will not work properly.*
    - A tutorial on how to set OpenCV environment variables can be be found (here)[https://www.tutorialspoint.com/how-to-install-opencv-for-cplusplus-in-windows] in the "Setting Environment Vairables" section.
3. Clone this repository on to your computer and open a terminal at the root folder.
4. Run `npm install` in the terminal to install all of the Javascript dependencies.
5. Replace the `Native` folder in the code base with the [Windows Binaries Here](https://o365coloradoedu-my.sharepoint.com/:u:/g/personal/pegy8859_colorado_edu/EYBRymB2_sBGlkfNLS3GO0UB2dru28osh3_rWVrHQUybJA?e=JJ5ycQ).
6. Run `npm run build` in the terminal to build the Javascript code base.
7. Run `npm start` from the terminal and the app should open.

## Mac Instructions
1. If you do not have it already install [node.js](https://nodejs.org/en).
2. Install OpenCV version 4.7, on Mac it is easiest to do this through Homebrew.
    - To install Homebrew, follow the instructions on their [website](https://brew.sh/).
    - To install OpenCV, use the following command in the terminal `brew install opencv`.
3. Clone this repository on to your computer and open a terminal at the root folder.
4. Run `npm install` in the terminal to install all of the Javascript dependencies.
5. Replace the `Native` folder in the code base with the [Mac Binaries Here](https://o365coloradoedu-my.sharepoint.com/:u:/g/personal/pegy8859_colorado_edu/ETYytOt6-dRDkEOfeW--43YB6-jo_Xnw0J_H8DrZOz-h1g?e=ouHBBh)
6. Run `npm run build` in the terminal to build the Javascript code base.
7. Run `npm start` from the terminal and the app should open.

## Usage
1. Run `npm start` from the terminal and the app should open.
2. If you see a green play button you are good to Go!
- *If you have issues with the camera feed try terminating the app and restarting it. You can tell the app is loading properly if the green play button appears.*

Learn more about using Beholder by reading our paper or watching our presentation [here](https://dl.acm.org/doi/10.1145/3550471.3564764)

### Currently Available Nodes
To create nodes for now, we have a placeholder menu that appears as a drop down when you right click.

| Name                 | Category  | Description |
| -------------------- | --------- | ----------- |
| Detection Panel      | DETECTION | The root panel for all nodes. Connect the `FEED` attribute to a marker's `source` field for that marker to be detected. |
| Detect Marker        | MARKER    | A node for capturing marker values. The ID and Timeout properties can be set with a number node. Timeout refers to how long before the marker is considered not present when it is no longer detected. This can help with flickering. |
| Number               | VARIABLES | A node for setting integer values on other nodes. |
| Press Key            | KEYS      | Triggers key presses on the device, will hold down the key while provided a true value. |
| Tap Key              | KEYS      | Triggers key taps on the device, will tap the key once while provided a true value. |
| NOT Gate             | LOGIC     | Equivalent for to the NOT operation for boolean values. |
| AND Gate             | LOGIC     | Equivalent for to the AND operation for boolean values. |
| OR Gate              | LOGIC     | Equivalent for to the OR operation for boolean values. |
| Greater Than Gate    | LOGIC     | Passes along a true value when A > B. |
| Less Than Gate       | LOGIC     | Passes along a true value when A < B. |
| Value Change Trigger | LOGIC     | Sends a true value for one frame when the cumulative value change exceeds a threshold. |
| Angle Change Trigger | LOGIC     | Sends a true value for one frame when the cumulative anlge change exceeds a threshold. |

## When developing
- Use the `npm run dev` command instead of the `build` command (this will automatically rebuild the JS when you make changes).
- Then open a separate terminal window to run `npm start`.
