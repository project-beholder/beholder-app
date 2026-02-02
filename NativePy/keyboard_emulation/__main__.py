import json
from pynput.keyboard import Key, Controller 

kb = Controller()

def press_key(key):
  # Perform keyboard emulation using the pynput library 

  # First handle special cases 
  if key == 'SPACE': kb.press(Key.space)
  elif key == 'RETURN': kb.press(Key.enter)
  elif key == 'TAB': kb.press(Key.tab)
  elif key == 'LT': kb.press(Key.left)
  elif key == 'UP': kb.press(Key.up)
  elif key == 'RT': kb.press(Key.right)
  elif key == 'DN': kb.press(Key.down)

  else: kb.press(key)


def release_key(key):
  # Perform keyboard emulation using the pynput library 

  # First handle special cases 
  if key == 'SPACE': kb.release(Key.space)
  elif key == 'RETURN': kb.release(Key.enter)  
  elif key == 'TAB': kb.release(Key.tab)
  elif key == 'LT': kb.release(Key.left)
  elif key == 'UP': kb.release(Key.up)
  elif key == 'RT': kb.release(Key.right)
  elif key == 'DN': kb.release(Key.down)

  else: kb.release(key)

debug = {}
debug["status"] = "All-ok"

while True:
    # Input command as P:A or R:A
    command = input()
    key_code = str(command[2:]).rstrip()
    print(f'Key: [{key_code}], {type(key_code)}, {len(key_code)}')

    if command[0] == 'P': 
        press_key(key_code)
    else:
        release_key(key_code)
