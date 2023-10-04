use std::collections::HashMap;

#[derive(Debug)]
pub struct MarkerInfo {
    id: i32,
    d: bool,
    x: i32,
    y: i32,
    a: i32
}

#[derive(Debug)]
pub enum MarkerProperties {
    D, 
    X, 
    Y, 
    A,
    Default
}

pub struct MarkerMap {
    pub map: HashMap<i32, MarkerInfo>
}

impl MarkerMap {
    pub fn update_marker(&mut self, id: i32, d: bool, x: i32, y: i32, a: i32) {
        self.map.insert(id, MarkerInfo{
            id,
            d,
            x,
            y,
            a
        });
    }

    pub fn get_marker_detect(&self, id: &i32) -> bool {
        match self.map.get(id) {
            Some(marker) => marker.d,
            _ => {
                println!("[ERROR] Marker {} not found", id);
                false
            }
        }
    }

    pub fn get_marker_prop(&self, id: &i32, prop: &str) -> i32 {
        match self.map.get(id) {
            Some(marker) => {
                match prop {
                    "x" => marker.x,
                    "y" => marker.y,
                    "a" => marker.a,
                    _ => 0
                }
            },
            _ => {
                println!("[ERROR] Marker {} not found", id);
                0
            }
        }
    }

    pub fn get_marker_x(&self, id: &i32) -> i32 {
        match self.map.get(id) {
            Some(marker) => marker.x,
            _ => {
                println!("[ERROR] Marker {} not found", id);
                0
            }
        }
    }

    pub fn get_marker_y(&self, id: &i32) -> i32 {
        match self.map.get(id) {
            Some(marker) => marker.y,
            _ => {
                println!("[ERROR] Marker {} not found", id);
                0
            }
        }
    }

    pub fn get_marker_angle(&self, id: &i32) -> i32 {
        match self.map.get(id) {
            Some(marker) => marker.a,
            _ => {
                println!("[ERROR] Marker {} not found", id);
                0
            }
        }
    }
    

    pub fn print_markers(&self) {
        for (k, v) in &self.map {
            println!("[INFO] M{k}: {:?}", v);
        }
    }
}