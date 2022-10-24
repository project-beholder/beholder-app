/*
 *
 * References:
 * https://docs.opencv.org/4.x/d5/dae/tutorial_aruco_detection.html
 */ 

#include <opencv2/highgui.hpp>
#include <opencv2/aruco_detector.hpp>
#include <opencv2/aruco/aruco_calib_pose.hpp>

#include <iostream>

using namespace std;
using namespace cv;

int main( int argc, char* argv[] )
{
    // Capture video stream from the input argument device
    VideoCapture inputVideo;
    inputVideo.open(0);

    // Obtain ArUco dictionary and create detector
    Ptr<aruco::Dictionary> dictionary = aruco::getPredefinedDictionary(aruco::DICT_4X4_250);
    aruco::ArucoDetector detector(dictionary);

    while (inputVideo.grab()) {
        // Capture frame
        Mat image, imageCopy;
        inputVideo.retrieve(image);
        image.copyTo(imageCopy);

        // Flip image
        flip(imageCopy, image, 0);

        // Detect markers
        vector<int> ids;
        vector<vector<Point2f>> corners, rejected;
        detector.detectMarkers(image, corners, ids, rejected);

        // If marker detected, show
        if (ids.size() > 0)
            aruco::drawDetectedMarkers(image, corners, ids);

        // Show image
        imshow("out", image);
        char key = (char) waitKey(10);
        if (key == 27)
            break; 
    }
}