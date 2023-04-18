pub mod nodes;
use self::nodes::{GeneralNode};

use std::collections::HashMap;
use crate::{json_parser::BeholderJSON, marker_detection::MarkerInfo, keyboard_emulation};

pub struct BeholderTree {
    map: HashMap<String, GeneralNode>,
    root: String
}

pub fn from_beholder_json(json: &BeholderJSON) -> BeholderTree{
    let mut tree = BeholderTree {
        map: HashMap::new(),
        root: String::new()
    };
    
    for (key, value) in &json.nodes {
        let node = value.create_node();
        tree.map.insert(key.clone(), node);

        match value.r#type().as_str() {
            "detection" => tree.root = key.clone(),
            _ => ()
        }
    }

    tree
}

impl BeholderTree {
    pub fn update(&mut self, marker_map: &HashMap<i32, MarkerInfo>) {
        // update_node(&self.root, &mut self.map, marker_map)
        let mut queue: Vec<String> = Vec::new();
        self.create_queue(&self.root, &mut queue);

        let mut prev_val = false;
        for key in queue {
            self.update_node(&key, marker_map, &mut prev_val);
        }
    }

    fn create_queue(&self, key: &String, queue: &mut Vec<String>) {
        match self.map.get(key).unwrap() {
            GeneralNode::Detect(node) => {
                println!("[DetectionNode] {}", key);
                queue.push(key.clone());
                for out in &node.outputs {
                    self.create_queue(out, queue);
                }
            },
            GeneralNode::Marker(node) => {
                println!("[MarkerNode] {}", key);
                queue.push(key.clone());
                for out in &node.detect_outputs {
                    self.create_queue(out, queue);
                }
                for out in &node.pos_x_outputs {
                    self.create_queue(out, queue);
                }
                for out in &node.pos_y_outputs {
                    self.create_queue(out, queue);
                }
                for out in &node.angle_outputs {
                    self.create_queue(out, queue);
                }
            },
            GeneralNode::KeyPress(node) => {
                println!("[KeyPressNode] {}", key);
                queue.push(key.clone());
            }
            _ => ()
        }
    }

    fn update_node(&mut self, key: &String, marker_map: &HashMap<i32, MarkerInfo>, prev_val: &mut bool) {
        match self.map.get_mut(key).unwrap(){
            GeneralNode::Detect(node) => (),
            GeneralNode::Marker(node) => {
                match marker_map.get(&node.id) {
                    Some(marker) => {
                        node.update_marker(true, marker.x(), marker.y(), marker.angle());
                        println!("[MarkerNode] Updated marker {:?}", marker );
                    },
                    None => {
                        node.update_marker(false, node.pos_x, node.pos_y, node.angle);
                        println!("[MarkerNode] Marker {} not present", node.id);
                    }
                }
                *prev_val = node.detect_value.clone();
            },
            GeneralNode::KeyPress(node) => {
                if (*prev_val) {
                    keyboard_emulation::press_key(&node.value);
                    println!("[KeyPressNode] Pressed");
                }
                else {
                    keyboard_emulation::release_key(&node.value);
                    println!("[KeyPressNode] Released");
                }
            }
            _ => ()
        }
    }
}