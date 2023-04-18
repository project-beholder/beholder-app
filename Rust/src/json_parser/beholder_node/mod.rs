use std::{collections::HashMap};

use serde::{Deserialize, Serialize};

use crate::beholder_tree::nodes::{
    GeneralNode,
    DetectionNode,
    MarkerNode,
    KeyPressNode
};

#[derive(Debug)]
#[derive(Serialize, Deserialize)]
#[serde(untagged)]
pub enum PropertyValues {
    Number(i32),
    Key(String),
    Bool(bool),
}

#[derive(Debug)]
#[derive(Serialize, Deserialize)]
pub struct InputNode {
    name: String,
    source: String,
    sourceField: String,
    valueType: String,
}

#[derive(Debug)]
#[derive(Serialize, Deserialize)]
pub struct OutputNode {
    name: String,
    property: String,
    targets: Vec<OutputTarget>,
    valueType: String,
}

impl OutputNode {
    fn targets(&self) -> Vec<String> {
        let mut out = Vec::new();
        for target in &self.targets {
            out.push(target.uuid.clone());
        }
        out
    }
}

#[derive(Debug)]
#[derive(Serialize, Deserialize)]
pub struct OutputTarget {
    uuid: String,
    field: String,
}

#[derive(Debug)]
#[derive(Serialize, Deserialize)]
pub struct BeholderNode {
    r#type: String,
    uuid: String,
    properties: HashMap<String, PropertyValues>,
    inputs: HashMap<String, InputNode>,
    outputs: HashMap<String, OutputNode>,
    selected: bool,
}

impl BeholderNode {
    pub fn r#type(&self) -> &String {
        &self.r#type
    }
    pub fn inputs(&self) -> &HashMap<String, InputNode> {
        &self.inputs
    }
    pub fn outputs(&self) -> &HashMap<String, OutputNode> {
        &self.outputs
    }

    pub fn create_node(&self) -> GeneralNode {
        match self.r#type.as_str() {
            "detection" => 
                GeneralNode::Detect(DetectionNode {
                    uuid: self.uuid.clone(),
                    cam_id: match self.properties.get("camID").unwrap() {
                        PropertyValues::Number(val) => val.clone(),
                        _ => 0
                    },
                    outputs: self.outputs.get("FEED").unwrap().targets()
                }),
            "marker" => 
                GeneralNode::Marker(MarkerNode {
                    uuid: self.uuid.clone(),
                    id: match self.properties.get("ID").unwrap() {
                        PropertyValues::Number(val) => val.clone(),
                        _ => 0
                    },
                    timeout: match self.properties.get("timeout").unwrap() {
                        PropertyValues::Number(val) => val.clone(),
                        _ => 0
                    },
                    detect_value: false,
                    detect_outputs: self.outputs.get("DETECT").unwrap().targets(),
                    pos_x: 0.0,
                    pos_x_outputs: self.outputs.get("X").unwrap().targets(), 
                    pos_y: 0.0,
                    pos_y_outputs: self.outputs.get("Y").unwrap().targets(), 
                    angle: 0.0,
                    angle_outputs: self.outputs.get("ANGLE").unwrap().targets(), 
                }),
            "key-press" => {
                GeneralNode::KeyPress(KeyPressNode {
                    uuid: self.uuid.clone(),
                    value: match self.properties.get("value").unwrap() {
                        PropertyValues::Key(val) => val.clone(),
                        _ => String::from("_")
                    },
                    is_down: false,
                })
            },
            _ => GeneralNode::None(0)
        }
    }
}