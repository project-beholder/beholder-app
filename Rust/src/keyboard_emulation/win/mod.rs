// Using code at https://gist.github.com/littletsu/d1c1b512d6843071144b7b89109a8de2

use winapi::um::winuser::{INPUT_u, INPUT, INPUT_KEYBOARD, KEYBDINPUT, SendInput};

pub mod keycodes;
use crate::keys::Key;

const KEYUP: u32 = 0x0002;
const KEYDN: u32 = 0x0000;

pub fn press_key_win(key: &String) {
    let keycode: u16 = keycodes::get_key_code(key);

    let mut input_u: INPUT_u = unsafe { std::mem::zeroed() };
    unsafe {
        *input_u.ki_mut() = KEYBDINPUT {
            wVk: keycode,
            dwExtraInfo: 0,
            wScan: 0,
            time: 0,
            dwFlags: KEYDN
        }
    }

    let mut input = INPUT {
        type_: INPUT_KEYBOARD,
        u: input_u
    };
    let ipsize = std::mem::size_of::<INPUT>() as i32;
    unsafe {
        SendInput(1, &mut input, ipsize);
    };
}

pub fn release_key_win(key: &String) {
    let keycode: u16 = keycodes::get_key_code(key);

    let mut input_u: INPUT_u = unsafe { std::mem::zeroed() };
    unsafe {
        *input_u.ki_mut() = KEYBDINPUT {
            wVk: keycode,
            dwExtraInfo: 0,
            wScan: 0,
            time: 0,
            dwFlags: KEYUP
        }
    }

    let mut input = INPUT {
        type_: INPUT_KEYBOARD,
        u: input_u
    };
    let ipsize = std::mem::size_of::<INPUT>() as i32;
    unsafe {
        SendInput(1, &mut input, ipsize);
    };
}


