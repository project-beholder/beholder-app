#include <iostream>

#include <opencv2/highgui.hpp>
#include <opencv2/aruco_detector.hpp>
#include <opencv2/aruco/aruco_calib_pose.hpp>

using namespace cv;
using namespace std;

class ImageMarkers
{
    private:
    vector<int> ids;
    vector<vector<Point2f>> corners;
    aruco::ArucoDetector detector;

    public: 
    // Constructor
    ImageMarkers(Ptr<aruco::Dictionary>);
    
    bool detect(Mat&);
    void draw(Mat&);
    void get_json(string&); 
};