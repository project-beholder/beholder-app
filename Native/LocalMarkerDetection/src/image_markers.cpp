#include <iostream>

#include <opencv2/highgui.hpp>
#include <opencv2/aruco_detector.hpp>
#include <opencv2/aruco/aruco_calib_pose.hpp>

using namespace std;
using namespace cv;

#include "image_markers.hpp"

ImageMarkers::ImageMarkers(Ptr<aruco::Dictionary> dictionary):detector(dictionary)
{}

bool ImageMarkers::detect(Mat& image)
{
    ImageMarkers::detector.detectMarkers(image, ImageMarkers::corners, ImageMarkers::ids);

    return (ImageMarkers::ids.size() > 0);
}

void ImageMarkers::draw(Mat& image)
{
    aruco::drawDetectedMarkers(image, ImageMarkers::corners, ImageMarkers::ids);
}

void ImageMarkers::get_json(string& buff)
{
    if (ImageMarkers::ids.size() == 0) return;
    
    // Initialize string
    buff = "{ \"markers\" : [";

    for (size_t i = 0; i < ImageMarkers::ids.size(); i++) {
        // Add ID
        buff.append(" { \"id\" : " + to_string(ImageMarkers::ids[i]) + " ,");

        // Add corners
        buff.append(" \"corners\" : [");
        for (size_t j = 0; j < ImageMarkers::corners[i].size(); j++) {
            buff.append(" [ " + to_string((int)ImageMarkers::corners[i][j].x) + " , " + to_string((int)ImageMarkers::corners[i][j].y) + " ] ,");
        }
        buff.erase(buff.end() - 1);
        buff.append(" ] } ,");
    }

    buff.erase(buff.end() - 1);
    buff.append("] }");
}