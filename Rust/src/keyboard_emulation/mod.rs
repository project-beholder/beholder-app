// #[cfg(target_os = "windows")] 
// pub mod win;
// #[cfg(target_os = "windows")] 
// use win::*;

// pub fn press_key(key: &String) {
//     #[cfg(target_os = "windows")]
//     press_key_win(key);
// }

// pub fn release_key(key: &String) {
//     #[cfg(target_os = "windows")]
//     release_key_win(key);
// }

use enigo::*;

pub fn press_key(key: &String) {
    let mut enigo = Enigo::new();

    enigo.key_down(Key::Layout(key.chars().nth(0).unwrap()));
}

pub fn release_key(key: &String) {
    let mut enigo = Enigo::new();

    enigo.key_up(Key::Layout(key.chars().nth(0).unwrap()));
}

pub fn tap_key(key: &String) {
    let mut enigo = Enigo::new();

    enigo.key_click(Key::Layout(key.chars().nth(0).unwrap()));
}