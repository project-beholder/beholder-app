pub mod keys;
pub mod keyboard_emulation;
pub mod marker_detection;
pub mod json_parser;
pub mod beholder_tree;

use json_parser::BeholderJSON;
use beholder_tree::{BeholderTree, from_beholder_json};
use marker_detection::create_marker_detector;

use std::time::Instant;

fn main() {
    let file_path = "D:\\Code\\beholder-app\\Rust\\sample-json\\simple.json";
    let contents = std::fs::read_to_string(file_path).expect("Couldn't load file");

    let json: BeholderJSON = json_parser::parse(&contents);
    // let tree: BeholderTree = from_beholder_json(&json);
    
    let mut tree = from_beholder_json(&json);

    let mut marker_detector = create_marker_detector();

    let now = Instant::now();
    loop {
        // Detect and update markers
        marker_detector.observation_loop();
        let map = marker_detector.marker_map();

        tree.update(map);

        if now.elapsed().as_secs() > 10 { break; }
    }
}