#include <node.h>

// Include openCV libraries
#include <opencv2/highgui.hpp>
#include <opencv2/aruco_detector.hpp>
#include <opencv2/aruco/aruco_calib_pose.hpp>

#include <iostream>

#include "aruco_samples_utility.hpp"

namespace demo {
    using v8::Exception;
    using v8::FunctionCallbackInfo;
    using v8::Isolate;
    using v8::Local;
    using v8::Number;
    using v8::Object;
    using v8::String;
    using v8::Value;

    using namespace cv;

    void Detect(const FunctionCallbackInfo<Value>& args) {
        Isolate* isolate = args.GetIsolate();

        if (!args[0]->IsNumber()) {
            isolate->ThrowException(Exception::TypeError(
                String::NewFromUtf8(isolate, "Wrong arguments").ToLocalChecked()
            ));
            return;
        }
        
        // Capture video stream from the input argument device
        VideoCapture inputVideo;
        inputVideo.open(args[0].As<Number>()->Value());

        // Obtain ArUco dictionary and create detector
        Ptr<aruco::Dictionary> dictionary = aruco::getPredefinedDictionary(aruco::DICT_ARUCO_ORIGINAL);
        aruco::ArucoDetector detector(dictionary);

        // Capture one frame and detect markers
        inputVideo.grab();
        Mat image, imageCopy; 
        inputVideo.retrieve(image);
        image.copyTo(imageCopy);

        // Detect markers
        std::vector<int> ids;
        std::vector<std::vector<cv::Point2f>> corners, rejected;
        detector.detectMarkers(image, corners, ids, rejected);

        // If at least one marker detected, show marker
        if (ids.size() > 0)
            aruco::drawDetectedMarkers(imageCopy, corners, ids);

        // Show image
        //imshow("out", imageCopy);
        imwrite("output.png", imageCopy);
    }    

    void Initialize(Local<Object> exports) {
        NODE_SET_METHOD(exports, "detect", Detect);
    }

    NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize);
}