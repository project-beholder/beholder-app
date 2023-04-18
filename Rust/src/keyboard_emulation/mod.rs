#[cfg(target_os = "windows")] 
pub mod win;
#[cfg(target_os = "windows")] 
use win::*;

pub fn press_key(key: &String) {
    #[cfg(target_os = "windows")]
    press_key_win(key);
}

pub fn release_key(key: &String) {
    #[cfg(target_os = "windows")]
    release_key_win(key);
}