{
  "targets": [
    {
      "target_name": "keyboard_emulator",
      "sources": [ "keyboard_emulator.cc" ],
      'xcode_settings': {
        'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
      },
      # 'include_dirs': [
      #   '<!@(node -p "require(\'node-addon-api\').include")',
      # ],
      # 'dependencies': ["<!(node -p \"require('node-addon-api').gyp\")"],
      'conditions': [
        ['OS == "mac"', {
          'include_dirs': [
            'System/Library/Frameworks/ApplicationServices.framework/Headers'
          ],
          'link_settings': {
            'libraries': [
              '-framework ApplicationServices',
            ]
          }
        }],
      ],
    }
  ]
}