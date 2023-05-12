use std::env;
use std::fs;
use std::path::Path;

fn main() {
    #[cfg(target_os="windows")]
    copy_dlls_windows();
    
    println!("cargo:rerun-if-changed=build.rs");
}

fn copy_dlls_windows() {
    let opencv_dir = env::var_os("OPENCV_LINK_BIN").unwrap();
    let manifest_dir = env::var_os("CARGO_MANIFEST_DIR").unwrap();

    let build_type = env::var("PROFILE").unwrap();
    let copy_path = Path::new(&manifest_dir).join("target").join(build_type);
    // let opencv_libs = Path::new(&out_dir).join("test.txt");

    for entry in fs::read_dir(&opencv_dir).unwrap() {
        let path = entry.unwrap().path();
        if let Some(extension) = path.extension() {
            if extension == "dll" {
                println!("cargo:warning=Found file {:?}", path);
                let dest_path = copy_path.join(path.file_name().unwrap());
                println!("cargo:warning=Dest file {:?}", dest_path);
                fs::copy(path, dest_path).unwrap();
            }
        }
    }
}