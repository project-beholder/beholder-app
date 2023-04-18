pub mod beholder_node;
use beholder_node::BeholderNode;

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize)]
pub struct BeholderJSON {
    pub nodes: HashMap<String, BeholderNode>,
}

pub fn parse(json_string: &str) -> BeholderJSON{
    let result: BeholderJSON = serde_json::from_str(json_string).unwrap();

    result
} 