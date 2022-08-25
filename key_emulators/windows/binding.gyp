{
  "targets": [
    {
      "target_name": "keyboard_emulator",
      "sources": [ "keyboard_emulator.cc" ],
      # 'include_dirs': [
      #   '<!@(node -p "require(\'node-addon-api\').include")',
      # ],
      # 'dependencies': ["<!(node -p \"require('node-addon-api').gyp\")"],
      'conditions': [
        ['OS == "win"', {
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