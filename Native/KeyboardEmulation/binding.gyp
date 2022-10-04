{
  "targets": [
    {
      "target_name": "keyboard_emulator",
      # "sources": [ 
      #   "keyboard_emulator_win.cc" ],
      
      # 'include_dirs': [
      #   '<!@(node -p "require(\'node-addon-api\').include")',
      # ],
      # 'dependencies': ["<!(node -p \"require('node-addon-api').gyp\")"],
      'conditions': [
        ['OS == "mac"', {
          'sources': [ 'keyboard_emulator_mac.cc' ],
          'xcode_settings': {
            'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
          },
          'include_dirs': [
            'System/Library/Frameworks/ApplicationServices.framework/Headers'
          ],
          'link_settings': {
            'libraries': [
              '-framework ApplicationServices',
            ]
          }
        }],
        [
          'OS == "win"', {
            'sources': ['keyboard_emulator_win.cc'],
          }
        ]
      ],
    },
    {
      "target_name": "marker_detection",
      'conditions': [
        ['OS == "win"', {
          'sources': [ 'marker_detection/src/marker_detection_win.cc' ],
          'include_dirs': [
            'marker_detection/include',
            'C:/OpenCV-4.5.5/install/install/opencv/include'
          ],
          'libraries': [
            'C:/OpenCV-4.5.5/install/install/opencv/x64/vc17/lib/opencv_world460.lib'
          ]
        }],
      ]
    }
  ]
}