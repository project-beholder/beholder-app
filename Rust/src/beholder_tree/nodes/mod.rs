use std::{collections::HashMap};

use crate::{marker_detection::MarkerInfo};

#[derive(Debug)]
pub enum GeneralNode {
    Detect(DetectionNode),
    Marker(MarkerNode),
    KeyPress(KeyPressNode),
    None(i32),
}

// pub fn update_node(key: &String, map: &mut HashMap<String, GeneralNode>, marker_map: &HashMap<i32, MarkerInfo>) {
//     match map.get_mut(key).unwrap() {
//         GeneralNode::Detect(node) => {
//             println!("[DetectionNode]");
//             for out in &node.outputs {
//                 update_node(out, map, marker_map);
//             }
//         },
//         GeneralNode::Marker(node) => {
//             match marker_map.get(&node.id) {
//                 Some(marker) => {
//                     node.update_marker(marker.x(), marker.y(), marker.angle());
//                     // node.pos_x = marker.x().clone();
//                     // node.pos_y = marker.y().clone();
//                     // node.angle = marker.angle().clone();
//                     println!("[MarkerNode] Updated {}", &node.id );
//                 },
//                 None => ()
//             }
//         },
//         _ => println!("Lol done"),

//     }
// }

#[derive(Debug)]
pub struct DetectionNode {
    pub uuid: String,
    pub cam_id: i32,
    pub outputs: Vec<String>
}

#[derive(Debug)]
pub struct MarkerNode {
    pub uuid: String,
    pub id: i32,
    pub timeout: i32,
    pub detect_value: bool,
    pub detect_outputs: Vec<String>,
    pub pos_x: f32,
    pub pos_x_outputs: Vec<String>,
    pub pos_y: f32, 
    pub pos_y_outputs: Vec<String>,
    pub angle: f32, 
    pub angle_outputs: Vec<String> 
}

impl MarkerNode {
    pub fn update_marker(&mut self, present: bool, x: f32, y: f32, angle: f32) {
        self.detect_value = present;
        self.pos_x = x;
        self.pos_y = y;
        self.angle = angle;        
    }
    pub fn bool_value(&self) -> bool {
        self.detect_value
    }
}

#[derive(Debug)]
pub struct KeyPressNode {
    pub uuid: String,
    pub value: String,
    pub is_down: bool
}