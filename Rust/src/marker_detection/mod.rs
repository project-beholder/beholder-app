use std::{collections::HashMap};

use opencv::{
    prelude::*,
    core,
    videoio,
    highgui,
    objdetect,
    types::{VectorOfVectorOfPoint2f, VectorOfi32},
};

#[derive(Debug)]
pub struct MarkerInfo {
    id: i32,
    x: f32,
    y: f32,
    angle: f32,
}

impl MarkerInfo {
    pub fn x(&self) -> f32 {
        self.x
    }
    pub fn y(&self) -> f32 {
        self.y
    }
    pub fn angle(&self) -> f32 {
        self.angle
    }

}

pub struct MarkerDetector {
    cam: videoio::VideoCapture,
    frame: Mat,
    detector: objdetect::ArucoDetector,
    marker_map: HashMap<i32, MarkerInfo>
}



pub fn create_marker_detector() -> MarkerDetector {
    // Set up ArUco
    let dict = objdetect::get_predefined_dictionary(objdetect::PredefinedDictionaryType::DICT_4X4_100).unwrap();
    let param = objdetect::DetectorParameters::default().unwrap();
    let refine = objdetect::RefineParameters::new(10.0, 3.0, true).unwrap();

    MarkerDetector { 
        cam: videoio::VideoCapture::new(0, videoio::CAP_ANY).unwrap(), 
        frame: Mat::default(), 
        detector: objdetect::ArucoDetector::new(&dict, &param, refine).unwrap(),
        marker_map: HashMap::new()
    }
}

impl MarkerDetector {
    pub fn observation_loop(&mut self) {
        self.cam.read(&mut self.frame).unwrap();
        // let mut img = Mat::default();
        // let s = core::Size::new(320, 240);
        // opencv::imgproc::resize(&self.frame, &mut img, s, 0.0, 0.0, opencv::imgproc::INTER_LINEAR).unwrap();
        // opencv::imgproc::resize(&self.frame, &mut img, core::Size(), 0.5, 0.5, INTER_LINEAR);

        // Detect markers
        let mut corners: VectorOfVectorOfPoint2f = VectorOfVectorOfPoint2f::new();
        let mut rejected: VectorOfVectorOfPoint2f = VectorOfVectorOfPoint2f::new();
        let mut ids: VectorOfi32 = VectorOfi32::new();

        self.detector.detect_markers(&self.frame, &mut corners, &mut ids, &mut rejected).unwrap();

        if ids.len() > 0 {
            let color: core::Scalar = core::Scalar::new(0.0, 0.0, 255.0, 0.0);
            objdetect::draw_detected_markers(&mut self.frame, &corners, &ids, color).unwrap();
        }

        // Update marker map
        self.marker_map.clear();

        for i in (0..ids.len()) {
            let id = ids.get(i).unwrap();
            let x1 = corners.get(i).unwrap().get(0).unwrap().x;
            let y1 = corners.get(i).unwrap().get(0).unwrap().y;
            let x2 = corners.get(i).unwrap().get(0).unwrap().x;
            let y2 = corners.get(i).unwrap().get(0).unwrap().y;

            let angle = (y2 - y1).atan2(x2 - x1);

            let marker = MarkerInfo {
                id,
                x: x1,
                y: x2,
                angle
            };

            self.marker_map.insert(id, marker);

            // highgui::imshow("beholder", &self.frame).unwrap();
        }

    } 

    pub fn marker_map(&self) -> &HashMap<i32, MarkerInfo> {
        &self.marker_map
    }
}

// pub fn observation_loop() -> opencv::Result<()>{
//     highgui::named_window("beholder", highgui::WINDOW_FULLSCREEN)?;

//     let mut cam: videoio::VideoCapture = videoio::VideoCapture::new(0, videoio::CAP_ANY)?;
//     let mut frame: Mat = Mat::default();

//     // Set up ArUco
//     let dict = objdetect::get_predefined_dictionary(objdetect::PredefinedDictionaryType::DICT_4X4_100)?;
//     let param = objdetect::DetectorParameters::default()?;
//     let refine = objdetect::RefineParameters::new(10.0, 3.0, true)?;

//     let detector = objdetect::ArucoDetector::new(&dict, &param, refine)?;

//     loop {
//         cam.read(&mut frame)?;

//         // Detect markers
//         let mut corners: VectorOfVectorOfPoint2f = VectorOfVectorOfPoint2f::new();
//         let mut rejected: VectorOfVectorOfPoint2f = VectorOfVectorOfPoint2f::new();
//         let mut ids: VectorOfi32 = VectorOfi32::new();

//         detector.detect_markers(&frame, &mut corners, &mut ids, &mut rejected)?;

//         if ids.len() > 0 {
//             let color: core::Scalar = core::Scalar::new(0.0, 0.0, 255.0, 0.0);
//             objdetect::draw_detected_markers(&mut frame, &corners, &ids, color)?;
//         }

//         highgui::imshow("beholder", &frame)?;
//         let key = highgui::wait_key(1)?;
//         if key == 113 {
//             break;
//         }

//     }

//     Ok(())
// }